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

export const followRequestStatusEnum = pgEnum("FollowRequestStatus", [
    "PENDING",
    "ACCEPTED",
    "REJECTED",
]);

// ===========================
// follow
// ===========================

export const follow = pgTable(
    "Follow",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        followerId: text("followerId").notNull().references(() => users.id, { onDelete: "cascade" }),
        followingId: text("followingId").notNull().references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("createdAt").notNull().defaultNow(),
    },
    (t) => [
        uniqueIndex("follow_followerId_followingId_key").on(t.followerId, t.followingId),
        index("follow_followerId_idx").on(t.followerId),
        index("follow_followingId_idx").on(t.followingId),
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
    "FollowRequest",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        senderId: text("senderId").notNull().references(() => users.id, { onDelete: "cascade" }),
        receiverId: text("receiverId").notNull().references(() => users.id, { onDelete: "cascade" }),
        status: followRequestStatusEnum("status").notNull().default("PENDING"),
        createdAt: timestamp("createdAt").notNull().defaultNow(),
        updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdateFn(() => new Date()),
    },
    (t) => [
        uniqueIndex("followRequest_senderId_receiverId_key").on(t.senderId, t.receiverId),
        index("followRequest_senderId_idx").on(t.senderId),
        index("followRequest_receiverId_idx").on(t.receiverId),
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
