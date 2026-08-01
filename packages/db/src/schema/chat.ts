import {
    pgTable,
    pgEnum,
    text,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./schema";

// NOTE: The 1:1 DM chat feature was removed. This file now only retains the
// follow / follow-request graph, which the profile feature still uses. The
// Conversation / ChatMessage / ChatSettings tables were dropped.

// ===========================
// Enums
// ===========================

export const followRequestStatusEnum = pgEnum("follow_request_status", [
    "PENDING",
    "ACCEPTED",
    "REJECTED",
]);

// ===========================
// follow
// ===========================

export const follow = pgTable(
    "follow",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        followerId: text("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        followingId: text("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        uniqueIndex("follow_follower_id_following_id_key").on(t.followerId, t.followingId),
        index("follow_follower_id_idx").on(t.followerId),
        index("follow_following_id_idx").on(t.followingId),
    ]
);

export const followRelations = relations(follow, ({ one }) => ({
    follower: one(users, {
        fields: [follow.followerId],
        references: [users.id],
        relationName: "Follower",
    }),
    following: one(users, {
        fields: [follow.followingId],
        references: [users.id],
        relationName: "Following",
    }),
}));

// ===========================
// followRequest
// ===========================

export const followRequest = pgTable(
    "follow_request",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        receiverId: text("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        status: followRequestStatusEnum("status").notNull().default("PENDING"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()),
    },
    (t) => [
        uniqueIndex("follow_request_sender_id_receiver_id_key").on(t.senderId, t.receiverId),
        index("follow_request_sender_id_idx").on(t.senderId),
        index("follow_request_receiver_id_idx").on(t.receiverId),
    ]
);

export const followRequestRelations = relations(followRequest, ({ one }) => ({
    sender: one(users, {
        fields: [followRequest.senderId],
        references: [users.id],
        relationName: "FollowRequestSender",
    }),
    receiver: one(users, {
        fields: [followRequest.receiverId],
        references: [users.id],
        relationName: "FollowRequestReceiver",
    }),
}));
