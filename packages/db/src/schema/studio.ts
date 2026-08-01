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

export const studioCategoryEnum = pgEnum("studio_category", [
    "GENERAL",
    "PROGRAMMING",
    "WEB_DEVELOPMENT",
    "DATA_SCIENCE",
    "DEVOPS",
    "MOBILE_DEVELOPMENT",
    "SYSTEM_DESIGN",
    "INTERVIEW_PREP",
    "PROJECT_NOTES",
    "TUTORIAL",
    "COURSE_NOTES",
    "OTHER",
]);

export const studioBlockTypeEnum = pgEnum("studio_block_type", [
    "TEXT",
    "HEADING",
    "CODE",
    "QUIZ",
    "FLASHCARD",
    "IMAGE",
    "VIDEO",
    "PRACTICE",
    "MOCK_INTERVIEW",
    "EMBED",
    "DIVIDER",
    "CALLOUT",
    "BULLET_LIST",
    "NUMBERED_LIST",
]);

export const studioVisibilityEnum = pgEnum("studio_visibility", [
    "PRIVATE",
    "PUBLIC",
    "COMMUNITY",
]);

export const studioSourceEnum = pgEnum("studio_source", [
    "MANUAL",
    "PATHFINDER",
    "SPACE",
]);

export const studioStepTypeEnum = pgEnum("studio_step_type", [
    "EXPLANATION",
    "NOTE",
    "QUIZ",
    "CODE",
    "IMAGE",
    "VIDEO",
    "DOCUMENT",
    "PROJECT",
    "MOCK_INTERVIEW",
    "FLASHCARD",
]);

export const studioStepStatusEnum = pgEnum("studio_step_status", [
    "DRAFT",
    "COMPLETED",
    "ARCHIVED",
]);

export const contentSourceEnum = pgEnum("content_source", [
    "AI",
    "USER",
]);

export const studioMediaTypeEnum = pgEnum("studio_media_type", [
    "IMAGE",
    "VIDEO",
    "DIAGRAM",
    "UPLOAD",
]);

// ===========================
// Tables
// ===========================

export const studios = pgTable(
    "studio",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        slug: text("slug").unique(),
        title: text("title").notNull(),
        description: text("description"),
        emoji: text("emoji").default("📚"),
        coverImage: text("cover_image"),
        source: studioSourceEnum("source").notNull().default("MANUAL"),
        sourceId: text("source_id"),
        stepCount: integer("step_count").notNull().default(0),
        category: studioCategoryEnum("category").notNull().default("GENERAL"),
        tags: text("tags").array().notNull().default([]),
        visibility: studioVisibilityEnum("visibility").notNull().default("PRIVATE"),
        isTemplate: boolean("is_template").notNull().default(false),
        views: integer("views").notNull().default(0),
        clones: integer("clones").notNull().default(0),
        likes: integer("likes").notNull().default(0),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        projectId: text("project_id"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
        lastEditedAt: timestamp("last_edited_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_studio_user_id").on(table.userId),
        index("idx_studio_category").on(table.category),
        index("idx_studio_visibility").on(table.visibility),
        index("idx_studio_source_source_id").on(table.source, table.sourceId),
    ],
);

export const studioSteps = pgTable(
    "studio_step",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        studioId: text("studio_id")
            .notNull()
            .references(() => studios.id, { onDelete: "cascade" }),
        orderNumber: integer("order_number").notNull(),
        type: studioStepTypeEnum("type").notNull(),
        content: text("content"),
        metadata: jsonb("metadata").notNull().default({}),
        source: contentSourceEnum("source").notNull(),
        status: studioStepStatusEnum("status").notNull().default("COMPLETED"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_ss_studio_id_order_number").on(table.studioId, table.orderNumber),
        index("idx_ss_type").on(table.type),
    ],
);

export const studioQuizzes = pgTable(
    "studio_quiz",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        blockId: text("block_id").notNull(),
        title: text("title").notNull(),
        questions: jsonb("questions").notNull(),
        timeLimit: integer("time_limit"),
        shuffleQuestions: boolean("shuffle_questions").notNull().default(true),
        showCorrectAnswers: boolean("show_correct_answers").notNull().default(true),
        studioId: text("studio_id")
            .notNull()
            .references(() => studios.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_sq_studio_id").on(table.studioId),
        index("idx_sq_block_id").on(table.blockId),
    ],
);

export const studioQuizAttempts = pgTable(
    "studio_quiz_attempt",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        quizId: text("quiz_id")
            .notNull()
            .references(() => studioQuizzes.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        score: integer("score").notNull(),
        maxScore: integer("max_score").notNull(),
        answers: jsonb("answers").notNull(),
        timeTaken: integer("time_taken"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_sqa_quiz_id").on(table.quizId),
        index("idx_sqa_user_id").on(table.userId),
    ],
);

export const studioFlashcardDecks = pgTable(
    "studio_flashcard_deck",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        blockId: text("block_id").notNull(),
        title: text("title").notNull(),
        cards: jsonb("cards").notNull(),
        studioId: text("studio_id")
            .notNull()
            .references(() => studios.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_sfd_studio_id").on(table.studioId),
        index("idx_sfd_block_id").on(table.blockId),
    ],
);

export const studioFlashcardSessions = pgTable(
    "studio_flashcard_session",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        deckId: text("deck_id")
            .notNull()
            .references(() => studioFlashcardDecks.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        cardsStudied: integer("cards_studied").notNull(),
        correctCount: integer("correct_count").notNull(),
        studyTime: integer("study_time").notNull(),
        cardProgress: jsonb("card_progress").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_sfs_deck_id").on(table.deckId),
        index("idx_sfs_user_id").on(table.userId),
    ],
);

export const studioCodeBlocks = pgTable(
    "studio_code_block",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        blockId: text("block_id").notNull(),
        language: text("language").notNull(),
        code: text("code").notNull(),
        isPractice: boolean("is_practice").notNull().default(false),
        problemTitle: text("problem_title"),
        problemDescription: text("problem_description"),
        testCases: jsonb("test_cases"),
        hints: text("hints").array().notNull().default([]),
        solution: text("solution"),
        studioId: text("studio_id")
            .notNull()
            .references(() => studios.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_scb_studio_id").on(table.studioId),
        index("idx_scb_block_id").on(table.blockId),
    ],
);

export const studioMediaBlocks = pgTable(
    "studio_media_block",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        blockId: text("block_id").notNull(),
        type: studioMediaTypeEnum("type").notNull(),
        url: text("url").notNull(),
        prompt: text("prompt"),
        width: integer("width"),
        height: integer("height"),
        duration: integer("duration"),
        studioId: text("studio_id")
            .notNull()
            .references(() => studios.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_smb_studio_id").on(table.studioId),
        index("idx_smb_block_id").on(table.blockId),
    ],
);

export const studioChatMessages = pgTable(
    "studio_chat_message",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        studioId: text("studio_id")
            .notNull()
            .references(() => studios.id, { onDelete: "cascade" }),
        role: text("role").notNull(),
        content: text("content").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_scm_studio_id").on(table.studioId),
    ],
);

// ===========================
// Relations
// ===========================

export const studiosRelations = relations(studios, ({ one, many }) => ({
    user: one(users, {
        fields: [studios.userId],
        references: [users.id],
        relationName: "UserStudios",
    }),
    steps: many(studioSteps),
    quizzes: many(studioQuizzes),
    flashcardDecks: many(studioFlashcardDecks),
    codeBlocks: many(studioCodeBlocks),
    mediaBlocks: many(studioMediaBlocks),
    chatMessages: many(studioChatMessages),
}));

export const studioStepsRelations = relations(studioSteps, ({ one }) => ({
    studio: one(studios, {
        fields: [studioSteps.studioId],
        references: [studios.id],
    }),
}));

export const studioQuizzesRelations = relations(studioQuizzes, ({ one, many }) => ({
    studio: one(studios, {
        fields: [studioQuizzes.studioId],
        references: [studios.id],
    }),
    attempts: many(studioQuizAttempts),
}));

export const studioQuizAttemptsRelations = relations(studioQuizAttempts, ({ one }) => ({
    quiz: one(studioQuizzes, {
        fields: [studioQuizAttempts.quizId],
        references: [studioQuizzes.id],
    }),
    user: one(users, {
        fields: [studioQuizAttempts.userId],
        references: [users.id],
        relationName: "UserStudioQuizAttempts",
    }),
}));

export const studioFlashcardDecksRelations = relations(studioFlashcardDecks, ({ one, many }) => ({
    studio: one(studios, {
        fields: [studioFlashcardDecks.studioId],
        references: [studios.id],
    }),
    sessions: many(studioFlashcardSessions),
}));

export const studioFlashcardSessionsRelations = relations(studioFlashcardSessions, ({ one }) => ({
    deck: one(studioFlashcardDecks, {
        fields: [studioFlashcardSessions.deckId],
        references: [studioFlashcardDecks.id],
    }),
    user: one(users, {
        fields: [studioFlashcardSessions.userId],
        references: [users.id],
        relationName: "UserFlashcardSessions",
    }),
}));

export const studioCodeBlocksRelations = relations(studioCodeBlocks, ({ one }) => ({
    studio: one(studios, {
        fields: [studioCodeBlocks.studioId],
        references: [studios.id],
    }),
}));

export const studioMediaBlocksRelations = relations(studioMediaBlocks, ({ one }) => ({
    studio: one(studios, {
        fields: [studioMediaBlocks.studioId],
        references: [studios.id],
    }),
}));

export const studioChatMessagesRelations = relations(studioChatMessages, ({ one }) => ({
    studio: one(studios, {
        fields: [studioChatMessages.studioId],
        references: [studios.id],
    }),
}));
