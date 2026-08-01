import {
    pgTable,
    text,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./schema";

// ===========================
// projectV2Bookmark
// ===========================

export const projectV2Bookmark = pgTable(
    "project_v2_bookmark",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        // No .references() to avoid circular import with projects.ts
        projectId: text("project_id").notNull(),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        folder: text("folder").default("Saved"),
        notes: text("notes"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        uniqueIndex("project_v2_bookmark_project_id_user_id_key").on(t.projectId, t.userId),
        index("project_v2_bookmark_project_id_idx").on(t.projectId),
        index("project_v2_bookmark_user_id_idx").on(t.userId),
        index("project_v2_bookmark_folder_idx").on(t.folder),
    ]
);

export const projectV2BookmarkRelations = relations(projectV2Bookmark, ({ one }) => ({
    user: one(users, {
        fields: [projectV2Bookmark.userId],
        references: [users.id],
        relationName: "ProjectV2Bookmarks",
    }),
}));

// ===========================
// communityPostBookmark
// ===========================

export const communityPostBookmark = pgTable(
    "community_post_bookmark",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        // No .references() to avoid circular import with community posts table
        postId: text("post_id").notNull(),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        folder: text("folder").default("Saved"),
        notes: text("notes"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        uniqueIndex("community_post_bookmark_post_id_user_id_key").on(t.postId, t.userId),
        index("community_post_bookmark_post_id_idx").on(t.postId),
        index("community_post_bookmark_user_id_idx").on(t.userId),
        index("community_post_bookmark_folder_idx").on(t.folder),
    ]
);

export const communityPostBookmarkRelations = relations(communityPostBookmark, ({ one }) => ({
    user: one(users, {
        fields: [communityPostBookmark.userId],
        references: [users.id],
        relationName: "CommunityPostBookmarks",
    }),
}));

// ===========================
// mockInterviewBookmark
// ===========================

export const mockInterviewBookmark = pgTable(
    "mock_interview_bookmark",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        // No .references() to avoid circular import with mock interview sessions table
        sessionId: text("session_id").notNull(),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        folder: text("folder").default("Saved"),
        notes: text("notes"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        mockVoiceSessionId: text("mock_voice_session_id"),
    },
    (t) => [
        uniqueIndex("mock_interview_bookmark_session_id_user_id_key").on(t.sessionId, t.userId),
        index("mock_interview_bookmark_session_id_idx").on(t.sessionId),
        index("mock_interview_bookmark_user_id_idx").on(t.userId),
        index("mock_interview_bookmark_folder_idx").on(t.folder),
    ]
);

export const mockInterviewBookmarkRelations = relations(mockInterviewBookmark, ({ one }) => ({
    user: one(users, {
        fields: [mockInterviewBookmark.userId],
        references: [users.id],
        relationName: "MockInterviewBookmarks",
    }),
}));
