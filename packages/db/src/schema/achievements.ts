import {
    pgTable,
    pgEnum,
    text,
    integer,
    boolean,
    timestamp,
    jsonb,
    index,
    uniqueIndex,
    serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users, xpTransactionPropsEnum } from "./schema";

// NOTE: The badge/achievements gamification feature was removed. This file now
// only retains the tables that are still used elsewhere: XP/levels (Projects
// awards XP; the level ledger) and social account connections (Settings →
// Integrations). The badge / userBadges / socialShares / achievementNotifications
// / userAchievementStats tables were dropped.

// ===========================
// Enums
// ===========================

export const socialProviderEnum = pgEnum("SocialProvider", [
    "TWITTER",
    "LINKEDIN",
]);

// ===========================
// Tables
// ===========================

export const levels = pgTable(
    "Level",
    {
        id: serial("id").primaryKey(),
        level: integer("level").unique().notNull(),
        title: text("title").notNull(),
        description: text("description"),
        icon: text("icon"),
        color: text("color"),
        xpRequired: integer("xpRequired").notNull(),
        xpReward: integer("xpReward").notNull().default(0),
        creditsReward: integer("creditsReward").notNull().default(0),
        perks: jsonb("perks"),
        isActive: boolean("isActive").notNull().default(true),
        createdAt: timestamp("createdAt").notNull().defaultNow(),
        updatedAt: timestamp("updatedAt")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_level_level").on(table.level),
    ],
);

export const userLevelProgress = pgTable(
    "UserLevelProgress",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        level: integer("level")
            .notNull()
            .references(() => levels.level, { onDelete: "cascade" }),
        xpEarned: integer("xpEarned").notNull().default(0),
        creditsEarned: integer("creditsEarned").notNull().default(0),
        achievedAt: timestamp("achievedAt").notNull().defaultNow(),
        sharedToSocial: boolean("sharedToSocial").notNull().default(false),
    },
    (table) => [
        uniqueIndex("uq_userLevelProgress_userId_level").on(table.userId, table.level),
        index("idx_userLevelProgress_userId").on(table.userId),
        index("idx_userLevelProgress_level").on(table.level),
    ],
);

export const xpTransactions = pgTable(
    "XpTransaction",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        userId: text("userId")
            .notNull()
            .references(() => users.id),
        amount: integer("amount").notNull(),
        description: text("description").notNull(),
        type: xpTransactionPropsEnum("type").notNull().default("REWARD"),
        source: text("source"),
        sourceId: text("sourceId"),
        createdAt: timestamp("createdAt").notNull().defaultNow(),
    },
    (table) => [
        index("idx_xpTransaction_userId").on(table.userId),
        index("idx_xpTransaction_createdAt").on(table.createdAt),
        index("idx_xpTransaction_type").on(table.type),
    ],
);

export const socialConnections = pgTable(
    "SocialConnection",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        provider: socialProviderEnum("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        accessToken: text("accessToken").notNull(),
        refreshToken: text("refreshToken"),
        tokenExpiresAt: timestamp("tokenExpiresAt"),
        accountName: text("accountName"),
        accountHandle: text("accountHandle"),
        accountImage: text("accountImage"),
        isActive: boolean("isActive").notNull().default(true),
        lastUsedAt: timestamp("lastUsedAt"),
        connectedAt: timestamp("connectedAt").notNull().defaultNow(),
        updatedAt: timestamp("updatedAt")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        uniqueIndex("uq_socialConnection_userId_provider").on(table.userId, table.provider),
        index("idx_socialConnection_userId").on(table.userId),
        index("idx_socialConnection_provider").on(table.provider),
    ],
);

// ===========================
// Relations
// ===========================

export const levelsRelations = relations(levels, ({ many }) => ({
    userProgress: many(userLevelProgress),
}));

export const userLevelProgressRelations = relations(userLevelProgress, ({ one }) => ({
    user: one(users, {
        fields: [userLevelProgress.userId],
        references: [users.id],
    }),
    levelInfo: one(levels, {
        fields: [userLevelProgress.level],
        references: [levels.level],
    }),
}));

export const xpTransactionsRelations = relations(xpTransactions, ({ one }) => ({
    user: one(users, {
        fields: [xpTransactions.userId],
        references: [users.id],
    }),
}));

export const socialConnectionsRelations = relations(socialConnections, ({ one }) => ({
    user: one(users, {
        fields: [socialConnections.userId],
        references: [users.id],
    }),
}));
