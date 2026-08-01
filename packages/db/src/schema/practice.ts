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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./schema";

// ===========================
// Enums
// ===========================

export const practiceModuleEnum = pgEnum("practice_module", [
    "DSA",
    "SYSTEM_DESIGN",
    "WEB_FRONTEND",
    "WEB_BACKEND",
]);

export const practiceDifficultyEnum = pgEnum("practice_difficulty", [
    "EASY",
    "MEDIUM",
    "HARD",
]);

export const practiceSessionStatusEnum = pgEnum("practice_session_status", [
    "NOT_STARTED",
    "IN_PROGRESS",
    "COMPLETED",
]);

export const practiceModeEnum = pgEnum("practice_mode", [
    "EXAM",
    "ASSIST",
]);

// ===========================
// Tables
// ===========================

export const practiceProblem = pgTable(
    "practice_problem",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        slug: text("slug").notNull().unique(),
        title: text("title").notNull(),
        description: text("description").notNull(),
        module: practiceModuleEnum("module").notNull(),
        category: text("category").notNull(),
        difficulty: practiceDifficultyEnum("difficulty").notNull(),
        requirements: text("requirements").array().notNull().default([]),
        hints: text("hints").array().notNull().default([]),
        starterCode: text("starter_code"),
        starterCss: text("starter_css"),
        testCases: jsonb("test_cases"),
        tags: text("tags").array().notNull().default([]),
        sortOrder: integer("sort_order").notNull().default(0),
        isActive: boolean("is_active").notNull().default(true),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_practice_problem_module_category").on(table.module, table.category),
        index("idx_practice_problem_module_difficulty").on(table.module, table.difficulty),
        index("idx_practice_problem_slug").on(table.slug),
    ],
);

export const practiceUserSession = pgTable(
    "practice_user_session",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        problemId: text("problem_id").notNull().references(() => practiceProblem.id, { onDelete: "cascade" }),
        module: practiceModuleEnum("module").notNull(),
        mode: practiceModeEnum("mode").notNull(),
        status: practiceSessionStatusEnum("status").notNull().default("IN_PROGRESS"),
        code: text("code"),
        cssCode: text("css_code"),
        canvasData: jsonb("canvas_data"),
        language: text("language").default("javascript"),
        attempts: integer("attempts").notNull().default(0),
        bestScore: integer("best_score").notNull().default(0),
        lastFeedback: text("last_feedback"),
        requirementsMet: jsonb("requirements_met"),
        totalTimeSeconds: integer("total_time_seconds").notNull().default(0),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        voiceUsed: boolean("voice_used").notNull().default(false),
        chatHistory: jsonb("chat_history"),
        xpAwarded: integer("xp_awarded").notNull().default(0),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        uniqueIndex("uq_practice_user_session_user_id_problem_id_mode").on(table.userId, table.problemId, table.mode),
        index("idx_practice_user_session_user_id_module").on(table.userId, table.module),
        index("idx_practice_user_session_user_id_problem_id").on(table.userId, table.problemId),
        index("idx_practice_user_session_user_id_module_status").on(table.userId, table.module, table.status),
    ],
);

export const practiceModuleProgress = pgTable(
    "practice_module_progress",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        module: practiceModuleEnum("module").notNull(),
        totalProblems: integer("total_problems").notNull().default(0),
        completed: integer("completed").notNull().default(0),
        inProgress: integer("in_progress").notNull().default(0),
        totalXP: integer("total_xp").notNull().default(0),
        currentStreak: integer("current_streak").notNull().default(0),
        longestStreak: integer("longest_streak").notNull().default(0),
        lastPracticedAt: timestamp("last_practiced_at"),
        easyCompleted: integer("easy_completed").notNull().default(0),
        mediumCompleted: integer("medium_completed").notNull().default(0),
        hardCompleted: integer("hard_completed").notNull().default(0),
        averageScore: integer("average_score").notNull().default(0),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        uniqueIndex("uq_practice_module_progress_user_id_module").on(table.userId, table.module),
        index("idx_practice_module_progress_user_id").on(table.userId),
        index("idx_practice_module_progress_module").on(table.module),
    ],
);

export const practiceLeaderboard = pgTable(
    "practice_leaderboard",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        module: practiceModuleEnum("module").notNull(),
        rank: integer("rank").notNull().default(0),
        totalXP: integer("total_xp").notNull().default(0),
        completed: integer("completed").notNull().default(0),
        averageScore: integer("average_score").notNull().default(0),
        streak: integer("streak").notNull().default(0),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        uniqueIndex("uq_practice_leaderboard_user_id_module").on(table.userId, table.module),
        index("idx_practice_leaderboard_module").on(table.module),
        index("idx_practice_leaderboard_module_rank").on(table.module, table.rank),
    ],
);

// ===========================
// Relations
// ===========================

export const practiceProblemRelations = relations(practiceProblem, ({ many }) => ({
    sessions: many(practiceUserSession),
}));

export const practiceUserSessionRelations = relations(practiceUserSession, ({ one }) => ({
    user: one(users, {
        fields: [practiceUserSession.userId],
        references: [users.id],
        relationName: "UserPracticeSessions",
    }),
    problem: one(practiceProblem, {
        fields: [practiceUserSession.problemId],
        references: [practiceProblem.id],
    }),
}));

export const practiceModuleProgressRelations = relations(practiceModuleProgress, ({ one }) => ({
    user: one(users, {
        fields: [practiceModuleProgress.userId],
        references: [users.id],
        relationName: "UserPracticeProgress",
    }),
}));

export const practiceLeaderboardRelations = relations(practiceLeaderboard, ({ one }) => ({
    user: one(users, {
        fields: [practiceLeaderboard.userId],
        references: [users.id],
        relationName: "UserPracticeLeaderboard",
    }),
}));
