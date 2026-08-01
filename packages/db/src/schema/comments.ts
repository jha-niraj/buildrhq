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
export const commentEntityTypeEnum = pgEnum("comment_entity_type", [
    "PROJECT_IDEA",
    "PROJECT",
]);

export const comments = pgTable(
    "comment",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        entityType: commentEntityTypeEnum("entity_type").notNull(),
        // Intentionally no .references() — see the polymorphic note above.
        entityId: text("entity_id").notNull(),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        // Self-reference needs the explicit AnyPgColumn return type; without it
        // TypeScript hits a circular inference on `comments` and widens to any.
        parentId: text("parent_id").references((): AnyPgColumn => comments.id, { onDelete: "cascade" }),
        body: text("body").notNull(),
        isDeleted: boolean("is_deleted").notNull().default(false),
        isEdited: boolean("is_edited").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        // The read path for a thread is "every comment on this entity, ordered by
        // time", so the three columns are indexed together in that order.
        index("idx_comment_entity_type_entity_id_created_at").on(table.entityType, table.entityId, table.createdAt),
        index("idx_comment_parent_id").on(table.parentId),
        index("idx_comment_user_id").on(table.userId),
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
