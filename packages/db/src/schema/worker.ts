import {
    pgTable,
    text,
    integer,
    timestamp,
    jsonb,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./schema";

// ===========================
// Tables
// ===========================

export const backgroundJobs = pgTable(
    "background_job",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        jobId: text("job_id").notNull().unique(),
        status: text("status").notNull(),
        progress: integer("progress").notNull().default(0),
        input: jsonb("input").notNull(),
        result: jsonb("result"),
        error: text("error"),
        userId: text("user_id").references(() => users.id),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_background_job_job_id").on(table.jobId),
        index("idx_background_job_status").on(table.status),
        index("idx_background_job_user_id").on(table.userId),
    ],
);

// ===========================
// Relations
// ===========================

export const backgroundJobsRelations = relations(backgroundJobs, ({ one }) => ({
    user: one(users, {
        fields: [backgroundJobs.userId],
        references: [users.id],
        relationName: "BackgroundJobs",
    }),
}));
