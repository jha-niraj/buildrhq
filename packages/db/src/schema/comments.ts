// ===========================
// Comments — one polymorphic, threaded comment table for the whole app.
//
// TRADEOFF, stated up front: `entityType` + `entityId` replaces a per-feature
// foreign key, so the DATABASE CANNOT ENFORCE that `entityId` points at a real
// row. There is no FK to violate and no cascade when the target is deleted.
// That is accepted deliberately — the alternative is a new table (and a new
// action, and a new UI) per commentable thing, and project ideas, projects and
// blog posts all need the same thread. The cost is paid in the application
// layer instead: EVERY write action must verify the target entity exists before
// inserting (see `assertEntityExists` in
// apps/main/actions/(main)/comments.action.ts). Reads are naturally safe — an
// orphaned thread simply never gets fetched, because nothing links to it.
//
// SOFT DELETE, not hard delete. Removing a row would orphan every reply beneath
// it, so `isDeleted` is flipped instead and the thread keeps its shape. The
// server must never return the original `body` of a deleted row; the UI renders
// a tombstone in its place.
// ===========================

import {
    pgTable,
    pgEnum,
    text,
    boolean,
    timestamp,
    index,
    type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./schema";

// Seeded with the two consumers that exist today. Adding a value here (BLOG_POST,
// …) is all a new commentable entity needs on the schema side.
export const commentEntityTypeEnum = pgEnum("CommentEntityType", [
    "PROJECT_IDEA",
    "PROJECT",
]);

export const comments = pgTable(
    "Comment",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        entityType: commentEntityTypeEnum("entityType").notNull(),
        // Intentionally no .references() — see the polymorphic note above.
        entityId: text("entityId").notNull(),
        userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        // Self-reference needs the explicit AnyPgColumn return type; without it
        // TypeScript hits a circular inference on `comments` and widens to any.
        parentId: text("parentId").references((): AnyPgColumn => comments.id, { onDelete: "cascade" }),
        body: text("body").notNull(),
        isDeleted: boolean("isDeleted").notNull().default(false),
        isEdited: boolean("isEdited").notNull().default(false),
        createdAt: timestamp("createdAt").notNull().defaultNow(),
        updatedAt: timestamp("updatedAt").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        // The read path for a thread is "every comment on this entity, ordered by
        // time", so the three columns are indexed together in that order.
        index("idx_comment_entityType_entityId_createdAt").on(table.entityType, table.entityId, table.createdAt),
        index("idx_comment_parentId").on(table.parentId),
        index("idx_comment_userId").on(table.userId),
    ],
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
        relationName: "Comments",
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: "CommentReplies",
    }),
    replies: many(comments, {
        relationName: "CommentReplies",
    }),
}));
