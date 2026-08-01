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
    real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./schema";

// ===========================
// Enums
// ===========================

export const assessmentModeEnum = pgEnum("assessment_mode", [
    "QUIZ",
    "CODE",
    "MOCK",
    "MIXED",
]);

export const assessmentTypeEnum = pgEnum("assessment_type", [
    "PRACTICE",
    "EXAM",
]);

export const questionDifficultyEnum = pgEnum("question_difficulty", [
    "EASY",
    "INTERMEDIATE",
    "HARD",
]);

export const assessmentLanguageEnum = pgEnum("assessment_language", [
    "JAVASCRIPT",
    "PYTHON",
    "C",
    "CPP",
    "REACTJS",
    "TYPESCRIPT",
    "JAVA",
    "GO",
    "RUST",
]);

export const assessmentQuestionTypeEnum = pgEnum("assessment_question_type", [
    "MCQ",
    "MULTIPLE_SELECT",
    "CODE_OUTPUT",
    "CODE_WRITE",
    "CODE_DEBUG",
    "CODE_COMPLETE",
    "SCENARIO",
    "TRUE_FALSE",
]);

export const userContentStatusEnum = pgEnum("user_content_status", [
    "GENERATING",
    "DRAFT",
    "ACTIVE",
    "ARCHIVED",
]);

// ===========================
// Tables
// ===========================

export const assessmentTopics = pgTable(
    "assessment_topic",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        slug: text("slug").notNull().unique(),
        name: text("name").notNull(),
        description: text("description"),
        icon: text("icon"),
        color: text("color"),
        language: assessmentLanguageEnum("language").notNull(),
        totalQuestions: integer("total_questions").notNull().default(0),
        totalAttempts: integer("total_attempts").notNull().default(0),
        avgScore: real("avg_score").notNull().default(0),
        isActive: boolean("is_active").notNull().default(true),
        orderIndex: integer("order_index").notNull().default(0),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_assessment_topic_language").on(table.language),
        index("idx_assessment_topic_is_active").on(table.isActive),
    ],
);

export const assessmentSubModules = pgTable(
    "assessment_sub_module",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        slug: text("slug").notNull(),
        name: text("name").notNull(),
        description: text("description"),
        icon: text("icon"),
        topicId: text("topic_id").notNull().references(() => assessmentTopics.id, { onDelete: "cascade" }),
        totalQuestions: integer("total_questions").notNull().default(0),
        totalAttempts: integer("total_attempts").notNull().default(0),
        avgScore: real("avg_score").notNull().default(0),
        isActive: boolean("is_active").notNull().default(true),
        orderIndex: integer("order_index").notNull().default(0),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        uniqueIndex("uq_assessment_sub_module_topic_id_slug").on(table.topicId, table.slug),
        index("idx_assessment_sub_module_topic_id").on(table.topicId),
        index("idx_assessment_sub_module_is_active").on(table.isActive),
    ],
);

export const assessmentQuestions = pgTable(
    "assessment_question",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        topicId: text("topic_id").notNull().references(() => assessmentTopics.id, { onDelete: "cascade" }),
        subModuleId: text("sub_module_id").references(() => assessmentSubModules.id, { onDelete: "set null" }),
        type: assessmentQuestionTypeEnum("type").notNull(),
        mode: assessmentModeEnum("mode").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        question: text("question").notNull(),
        questionHtml: text("question_html"),
        codeSnippet: text("code_snippet"),
        codeLanguage: text("code_language"),
        options: jsonb("options"),
        correctAnswer: text("correct_answer"),
        answerExplanation: text("answer_explanation"),
        testCases: jsonb("test_cases"),
        starterCode: text("starter_code"),
        solutionCode: text("solution_code"),
        hints: jsonb("hints"),
        points: integer("points").notNull().default(10),
        timeLimit: integer("time_limit"),
        isSeeded: boolean("is_seeded").notNull().default(true),
        aiGenerated: boolean("ai_generated").notNull().default(false),
        generatedFor: text("generated_for"),
        totalAttempts: integer("total_attempts").notNull().default(0),
        correctAttempts: integer("correct_attempts").notNull().default(0),
        avgTimeSpent: integer("avg_time_spent").notNull().default(0),
        isActive: boolean("is_active").notNull().default(true),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_assessment_question_topic_id").on(table.topicId),
        index("idx_assessment_question_sub_module_id").on(table.subModuleId),
        index("idx_assessment_question_type").on(table.type),
        index("idx_assessment_question_mode").on(table.mode),
        index("idx_assessment_question_difficulty").on(table.difficulty),
        index("idx_assessment_question_is_seeded").on(table.isSeeded),
        index("idx_assessment_question_is_active").on(table.isActive),
    ],
);

export const practiceAttempts = pgTable(
    "practice_attempt",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        topicId: text("topic_id").notNull().references(() => assessmentTopics.id, { onDelete: "cascade" }),
        subModuleId: text("sub_module_id").references(() => assessmentSubModules.id, { onDelete: "set null" }),
        mode: assessmentModeEnum("mode").notNull(),
        difficulty: questionDifficultyEnum("difficulty"),
        totalQuestions: integer("total_questions").notNull(),
        answeredCount: integer("answered_count").notNull().default(0),
        correctCount: integer("correct_count").notNull().default(0),
        score: real("score").notNull().default(0),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        timeSpent: integer("time_spent").notNull().default(0),
        status: text("status").notNull().default("IN_PROGRESS"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_practice_attempt_user_id").on(table.userId),
        index("idx_practice_attempt_topic_id").on(table.topicId),
        index("idx_practice_attempt_sub_module_id").on(table.subModuleId),
        index("idx_practice_attempt_status").on(table.status),
    ],
);

export const practiceAnswers = pgTable(
    "practice_answer",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        attemptId: text("attempt_id").notNull().references(() => practiceAttempts.id, { onDelete: "cascade" }),
        questionId: text("question_id").notNull().references(() => assessmentQuestions.id, { onDelete: "cascade" }),
        selectedOption: text("selected_option"),
        selectedOptions: jsonb("selected_options"),
        codeAnswer: text("code_answer"),
        textAnswer: text("text_answer"),
        isCorrect: boolean("is_correct").notNull(),
        partialScore: real("partial_score"),
        pointsEarned: integer("points_earned").notNull().default(0),
        timeSpent: integer("time_spent").notNull().default(0),
        aiFeedback: text("ai_feedback"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_practice_answer_attempt_id_question_id").on(table.attemptId, table.questionId),
        index("idx_practice_answer_attempt_id").on(table.attemptId),
        index("idx_practice_answer_question_id").on(table.questionId),
    ],
);

export const examAttempts = pgTable(
    "exam_attempt",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        topicId: text("topic_id").notNull().references(() => assessmentTopics.id, { onDelete: "cascade" }),
        mode: assessmentModeEnum("mode").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        totalQuestions: integer("total_questions").notNull(),
        timeLimit: integer("time_limit").notNull(),
        passingScore: real("passing_score").notNull().default(70),
        answeredCount: integer("answered_count").notNull().default(0),
        correctCount: integer("correct_count").notNull().default(0),
        score: real("score"),
        passed: boolean("passed"),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        timeSpent: integer("time_spent").notNull().default(0),
        status: text("status").notNull().default("IN_PROGRESS"),
        tabSwitchCount: integer("tab_switch_count").notNull().default(0),
        warnings: jsonb("warnings"),
        certificateId: text("certificate_id").unique(),
        certificateUrl: text("certificate_url"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_exam_attempt_user_id").on(table.userId),
        index("idx_exam_attempt_topic_id").on(table.topicId),
        index("idx_exam_attempt_status").on(table.status),
        index("idx_exam_attempt_passed").on(table.passed),
    ],
);

export const examAnswers = pgTable(
    "exam_answer",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        attemptId: text("attempt_id").notNull().references(() => examAttempts.id, { onDelete: "cascade" }),
        questionId: text("question_id").notNull().references(() => assessmentQuestions.id, { onDelete: "cascade" }),
        selectedOption: text("selected_option"),
        selectedOptions: jsonb("selected_options"),
        codeAnswer: text("code_answer"),
        textAnswer: text("text_answer"),
        isCorrect: boolean("is_correct"),
        partialScore: real("partial_score"),
        pointsEarned: integer("points_earned").notNull().default(0),
        timeSpent: integer("time_spent").notNull().default(0),
        aiEvaluation: jsonb("ai_evaluation"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_exam_answer_attempt_id_question_id").on(table.attemptId, table.questionId),
        index("idx_exam_answer_attempt_id").on(table.attemptId),
        index("idx_exam_answer_question_id").on(table.questionId),
    ],
);

export const userAssessmentStats = pgTable(
    "user_assessment_stats",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
        totalPracticeAttempts: integer("total_practice_attempts").notNull().default(0),
        practiceQuestionsAnswered: integer("practice_questions_answered").notNull().default(0),
        practiceCorrectAnswers: integer("practice_correct_answers").notNull().default(0),
        avgPracticeScore: real("avg_practice_score").notNull().default(0),
        totalPracticeTime: integer("total_practice_time").notNull().default(0),
        totalExamAttempts: integer("total_exam_attempts").notNull().default(0),
        examsPassed: integer("exams_passed").notNull().default(0),
        examsFailed: integer("exams_failed").notNull().default(0),
        avgExamScore: real("avg_exam_score").notNull().default(0),
        certificates: integer("certificates").notNull().default(0),
        streakDays: integer("streak_days").notNull().default(0),
        longestStreak: integer("longest_streak").notNull().default(0),
        lastActivityAt: timestamp("last_activity_at"),
        topicProgress: jsonb("topic_progress"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_user_assessment_stats_user_id").on(table.userId),
    ],
);

export const assessmentCertificates = pgTable(
    "assessment_certificate",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        certificateId: text("certificate_id").notNull().unique(),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        topicName: text("topic_name").notNull(),
        language: assessmentLanguageEnum("language").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        mode: assessmentModeEnum("mode").notNull(),
        score: real("score").notNull(),
        passingScore: real("passing_score").notNull(),
        issuedAt: timestamp("issued_at").notNull().defaultNow(),
        expiresAt: timestamp("expires_at"),
        isActive: boolean("is_active").notNull().default(true),
        verificationUrl: text("verification_url"),
    },
    (table) => [
        index("idx_assessment_certificate_user_id").on(table.userId),
        index("idx_assessment_certificate_certificate_id").on(table.certificateId),
    ],
);

export const userPracticeSets = pgTable(
    "user_practice_set",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        creatorId: text("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description"),
        slug: text("slug").notNull().unique(),
        language: assessmentLanguageEnum("language").notNull(),
        topicId: text("topic_id").references(() => assessmentTopics.id, { onDelete: "set null" }),
        subModuleId: text("sub_module_id").references(() => assessmentSubModules.id, { onDelete: "set null" }),
        mode: assessmentModeEnum("mode").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        questionCount: integer("question_count").notNull().default(10),
        timeLimit: integer("time_limit"),
        isPublic: boolean("is_public").notNull().default(false),
        madePublicAt: timestamp("made_public_at"),
        creditsCost: integer("credits_cost").notNull().default(5),
        creditsRefunded: integer("credits_refunded").notNull().default(0),
        views: integer("views").notNull().default(0),
        likes: integer("likes").notNull().default(0),
        totalAttempts: integer("total_attempts").notNull().default(0),
        avgScore: real("avg_score").notNull().default(0),
        completions: integer("completions").notNull().default(0),
        status: userContentStatusEnum("status").notNull().default("GENERATING"),
        isUniversityAssessment: boolean("is_university_assessment").notNull().default(false),
        universityId: text("university_id"),
        teacherMemberId: text("teacher_member_id"),
        classIds: text("class_ids").array().notNull().default([]),
        assignmentDeadline: timestamp("assignment_deadline"),
        assignmentCredits: integer("assignment_credits"),
        assignmentInstructions: text("assignment_instructions"),
        isLiveSession: boolean("is_live_session").notNull().default(false),
        liveSessionStartedAt: timestamp("live_session_started_at"),
        liveSessionEndedAt: timestamp("live_session_ended_at"),
        liveSessionActive: boolean("live_session_active").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_user_practice_set_creator_id").on(table.creatorId),
        index("idx_user_practice_set_language").on(table.language),
        index("idx_user_practice_set_is_public").on(table.isPublic),
        index("idx_user_practice_set_status").on(table.status),
        index("idx_user_practice_set_created_at").on(table.createdAt),
        index("idx_user_practice_set_university_id").on(table.universityId),
        index("idx_user_practice_set_is_university_assessment").on(table.isUniversityAssessment),
        index("idx_user_practice_set_is_live_session").on(table.isLiveSession),
    ],
);

export const userPracticeSetQuestions = pgTable(
    "user_practice_set_question",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        practiceSetId: text("practice_set_id").notNull().references(() => userPracticeSets.id, { onDelete: "cascade" }),
        type: assessmentQuestionTypeEnum("type").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        orderIndex: integer("order_index").notNull().default(0),
        question: text("question").notNull(),
        codeSnippet: text("code_snippet"),
        codeLanguage: text("code_language"),
        options: jsonb("options"),
        correctAnswer: text("correct_answer"),
        answerExplanation: text("answer_explanation"),
        testCases: jsonb("test_cases"),
        starterCode: text("starter_code"),
        solutionCode: text("solution_code"),
        mockPrompt: text("mock_prompt"),
        expectedTopics: jsonb("expected_topics"),
        hints: jsonb("hints"),
        points: integer("points").notNull().default(10),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_user_practice_set_question_practice_set_id").on(table.practiceSetId),
    ],
);

export const userPracticeSetPurchases = pgTable(
    "user_practice_set_purchase",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        practiceSetId: text("practice_set_id").notNull().references(() => userPracticeSets.id, { onDelete: "cascade" }),
        attachedAt: timestamp("attached_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_user_practice_set_purchase_user_id_practice_set_id").on(table.userId, table.practiceSetId),
        index("idx_user_practice_set_purchase_user_id").on(table.userId),
        index("idx_user_practice_set_purchase_practice_set_id").on(table.practiceSetId),
    ],
);

export const userPracticeSetLikes = pgTable(
    "user_practice_set_like",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        practiceSetId: text("practice_set_id").notNull().references(() => userPracticeSets.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_user_practice_set_like_user_id_practice_set_id").on(table.userId, table.practiceSetId),
        index("idx_user_practice_set_like_user_id").on(table.userId),
        index("idx_user_practice_set_like_practice_set_id").on(table.practiceSetId),
    ],
);

export const userPracticeSetAttempts = pgTable(
    "user_practice_set_attempt",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        practiceSetId: text("practice_set_id").notNull().references(() => userPracticeSets.id, { onDelete: "cascade" }),
        mode: assessmentModeEnum("mode").notNull(),
        totalQuestions: integer("total_questions").notNull(),
        answeredCount: integer("answered_count").notNull().default(0),
        correctCount: integer("correct_count").notNull().default(0),
        score: real("score").notNull().default(0),
        creditsSpent: integer("credits_spent").notNull().default(0),
        creditsEarned: integer("credits_earned").notNull().default(0),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        timeSpent: integer("time_spent").notNull().default(0),
        status: text("status").notNull().default("IN_PROGRESS"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_user_practice_set_attempt_user_id").on(table.userId),
        index("idx_user_practice_set_attempt_practice_set_id").on(table.practiceSetId),
        index("idx_user_practice_set_attempt_status").on(table.status),
    ],
);

export const userPracticeSetAnswers = pgTable(
    "user_practice_set_answer",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        attemptId: text("attempt_id").notNull().references(() => userPracticeSetAttempts.id, { onDelete: "cascade" }),
        questionId: text("question_id").notNull().references(() => userPracticeSetQuestions.id, { onDelete: "cascade" }),
        selectedOption: text("selected_option"),
        selectedOptions: jsonb("selected_options"),
        codeAnswer: text("code_answer"),
        textAnswer: text("text_answer"),
        voiceTranscript: text("voice_transcript"),
        isCorrect: boolean("is_correct"),
        partialScore: real("partial_score"),
        pointsEarned: integer("points_earned").notNull().default(0),
        timeSpent: integer("time_spent").notNull().default(0),
        aiFeedback: text("ai_feedback"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_user_practice_set_answer_attempt_id_question_id").on(table.attemptId, table.questionId),
        index("idx_user_practice_set_answer_attempt_id").on(table.attemptId),
        index("idx_user_practice_set_answer_question_id").on(table.questionId),
    ],
);

export const userExamSets = pgTable(
    "user_exam_set",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        creatorId: text("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description"),
        slug: text("slug").notNull().unique(),
        language: assessmentLanguageEnum("language").notNull(),
        topicId: text("topic_id").references(() => assessmentTopics.id, { onDelete: "set null" }),
        mode: assessmentModeEnum("mode").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        questionCount: integer("question_count").notNull().default(20),
        timeLimit: integer("time_limit").notNull().default(1800),
        passingScore: real("passing_score").notNull().default(70),
        isPublic: boolean("is_public").notNull().default(false),
        madePublicAt: timestamp("made_public_at"),
        creditsCost: integer("credits_cost").notNull().default(10),
        creditsRefunded: integer("credits_refunded").notNull().default(0),
        views: integer("views").notNull().default(0),
        likes: integer("likes").notNull().default(0),
        totalAttempts: integer("total_attempts").notNull().default(0),
        avgScore: real("avg_score").notNull().default(0),
        passCount: integer("pass_count").notNull().default(0),
        failCount: integer("fail_count").notNull().default(0),
        status: userContentStatusEnum("status").notNull().default("GENERATING"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_user_exam_set_creator_id").on(table.creatorId),
        index("idx_user_exam_set_language").on(table.language),
        index("idx_user_exam_set_is_public").on(table.isPublic),
        index("idx_user_exam_set_status").on(table.status),
        index("idx_user_exam_set_created_at").on(table.createdAt),
    ],
);

export const userExamSetQuestions = pgTable(
    "user_exam_set_question",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        examSetId: text("exam_set_id").notNull().references(() => userExamSets.id, { onDelete: "cascade" }),
        type: assessmentQuestionTypeEnum("type").notNull(),
        difficulty: questionDifficultyEnum("difficulty").notNull(),
        orderIndex: integer("order_index").notNull().default(0),
        question: text("question").notNull(),
        codeSnippet: text("code_snippet"),
        codeLanguage: text("code_language"),
        options: jsonb("options"),
        correctAnswer: text("correct_answer"),
        answerExplanation: text("answer_explanation"),
        testCases: jsonb("test_cases"),
        starterCode: text("starter_code"),
        solutionCode: text("solution_code"),
        mockPrompt: text("mock_prompt"),
        expectedTopics: jsonb("expected_topics"),
        hints: jsonb("hints"),
        points: integer("points").notNull().default(10),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_user_exam_set_question_exam_set_id").on(table.examSetId),
    ],
);

export const userExamSetPurchases = pgTable(
    "user_exam_set_purchase",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        examSetId: text("exam_set_id").notNull().references(() => userExamSets.id, { onDelete: "cascade" }),
        attachedAt: timestamp("attached_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_user_exam_set_purchase_user_id_exam_set_id").on(table.userId, table.examSetId),
        index("idx_user_exam_set_purchase_user_id").on(table.userId),
        index("idx_user_exam_set_purchase_exam_set_id").on(table.examSetId),
    ],
);

export const userExamSetLikes = pgTable(
    "user_exam_set_like",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        examSetId: text("exam_set_id").notNull().references(() => userExamSets.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_user_exam_set_like_user_id_exam_set_id").on(table.userId, table.examSetId),
        index("idx_user_exam_set_like_user_id").on(table.userId),
        index("idx_user_exam_set_like_exam_set_id").on(table.examSetId),
    ],
);

export const userExamSetAttempts = pgTable(
    "user_exam_set_attempt",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        examSetId: text("exam_set_id").notNull().references(() => userExamSets.id, { onDelete: "cascade" }),
        mode: assessmentModeEnum("mode").notNull(),
        totalQuestions: integer("total_questions").notNull(),
        answeredCount: integer("answered_count").notNull().default(0),
        correctCount: integer("correct_count").notNull().default(0),
        score: real("score"),
        passed: boolean("passed"),
        creditsSpent: integer("credits_spent").notNull().default(0),
        creditsEarned: integer("credits_earned").notNull().default(0),
        timeLimit: integer("time_limit").notNull(),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        timeSpent: integer("time_spent").notNull().default(0),
        tabSwitchCount: integer("tab_switch_count").notNull().default(0),
        warnings: jsonb("warnings"),
        status: text("status").notNull().default("IN_PROGRESS"),
        certificateId: text("certificate_id").unique(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_user_exam_set_attempt_user_id").on(table.userId),
        index("idx_user_exam_set_attempt_exam_set_id").on(table.examSetId),
        index("idx_user_exam_set_attempt_status").on(table.status),
        index("idx_user_exam_set_attempt_passed").on(table.passed),
    ],
);

export const userExamSetAnswers = pgTable(
    "user_exam_set_answer",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        attemptId: text("attempt_id").notNull().references(() => userExamSetAttempts.id, { onDelete: "cascade" }),
        questionId: text("question_id").notNull().references(() => userExamSetQuestions.id, { onDelete: "cascade" }),
        selectedOption: text("selected_option"),
        selectedOptions: jsonb("selected_options"),
        codeAnswer: text("code_answer"),
        textAnswer: text("text_answer"),
        voiceTranscript: text("voice_transcript"),
        isCorrect: boolean("is_correct"),
        partialScore: real("partial_score"),
        pointsEarned: integer("points_earned").notNull().default(0),
        timeSpent: integer("time_spent").notNull().default(0),
        aiFeedback: text("ai_feedback"),
        aiEvaluation: jsonb("ai_evaluation"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("uq_user_exam_set_answer_attempt_id_question_id").on(table.attemptId, table.questionId),
        index("idx_user_exam_set_answer_attempt_id").on(table.attemptId),
        index("idx_user_exam_set_answer_question_id").on(table.questionId),
    ],
);

export const randomPracticeSessions = pgTable(
    "random_practice_session",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        language: assessmentLanguageEnum("language"),
        mode: assessmentModeEnum("mode"),
        difficulty: questionDifficultyEnum("difficulty"),
        questionCount: integer("question_count").notNull().default(10),
        creditsCost: integer("credits_cost").notNull().default(3),
        creditsEarned: integer("credits_earned").notNull().default(0),
        totalQuestions: integer("total_questions").notNull(),
        answeredCount: integer("answered_count").notNull().default(0),
        correctCount: integer("correct_count").notNull().default(0),
        score: real("score").notNull().default(0),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        timeSpent: integer("time_spent").notNull().default(0),
        questionRefs: jsonb("question_refs").notNull(),
        answers: jsonb("answers"),
        status: text("status").notNull().default("IN_PROGRESS"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_random_practice_session_user_id").on(table.userId),
        index("idx_random_practice_session_status").on(table.status),
        index("idx_random_practice_session_created_at").on(table.createdAt),
    ],
);

// ===========================
// Relations
// ===========================

export const assessmentTopicsRelations = relations(assessmentTopics, ({ many }) => ({
    subModules: many(assessmentSubModules),
    questions: many(assessmentQuestions),
    practiceAttempts: many(practiceAttempts),
    examAttempts: many(examAttempts),
    practiceSets: many(userPracticeSets),
    examSets: many(userExamSets),
}));

export const assessmentSubModulesRelations = relations(assessmentSubModules, ({ one, many }) => ({
    topic: one(assessmentTopics, {
        fields: [assessmentSubModules.topicId],
        references: [assessmentTopics.id],
    }),
    questions: many(assessmentQuestions),
    practiceAttempts: many(practiceAttempts),
    practiceSets: many(userPracticeSets),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one, many }) => ({
    topic: one(assessmentTopics, {
        fields: [assessmentQuestions.topicId],
        references: [assessmentTopics.id],
    }),
    subModule: one(assessmentSubModules, {
        fields: [assessmentQuestions.subModuleId],
        references: [assessmentSubModules.id],
    }),
    practiceAnswers: many(practiceAnswers),
    examAnswers: many(examAnswers),
}));

export const practiceAttemptsRelations = relations(practiceAttempts, ({ one, many }) => ({
    user: one(users, {
        fields: [practiceAttempts.userId],
        references: [users.id],
    }),
    topic: one(assessmentTopics, {
        fields: [practiceAttempts.topicId],
        references: [assessmentTopics.id],
    }),
    subModule: one(assessmentSubModules, {
        fields: [practiceAttempts.subModuleId],
        references: [assessmentSubModules.id],
    }),
    answers: many(practiceAnswers),
}));

export const practiceAnswersRelations = relations(practiceAnswers, ({ one }) => ({
    attempt: one(practiceAttempts, {
        fields: [practiceAnswers.attemptId],
        references: [practiceAttempts.id],
    }),
    question: one(assessmentQuestions, {
        fields: [practiceAnswers.questionId],
        references: [assessmentQuestions.id],
    }),
}));

export const examAttemptsRelations = relations(examAttempts, ({ one, many }) => ({
    user: one(users, {
        fields: [examAttempts.userId],
        references: [users.id],
    }),
    topic: one(assessmentTopics, {
        fields: [examAttempts.topicId],
        references: [assessmentTopics.id],
    }),
    answers: many(examAnswers),
}));

export const examAnswersRelations = relations(examAnswers, ({ one }) => ({
    attempt: one(examAttempts, {
        fields: [examAnswers.attemptId],
        references: [examAttempts.id],
    }),
    question: one(assessmentQuestions, {
        fields: [examAnswers.questionId],
        references: [assessmentQuestions.id],
    }),
}));

export const userAssessmentStatsRelations = relations(userAssessmentStats, ({ one }) => ({
    user: one(users, {
        fields: [userAssessmentStats.userId],
        references: [users.id],
    }),
}));

export const assessmentCertificatesRelations = relations(assessmentCertificates, ({ one }) => ({
    user: one(users, {
        fields: [assessmentCertificates.userId],
        references: [users.id],
    }),
}));

export const userPracticeSetsRelations = relations(userPracticeSets, ({ one, many }) => ({
    creator: one(users, {
        fields: [userPracticeSets.creatorId],
        references: [users.id],
    }),
    topic: one(assessmentTopics, {
        fields: [userPracticeSets.topicId],
        references: [assessmentTopics.id],
    }),
    subModule: one(assessmentSubModules, {
        fields: [userPracticeSets.subModuleId],
        references: [assessmentSubModules.id],
    }),
    questions: many(userPracticeSetQuestions),
    purchases: many(userPracticeSetPurchases),
    likes: many(userPracticeSetLikes),
    attempts: many(userPracticeSetAttempts),
}));

export const userPracticeSetQuestionsRelations = relations(userPracticeSetQuestions, ({ one, many }) => ({
    practiceSet: one(userPracticeSets, {
        fields: [userPracticeSetQuestions.practiceSetId],
        references: [userPracticeSets.id],
    }),
    answers: many(userPracticeSetAnswers),
}));

export const userPracticeSetPurchasesRelations = relations(userPracticeSetPurchases, ({ one }) => ({
    user: one(users, {
        fields: [userPracticeSetPurchases.userId],
        references: [users.id],
    }),
    practiceSet: one(userPracticeSets, {
        fields: [userPracticeSetPurchases.practiceSetId],
        references: [userPracticeSets.id],
    }),
}));

export const userPracticeSetLikesRelations = relations(userPracticeSetLikes, ({ one }) => ({
    user: one(users, {
        fields: [userPracticeSetLikes.userId],
        references: [users.id],
    }),
    practiceSet: one(userPracticeSets, {
        fields: [userPracticeSetLikes.practiceSetId],
        references: [userPracticeSets.id],
    }),
}));

export const userPracticeSetAttemptsRelations = relations(userPracticeSetAttempts, ({ one, many }) => ({
    user: one(users, {
        fields: [userPracticeSetAttempts.userId],
        references: [users.id],
    }),
    practiceSet: one(userPracticeSets, {
        fields: [userPracticeSetAttempts.practiceSetId],
        references: [userPracticeSets.id],
    }),
    answers: many(userPracticeSetAnswers),
}));

export const userPracticeSetAnswersRelations = relations(userPracticeSetAnswers, ({ one }) => ({
    attempt: one(userPracticeSetAttempts, {
        fields: [userPracticeSetAnswers.attemptId],
        references: [userPracticeSetAttempts.id],
    }),
    question: one(userPracticeSetQuestions, {
        fields: [userPracticeSetAnswers.questionId],
        references: [userPracticeSetQuestions.id],
    }),
}));

export const userExamSetsRelations = relations(userExamSets, ({ one, many }) => ({
    creator: one(users, {
        fields: [userExamSets.creatorId],
        references: [users.id],
    }),
    topic: one(assessmentTopics, {
        fields: [userExamSets.topicId],
        references: [assessmentTopics.id],
    }),
    questions: many(userExamSetQuestions),
    purchases: many(userExamSetPurchases),
    likes: many(userExamSetLikes),
    attempts: many(userExamSetAttempts),
}));

export const userExamSetQuestionsRelations = relations(userExamSetQuestions, ({ one, many }) => ({
    examSet: one(userExamSets, {
        fields: [userExamSetQuestions.examSetId],
        references: [userExamSets.id],
    }),
    answers: many(userExamSetAnswers),
}));

export const userExamSetPurchasesRelations = relations(userExamSetPurchases, ({ one }) => ({
    user: one(users, {
        fields: [userExamSetPurchases.userId],
        references: [users.id],
    }),
    examSet: one(userExamSets, {
        fields: [userExamSetPurchases.examSetId],
        references: [userExamSets.id],
    }),
}));

export const userExamSetLikesRelations = relations(userExamSetLikes, ({ one }) => ({
    user: one(users, {
        fields: [userExamSetLikes.userId],
        references: [users.id],
    }),
    examSet: one(userExamSets, {
        fields: [userExamSetLikes.examSetId],
        references: [userExamSets.id],
    }),
}));

export const userExamSetAttemptsRelations = relations(userExamSetAttempts, ({ one, many }) => ({
    user: one(users, {
        fields: [userExamSetAttempts.userId],
        references: [users.id],
    }),
    examSet: one(userExamSets, {
        fields: [userExamSetAttempts.examSetId],
        references: [userExamSets.id],
    }),
    answers: many(userExamSetAnswers),
}));

export const userExamSetAnswersRelations = relations(userExamSetAnswers, ({ one }) => ({
    attempt: one(userExamSetAttempts, {
        fields: [userExamSetAnswers.attemptId],
        references: [userExamSetAttempts.id],
    }),
    question: one(userExamSetQuestions, {
        fields: [userExamSetAnswers.questionId],
        references: [userExamSetQuestions.id],
    }),
}));

export const randomPracticeSessionsRelations = relations(randomPracticeSessions, ({ one }) => ({
    user: one(users, {
        fields: [randomPracticeSessions.userId],
        references: [users.id],
    }),
}));
