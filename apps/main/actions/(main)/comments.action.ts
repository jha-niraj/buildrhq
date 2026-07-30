"use server"

import { getSession } from "@repo/auth";
import { headers } from "next/headers";
import {
    db,
    users,
    comments,
    projectIdeas,
    projectsV2,
} from "@repo/db";
import { eq, and, sql, asc, gte, count } from "drizzle-orm";
import type {
    CommentEntityType,
    CommentNode,
    AddCommentInput,
    GetCommentsResult,
    MutateCommentResult,
    DeleteCommentResult,
} from "@/types/comments";
import { COMMENT_MIN_LENGTH, COMMENT_MAX_LENGTH } from "@/types/comments";

// ===============================================
// HELPERS
// ===============================================

/** Max comments one account may post in RATE_LIMIT_WINDOW_MS. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Narrow an unknown catch value to a message without reaching for `any`.
 * (AI_CODE_RULES.md prohibits `any`; the existing project-ideas action predates
 * that rule and is intentionally left alone.)
 */
function errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * The comment table is polymorphic, so the DATABASE cannot guarantee `entityId`
 * points at a real row (see the note at the top of packages/db/src/schema/comments.ts).
 * Every write goes through here first, which is where that guarantee actually lives.
 */
async function entityExists(entityType: CommentEntityType, entityId: string): Promise<boolean> {
    switch (entityType) {
        case "PROJECT_IDEA": {
            const [row] = await db
                .select({ id: projectIdeas.id })
                .from(projectIdeas)
                .where(eq(projectIdeas.id, entityId))
                .limit(1);
            return !!row;
        }
        case "PROJECT": {
            const [row] = await db
                .select({ id: projectsV2.id })
                .from(projectsV2)
                .where(eq(projectsV2.id, entityId))
                .limit(1);
            return !!row;
        }
        default:
            // Exhaustive today; a new enum member lands here until it is wired up,
            // which fails the write rather than silently accepting an unvalidated id.
            return false;
    }
}

/** Resolve the signed-in user's id, or null for a logged-out visitor. */
async function currentUserId(): Promise<string | null> {
    const session = await getSession(headers());
    if (!session?.user?.email) return null;

    const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

    return user?.id ?? null;
}

/** Live count of non-deleted comments on an entity. */
async function liveCommentCount(entityType: CommentEntityType, entityId: string): Promise<number> {
    const [row] = await db
        .select({ value: count() })
        .from(comments)
        .where(and(
            eq(comments.entityType, entityType),
            eq(comments.entityId, entityId),
            eq(comments.isDeleted, false),
        ));
    return row?.value ?? 0;
}

/** Shape returned by the flat select below, before it is folded into a tree. */
interface FlatCommentRow {
    id: string;
    entityType: CommentEntityType;
    entityId: string;
    parentId: string | null;
    body: string;
    isDeleted: boolean;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    authorName: string | null;
    authorImage: string | null;
}

function toNode(row: FlatCommentRow, viewerId: string | null): CommentNode {
    return {
        id: row.id,
        entityType: row.entityType,
        entityId: row.entityId,
        parentId: row.parentId,
        // A deleted body never leaves the server. The UI renders a tombstone.
        body: row.isDeleted ? "" : row.body,
        isDeleted: row.isDeleted,
        isEdited: row.isEdited,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        author: { id: row.authorId, name: row.authorName, image: row.authorImage },
        isMine: viewerId !== null && row.authorId === viewerId,
        replies: [],
    };
}

// ===============================================
// READ
// ===============================================

/**
 * The whole thread for an entity as a nested tree.
 *
 * Root comments newest first, replies oldest first (a reply chain reads top-down
 * like a conversation; a root list reads best with the freshest at the top).
 *
 * Works for a logged-out visitor — reading never requires an account, and every
 * node comes back with `isMine: false` in that case.
 */
export async function getComments(
    entityType: CommentEntityType,
    entityId: string,
): Promise<GetCommentsResult> {
    try {
        if (!entityId) {
            return { success: false, error: "Missing entity id" };
        }

        const viewerId = await currentUserId();

        // One flat query + an in-memory fold. A recursive CTE would let the
        // database do the nesting, but a thread is small and bounded by the
        // entity, so the round trip costs more than the fold.
        const rows = await db
            .select({
                id: comments.id,
                entityType: comments.entityType,
                entityId: comments.entityId,
                parentId: comments.parentId,
                body: comments.body,
                isDeleted: comments.isDeleted,
                isEdited: comments.isEdited,
                createdAt: comments.createdAt,
                updatedAt: comments.updatedAt,
                authorId: users.id,
                authorName: users.name,
                authorImage: users.image,
            })
            .from(comments)
            .innerJoin(users, eq(comments.userId, users.id))
            .where(and(
                eq(comments.entityType, entityType),
                eq(comments.entityId, entityId),
            ))
            .orderBy(asc(comments.createdAt));

        const byId = new Map<string, CommentNode>();
        for (const row of rows) {
            byId.set(row.id, toNode(row as FlatCommentRow, viewerId));
        }

        const roots: CommentNode[] = [];
        for (const row of rows) {
            const node = byId.get(row.id);
            if (!node) continue;
            // A parent outside this entity (or missing) is treated as a root so the
            // comment stays reachable instead of vanishing from the thread.
            const parent = row.parentId ? byId.get(row.parentId) : undefined;
            if (parent) parent.replies.push(node);
            else roots.push(node);
        }

        // Rows arrived oldest-first, so replies are already in the right order.
        // Only the roots need flipping.
        roots.reverse();

        const liveCount = rows.filter((r) => !r.isDeleted).length;

        return { success: true, data: roots, count: liveCount };
    } catch (error: unknown) {
        console.error("Failed to fetch comments:", error);
        return { success: false, error: errorMessage(error, "Failed to fetch comments") };
    }
}

// ===============================================
// WRITE
// ===============================================

export async function addComment(input: AddCommentInput): Promise<MutateCommentResult> {
    try {
        const session = await getSession(headers());
        if (!session?.user?.email) {
            return { success: false, error: "You must be logged in to comment" };
        }

        const [user] = await db
            .select({ id: users.id, name: users.name, image: users.image })
            .from(users)
            .where(eq(users.email, session.user.email));

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const { entityType, entityId, parentId } = input;
        const body = input.body.trim();

        if (body.length < COMMENT_MIN_LENGTH) {
            return { success: false, error: `Comment must be at least ${COMMENT_MIN_LENGTH} characters` };
        }
        if (body.length > COMMENT_MAX_LENGTH) {
            return { success: false, error: `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer` };
        }

        if (!(await entityExists(entityType, entityId))) {
            return { success: false, error: "That item no longer exists" };
        }

        // Rate limit per ACCOUNT. Never per IP or user agent — those are shared by
        // real people (campus NAT, office egress) and trivially spoofed, so they
        // punish innocent users while stopping nobody.
        const [recent] = await db
            .select({ value: count() })
            .from(comments)
            .where(and(
                eq(comments.userId, user.id),
                gte(comments.createdAt, new Date(Date.now() - RATE_LIMIT_WINDOW_MS)),
            ));

        if ((recent?.value ?? 0) >= RATE_LIMIT_MAX) {
            return { success: false, error: "You're commenting too quickly. Give it a minute." };
        }

        // A reply must hang off a comment on the SAME entity, or a crafted parentId
        // would graft this comment into an unrelated thread.
        if (parentId) {
            const [parent] = await db
                .select({ id: comments.id })
                .from(comments)
                .where(and(
                    eq(comments.id, parentId),
                    eq(comments.entityType, entityType),
                    eq(comments.entityId, entityId),
                ))
                .limit(1);

            if (!parent) {
                return { success: false, error: "The comment you're replying to no longer exists" };
            }
        }

        const insertRow = db
            .insert(comments)
            .values({
                entityType,
                entityId,
                userId: user.id,
                parentId: parentId ?? null,
                body,
            })
            .returning();

        // The denormalised counter moves atomically with the insert — the intent
        // behind `toggleProjectUpvote`'s db.transaction. It is `db.batch` and not
        // `db.transaction` because the shared client is drizzle's neon-http driver,
        // whose `.transaction()` throws "No transactions support in neon-http
        // driver" at runtime. `.batch()` dispatches through Neon's HTTP transaction
        // endpoint, so these two statements still commit or roll back together.
        // `entityId` is known before the write here, so both statements can be
        // built upfront — the delete path can't do that (see deleteComment).
        const result = entityType === "PROJECT_IDEA"
            ? (await db.batch([
                insertRow,
                db
                    .update(projectIdeas)
                    .set({ commentCount: sql`${projectIdeas.commentCount} + 1` })
                    .where(eq(projectIdeas.id, entityId)),
            ]))[0][0]
            : (await insertRow)[0];

        if (!result) {
            return { success: false, error: "Failed to add comment" };
        }

        const node: CommentNode = {
            id: result.id,
            entityType: result.entityType,
            entityId: result.entityId,
            parentId: result.parentId,
            body: result.body,
            isDeleted: result.isDeleted,
            isEdited: result.isEdited,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            author: { id: user.id, name: user.name, image: user.image },
            isMine: true,
            replies: [],
        };

        return { success: true, data: node, count: await liveCommentCount(entityType, entityId) };
    } catch (error: unknown) {
        console.error("Failed to add comment:", error);
        return { success: false, error: errorMessage(error, "Failed to add comment") };
    }
}

export async function updateComment(id: string, body: string): Promise<MutateCommentResult> {
    try {
        const session = await getSession(headers());
        if (!session?.user?.email) {
            return { success: false, error: "You must be logged in to edit a comment" };
        }

        const [user] = await db
            .select({ id: users.id, name: users.name, image: users.image })
            .from(users)
            .where(eq(users.email, session.user.email));

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const trimmed = body.trim();
        if (trimmed.length < COMMENT_MIN_LENGTH) {
            return { success: false, error: `Comment must be at least ${COMMENT_MIN_LENGTH} characters` };
        }
        if (trimmed.length > COMMENT_MAX_LENGTH) {
            return { success: false, error: `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer` };
        }

        // Ownership is a WHERE clause, not a JavaScript comparison. Fetching the row,
        // checking ids in JS, then writing leaves a window where the two disagree —
        // and it is one forgotten `if` away from letting anyone edit anything.
        const [updated] = await db
            .update(comments)
            .set({ body: trimmed, isEdited: true })
            .where(and(
                eq(comments.id, id),
                eq(comments.userId, user.id),
                eq(comments.isDeleted, false),
            ))
            .returning();

        if (!updated) {
            // Same message whether the row is missing, deleted, or someone else's —
            // this endpoint should not confirm that a given comment id exists.
            return { success: false, error: "Comment not found or not yours to edit" };
        }

        const node: CommentNode = {
            id: updated.id,
            entityType: updated.entityType,
            entityId: updated.entityId,
            parentId: updated.parentId,
            body: updated.body,
            isDeleted: updated.isDeleted,
            isEdited: updated.isEdited,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
            author: { id: user.id, name: user.name, image: user.image },
            isMine: true,
            replies: [],
        };

        return { success: true, data: node };
    } catch (error: unknown) {
        console.error("Failed to update comment:", error);
        return { success: false, error: errorMessage(error, "Failed to update comment") };
    }
}

export async function deleteComment(id: string): Promise<DeleteCommentResult> {
    try {
        const session = await getSession(headers());
        if (!session?.user?.email) {
            return { success: false, error: "You must be logged in to delete a comment" };
        }

        const [user] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, session.user.email));

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // One statement, so the soft delete and the counter decrement are inherently
        // atomic — no transaction needed, which matters because the shared neon-http
        // client has none (see the note in addComment).
        //
        // A CTE rather than a two-statement batch because the decrement has to be
        // CONDITIONAL on the ownership-scoped UPDATE actually matching a row. Two
        // separate statements can't express that: on a repeat delete the UPDATE
        // matches nothing (its WHERE requires isDeleted = false) while a standalone
        // decrement would still see a deleted row and fire again, drifting the
        // counter down on every retry. Chaining off `deleted` makes the decrement
        // run exactly as many times as the UPDATE succeeded — zero or one.
        //
        // Ownership stays in the WHERE clause, not in JavaScript.
        const result = await db.execute<{ entityType: CommentEntityType; entityId: string }>(sql`
            WITH deleted AS (
                UPDATE ${comments}
                SET ${sql.identifier("isDeleted")} = true,
                    ${sql.identifier("updatedAt")} = now()
                WHERE ${comments.id} = ${id}
                  AND ${comments.userId} = ${user.id}
                  AND ${comments.isDeleted} = false
                RETURNING ${comments.entityType} AS ${sql.identifier("entityType")},
                          ${comments.entityId} AS ${sql.identifier("entityId")}
            ), bumped AS (
                UPDATE ${projectIdeas}
                -- GREATEST floors at 0 so a counter that has drifted low can never
                -- go negative and render as "-1 comments".
                SET ${sql.identifier("commentCount")} = GREATEST(${projectIdeas.commentCount} - 1, 0)
                WHERE ${projectIdeas.id} IN (
                    SELECT ${sql.identifier("entityId")} FROM deleted
                    WHERE ${sql.identifier("entityType")} = 'PROJECT_IDEA'
                )
                RETURNING ${projectIdeas.id}
            )
            SELECT ${sql.identifier("entityType")}, ${sql.identifier("entityId")} FROM deleted
        `);

        const deleted = result.rows[0] ?? null;

        if (!deleted) {
            return { success: false, error: "Comment not found or not yours to delete" };
        }

        return {
            success: true,
            count: await liveCommentCount(deleted.entityType, deleted.entityId),
        };
    } catch (error: unknown) {
        console.error("Failed to delete comment:", error);
        return { success: false, error: errorMessage(error, "Failed to delete comment") };
    }
}
