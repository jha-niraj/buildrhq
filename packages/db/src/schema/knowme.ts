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

export const knowMeStatusEnum = pgEnum("know_me_status", [
    "INACTIVE",
    "SETUP",
    "PROCESSING",
    "ACTIVE",
    "PAUSED",
    "ERROR",
]);

export const knowMePrivacyEnum = pgEnum("know_me_privacy", [
    "PUBLIC",
    "REGISTERED",
    "RECRUITERS",
    "PRIVATE",
]);

export const knowMePlatformEnum = pgEnum("know_me_platform", [
    "GITHUB",
    "LEETCODE",
    "STACKOVERFLOW",
    "LINKEDIN",
    "DEVTO",
    "HASHNODE",
    "CODEPEN",
    "DRIBBBLE",
]);

export const knowMeSyncStatusEnum = pgEnum("know_me_sync_status", [
    "PENDING",
    "SYNCING",
    "COMPLETED",
    "FAILED",
]);

export const knowMeDataTypeEnum = pgEnum("know_me_data_type", [
    "PROFILE",
    "PROJECT",
    "ASSESSMENT",
    "RESUME",
    "COVER_LETTER",
    "CUSTOM_BIO",
    "GITHUB_REPO",
    "GITHUB_CONTRIBUTION",
    "LEETCODE_PROBLEM",
    "STACKOVERFLOW_ANSWER",
    "LINKEDIN_EXPERIENCE",
    "OWNER_TRAINING",
    "OTHER",
]);

export const knowMeJobStatusEnum = pgEnum("know_me_job_status", [
    "QUEUED",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
]);

export const knowMeJobTypeEnum = pgEnum("know_me_job_type", [
    "FULL_SYNC",
    "INCREMENTAL",
    "PLATFORM_SYNC",
    "MANUAL_UPDATE",
]);

export const knowMeQuestionCategoryEnum = pgEnum("know_me_question_category", [
    "TECHNICAL_SKILLS",
    "PROJECTS",
    "WORK_EXPERIENCE",
    "EDUCATION",
    "ASSESSMENTS",
    "AVAILABILITY",
    "COMPENSATION",
    "SOFT_SKILLS",
    "GENERAL",
    "OTHER",
]);

export const knowMeViewerTypeEnum = pgEnum("know_me_viewer_type", [
    "OWNER",
    "REGISTERED_USER",
    "RECRUITER",
    "ANONYMOUS",
    "EXTERNAL_API",
]);

// ===========================
// Tables
// ===========================

export const knowMeProfiles = pgTable(
    "know_me_profile",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
        status: knowMeStatusEnum("status").notNull().default("INACTIVE"),
        privacy: knowMePrivacyEnum("privacy").notNull().default("PUBLIC"),
        isPublic: boolean("is_public").notNull().default(true),
        includePersonalData: boolean("include_personal_data").notNull().default(true),
        includePlatformData: boolean("include_platform_data").notNull().default(false),
        includeProjects: boolean("include_projects").notNull().default(true),
        includeAssessments: boolean("include_assessments").notNull().default(true),
        includeResume: boolean("include_resume").notNull().default(true),
        updateCycleDays: integer("update_cycle_days").notNull().default(10),
        lastUpdatedAt: timestamp("last_updated_at"),
        nextScheduledUpdate: timestamp("next_scheduled_update"),
        totalEmbeddingsCount: integer("total_embeddings_count").notNull().default(0),
        lastEmbeddingVersion: text("last_embedding_version"),
        apiKey: text("api_key").unique(),
        apiKeyHash: text("api_key_hash"),
        apiEnabled: boolean("api_enabled").notNull().default(false),
        apiRateLimit: integer("api_rate_limit").notNull().default(100),
        apiUsageToday: integer("api_usage_today").notNull().default(0),
        apiUsageTotal: integer("api_usage_total").notNull().default(0),
        apiLastResetAt: timestamp("api_last_reset_at").notNull().defaultNow(),
        totalQuestionsAnswered: integer("total_questions_answered").notNull().default(0),
        totalSessions: integer("total_sessions").notNull().default(0),
        totalVisitors: integer("total_visitors").notNull().default(0),
        totalExternalRequests: integer("total_external_requests").notNull().default(0),
        onboardingStep: integer("onboarding_step").notNull().default(0),
        onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
        onboardingStartedAt: timestamp("onboarding_started_at").notNull().defaultNow(),
        aiPersonality: text("ai_personality"),
        welcomeMessage: text("welcome_message"),
        suggestedQuestions: text("suggested_questions").array().notNull().default([]),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (t) => [
        index("know_me_profile_user_id_idx").on(t.userId),
        index("know_me_profile_status_idx").on(t.status),
        index("know_me_profile_api_key_idx").on(t.apiKey),
    ]
);

export const knowMePersonalData = pgTable(
    "know_me_personal_data",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        dataType: knowMeDataTypeEnum("data_type").notNull(),
        title: text("title"),
        fileName: text("file_name"),
        fileUrl: text("file_url"),
        fileSize: integer("file_size"),
        contentText: text("content_text"),
        contentHash: text("content_hash"),
        isActive: boolean("is_active").notNull().default(true),
        isIndexed: boolean("is_indexed").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (t) => [
        index("know_me_personal_data_profile_id_idx").on(t.profileId),
        index("know_me_personal_data_data_type_idx").on(t.dataType),
        index("know_me_personal_data_is_active_idx").on(t.isActive),
    ]
);

export const knowMePlatformConnections = pgTable(
    "know_me_platform_connection",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        platform: knowMePlatformEnum("platform").notNull(),
        platformUsername: text("platform_username"),
        platformUserId: text("platform_user_id"),
        profileUrl: text("profile_url"),
        connectionStatus: knowMeSyncStatusEnum("connection_status").notNull().default("PENDING"),
        isConnected: boolean("is_connected").notNull().default(false),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        tokenExpiresAt: timestamp("token_expires_at"),
        syncFrequencyDays: integer("sync_frequency_days").notNull().default(10),
        lastSyncedAt: timestamp("last_synced_at"),
        nextSyncAt: timestamp("next_sync_at"),
        lastSyncError: text("last_sync_error"),
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (t) => [
        uniqueIndex("know_me_platform_connection_profile_id_platform_key").on(t.profileId, t.platform),
        index("know_me_platform_connection_profile_id_idx").on(t.profileId),
        index("know_me_platform_connection_platform_idx").on(t.platform),
        index("know_me_platform_connection_connection_status_idx").on(t.connectionStatus),
    ]
);

export const knowMeExternalData = pgTable(
    "know_me_external_data",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        connectionId: text("connection_id").references(() => knowMePlatformConnections.id, { onDelete: "cascade" }),
        dataType: knowMeDataTypeEnum("data_type").notNull(),
        externalId: text("external_id"),
        title: text("title"),
        description: text("description"),
        url: text("url"),
        techStack: text("tech_stack").array().notNull().default([]),
        dateCreated: timestamp("date_created"),
        dateUpdated: timestamp("date_updated"),
        metrics: jsonb("metrics"),
        rawData: jsonb("raw_data"),
        isActive: boolean("is_active").notNull().default(true),
        isIndexed: boolean("is_indexed").notNull().default(false),
        isDuplicate: boolean("is_duplicate").notNull().default(false),
        mergedWithCoderProjectId: text("merged_with_coder_project_id"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (t) => [
        uniqueIndex("know_me_external_data_profile_id_connection_id_external_id_key").on(t.profileId, t.connectionId, t.externalId),
        index("know_me_external_data_profile_id_idx").on(t.profileId),
        index("know_me_external_data_data_type_idx").on(t.dataType),
        index("know_me_external_data_is_active_idx").on(t.isActive),
    ]
);

export const knowMeEmbeddings = pgTable(
    "know_me_embedding",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        sourceType: knowMeDataTypeEnum("source_type").notNull(),
        sourceId: text("source_id").notNull(),
        chunkIndex: integer("chunk_index").notNull().default(0),
        chunkText: text("chunk_text").notNull(),
        chunkHash: text("chunk_hash"),
        vectorId: text("vector_id").notNull(),
        vectorNamespace: text("vector_namespace").notNull(),
        vectorScore: real("vector_score"),
        embeddingModel: text("embedding_model").notNull().default("text-embedding-3-small"),
        embeddingVersion: integer("embedding_version").notNull().default(1),
        dimensions: integer("dimensions").notNull().default(1024),
        metadata: jsonb("metadata"),
        isActive: boolean("is_active").notNull().default(true),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (t) => [
        index("know_me_embedding_profile_id_idx").on(t.profileId),
        index("know_me_embedding_source_type_idx").on(t.sourceType),
        index("know_me_embedding_vector_id_idx").on(t.vectorId),
        index("know_me_embedding_is_active_idx").on(t.isActive),
    ]
);

export const knowMeEmbeddingJobs = pgTable(
    "know_me_embedding_job",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        jobType: knowMeJobTypeEnum("job_type").notNull(),
        status: knowMeJobStatusEnum("status").notNull().default("QUEUED"),
        priority: integer("priority").notNull().default(5),
        scope: jsonb("scope"),
        progress: integer("progress").notNull().default(0),
        totalItems: integer("total_items").notNull().default(0),
        processedItems: integer("processed_items").notNull().default(0),
        failedItems: integer("failed_items").notNull().default(0),
        result: jsonb("result"),
        errorLogs: text("error_logs").array().notNull().default([]),
        scheduledFor: timestamp("scheduled_for"),
        startedAt: timestamp("started_at"),
        completedAt: timestamp("completed_at"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        attempts: integer("attempts").notNull().default(0),
        maxAttempts: integer("max_attempts").notNull().default(3),
    },
    (t) => [
        index("know_me_embedding_job_profile_id_idx").on(t.profileId),
        index("know_me_embedding_job_status_idx").on(t.status),
        index("know_me_embedding_job_scheduled_for_idx").on(t.scheduledFor),
    ]
);

export const knowMeChatSessions = pgTable(
    "know_me_chat_session",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        visitorUserId: text("visitor_user_id").references(() => users.id, { onDelete: "set null" }),
        viewerType: knowMeViewerTypeEnum("viewer_type").notNull().default("ANONYMOUS"),
        visitorIp: text("visitor_ip"),
        visitorUserAgent: text("visitor_user_agent"),
        visitorCountry: text("visitor_country"),
        visitorCity: text("visitor_city"),
        visitorReferrer: text("visitor_referrer"),
        sessionToken: text("session_token").notNull().unique().$defaultFn(() => createId()),
        questionsAsked: integer("questions_asked").notNull().default(0),
        messagesCount: integer("messages_count").notNull().default(0),
        rateLimitRemaining: integer("rate_limit_remaining").notNull().default(20),
        rateLimitResetAt: timestamp("rate_limit_reset_at").notNull().defaultNow(),
        source: text("source"),
        startedAt: timestamp("started_at").notNull().defaultNow(),
        lastActivityAt: timestamp("last_activity_at").notNull().defaultNow(),
        endedAt: timestamp("ended_at"),
    },
    (t) => [
        index("know_me_chat_session_profile_id_idx").on(t.profileId),
        index("know_me_chat_session_visitor_user_id_idx").on(t.visitorUserId),
        index("know_me_chat_session_session_token_idx").on(t.sessionToken),
        index("know_me_chat_session_started_at_idx").on(t.startedAt),
    ]
);

export const knowMeChatMessages = pgTable(
    "know_me_chat_message",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        sessionId: text("session_id").notNull().references(() => knowMeChatSessions.id, { onDelete: "cascade" }),
        role: text("role").notNull(),
        content: text("content").notNull(),
        retrievedChunks: jsonb("retrieved_chunks"),
        modelUsed: text("model_used"),
        tokensUsed: integer("tokens_used"),
        responseTimeMs: integer("response_time_ms"),
        confidence: real("confidence"),
        sources: jsonb("sources"),
        wasHelpful: boolean("was_helpful"),
        feedback: text("feedback"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        index("know_me_chat_message_session_id_idx").on(t.sessionId),
        index("know_me_chat_message_created_at_idx").on(t.createdAt),
    ]
);

export const knowMeQuestionAnalytics = pgTable(
    "know_me_question_analytics",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        question: text("question").notNull(),
        questionCategory: knowMeQuestionCategoryEnum("question_category").notNull().default("OTHER"),
        questionKeywords: text("question_keywords").array().notNull().default([]),
        askedByUserId: text("asked_by_user_id").references(() => users.id, { onDelete: "set null" }),
        askedByType: knowMeViewerTypeEnum("asked_by_type").notNull().default("ANONYMOUS"),
        responseGenerated: boolean("response_generated").notNull().default(true),
        responseTimeMs: integer("response_time_ms"),
        responseTokens: integer("response_tokens"),
        wasHelpful: boolean("was_helpful"),
        source: text("source"),
        askedAt: timestamp("asked_at").notNull().defaultNow(),
    },
    (t) => [
        index("know_me_question_analytics_profile_id_idx").on(t.profileId),
        index("know_me_question_analytics_question_category_idx").on(t.questionCategory),
        index("know_me_question_analytics_asked_at_idx").on(t.askedAt),
        index("know_me_question_analytics_asked_by_user_id_idx").on(t.askedByUserId),
    ]
);

export const knowMeProfileViews = pgTable(
    "know_me_profile_view",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        viewerUserId: text("viewer_user_id").references(() => users.id, { onDelete: "set null" }),
        viewerType: knowMeViewerTypeEnum("viewer_type").notNull().default("ANONYMOUS"),
        viewerIp: text("viewer_ip"),
        sessionDurationSeconds: integer("session_duration_seconds"),
        questionsAsked: integer("questions_asked").notNull().default(0),
        source: text("source"),
        referrer: text("referrer"),
        viewedAt: timestamp("viewed_at").notNull().defaultNow(),
    },
    (t) => [
        index("know_me_profile_view_profile_id_idx").on(t.profileId),
        index("know_me_profile_view_viewer_user_id_idx").on(t.viewerUserId),
        index("know_me_profile_view_viewed_at_idx").on(t.viewedAt),
    ]
);

export const knowMeApiRequests = pgTable(
    "know_me_api_request",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        apiKey: text("api_key").notNull(),
        endpoint: text("endpoint").notNull(),
        method: text("method").notNull(),
        requestIp: text("request_ip"),
        requestHeaders: jsonb("request_headers"),
        requestBody: jsonb("request_body"),
        responseStatus: integer("response_status"),
        responseTimeMs: integer("response_time_ms"),
        tokensUsed: integer("tokens_used"),
        costUsd: real("cost_usd"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        index("know_me_api_request_profile_id_idx").on(t.profileId),
        index("know_me_api_request_api_key_idx").on(t.apiKey),
        index("know_me_api_request_created_at_idx").on(t.createdAt),
    ]
);

export const knowMePrivacySettings = pgTable(
    "know_me_privacy_settings",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        profileId: text("profile_id").notNull().unique().references(() => knowMeProfiles.id, { onDelete: "cascade" }),
        allowAnonymous: boolean("allow_anonymous").notNull().default(true),
        allowRegisteredUsers: boolean("allow_registered_users").notNull().default(true),
        allowRecruiters: boolean("allow_recruiters").notNull().default(true),
        shareBasicInfo: boolean("share_basic_info").notNull().default(true),
        shareProjects: boolean("share_projects").notNull().default(true),
        shareAssessments: boolean("share_assessments").notNull().default(true),
        shareWorkHistory: boolean("share_work_history").notNull().default(false),
        shareEducation: boolean("share_education").notNull().default(true),
        shareSalary: boolean("share_salary").notNull().default(false),
        shareExternalData: jsonb("share_external_data").notNull().default({ github: true, leetcode: true }),
        maxQuestionsPerSession: integer("max_questions_per_session").notNull().default(20),
        requireAuthForSensitive: boolean("require_auth_for_sensitive").notNull().default(true),
        blockedUserIds: text("blocked_user_ids").array().notNull().default([]),
        blockedCompanies: text("blocked_companies").array().notNull().default([]),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().$onUpdateFn(() => new Date()),
    },
    (t) => [
        index("know_me_privacy_settings_profile_id_idx").on(t.profileId),
    ]
);

export const knowMeCreditTransactions = pgTable(
    "know_me_credit_transaction",
    {
        id: text("id").primaryKey().$defaultFn(() => createId()),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        transactionType: text("transaction_type").notNull(),
        amount: integer("amount").notNull(),
        reason: text("reason"),
        balanceBefore: integer("balance_before").notNull(),
        balanceAfter: integer("balance_after").notNull(),
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (t) => [
        index("know_me_credit_transaction_user_id_idx").on(t.userId),
        index("know_me_credit_transaction_created_at_idx").on(t.createdAt),
    ]
);

// ===========================
// Relations
// ===========================

export const knowMeProfilesRelations = relations(knowMeProfiles, ({ one, many }) => ({
    user: one(users, {
        fields: [knowMeProfiles.userId],
        references: [users.id],
        relationName: "UserKnowMeProfile",
    }),
    personalData: many(knowMePersonalData),
    platformConnections: many(knowMePlatformConnections),
    externalData: many(knowMeExternalData),
    embeddings: many(knowMeEmbeddings),
    embeddingJobs: many(knowMeEmbeddingJobs),
    chatSessions: many(knowMeChatSessions),
    questionAnalytics: many(knowMeQuestionAnalytics),
    profileViews: many(knowMeProfileViews),
    apiRequests: many(knowMeApiRequests),
    privacySettings: one(knowMePrivacySettings),
}));

export const knowMePersonalDataRelations = relations(knowMePersonalData, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMePersonalData.profileId],
        references: [knowMeProfiles.id],
    }),
}));

export const knowMePlatformConnectionsRelations = relations(knowMePlatformConnections, ({ one, many }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMePlatformConnections.profileId],
        references: [knowMeProfiles.id],
    }),
    externalData: many(knowMeExternalData),
}));

export const knowMeExternalDataRelations = relations(knowMeExternalData, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeExternalData.profileId],
        references: [knowMeProfiles.id],
    }),
    connection: one(knowMePlatformConnections, {
        fields: [knowMeExternalData.connectionId],
        references: [knowMePlatformConnections.id],
    }),
}));

export const knowMeEmbeddingsRelations = relations(knowMeEmbeddings, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeEmbeddings.profileId],
        references: [knowMeProfiles.id],
    }),
}));

export const knowMeEmbeddingJobsRelations = relations(knowMeEmbeddingJobs, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeEmbeddingJobs.profileId],
        references: [knowMeProfiles.id],
    }),
}));

export const knowMeChatSessionsRelations = relations(knowMeChatSessions, ({ one, many }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeChatSessions.profileId],
        references: [knowMeProfiles.id],
    }),
    visitorUser: one(users, {
        fields: [knowMeChatSessions.visitorUserId],
        references: [users.id],
        relationName: "KnowMeVisitorSessions",
    }),
    messages: many(knowMeChatMessages),
}));

export const knowMeChatMessagesRelations = relations(knowMeChatMessages, ({ one }) => ({
    session: one(knowMeChatSessions, {
        fields: [knowMeChatMessages.sessionId],
        references: [knowMeChatSessions.id],
    }),
}));

export const knowMeQuestionAnalyticsRelations = relations(knowMeQuestionAnalytics, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeQuestionAnalytics.profileId],
        references: [knowMeProfiles.id],
    }),
    askedByUser: one(users, {
        fields: [knowMeQuestionAnalytics.askedByUserId],
        references: [users.id],
        relationName: "KnowMeQuestionsAsked",
    }),
}));

export const knowMeProfileViewsRelations = relations(knowMeProfileViews, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeProfileViews.profileId],
        references: [knowMeProfiles.id],
    }),
    viewerUser: one(users, {
        fields: [knowMeProfileViews.viewerUserId],
        references: [users.id],
        relationName: "KnowMeProfileViews",
    }),
}));

export const knowMeApiRequestsRelations = relations(knowMeApiRequests, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMeApiRequests.profileId],
        references: [knowMeProfiles.id],
    }),
}));

export const knowMePrivacySettingsRelations = relations(knowMePrivacySettings, ({ one }) => ({
    profile: one(knowMeProfiles, {
        fields: [knowMePrivacySettings.profileId],
        references: [knowMeProfiles.id],
    }),
}));

export const knowMeCreditTransactionsRelations = relations(knowMeCreditTransactions, ({ one }) => ({
    user: one(users, {
        fields: [knowMeCreditTransactions.userId],
        references: [users.id],
        relationName: "KnowMeCreditTransactions",
    }),
}));
