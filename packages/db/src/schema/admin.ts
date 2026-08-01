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

export const adminRoleEnum = pgEnum("admin_role", [
    "SUPER_ADMIN",
    "CONTENT_ADMIN",
    "FINANCE_ADMIN",
    "COMMUNITY_ADMIN",
    "MODULE_MANAGER",
    "VIEWER",
]);

export const adminStatusEnum = pgEnum("admin_status", [
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
]);

export const adminInviteStatusEnum = pgEnum("admin_invite_status", [
    "PENDING",
    "USED",
    "EXPIRED",
    "REVOKED",
]);

// ===========================
// Tables
// ===========================

export const adminAccess = pgTable(
    "admin_access",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        userId: text("user_id")
            .unique()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        adminRole: adminRoleEnum("admin_role").notNull().default("MODULE_MANAGER"),
        status: adminStatusEnum("status").notNull().default("ACTIVE"),
        permissions: jsonb("permissions").notNull().default({}),
        lastLoginAt: timestamp("last_login_at"),
        loginCount: integer("login_count").notNull().default(0),
        invitedBy: text("invited_by"),
        inviteCode: text("invite_code"),
        hashedPassword: text("hashed_password"),
        accessCode: text("access_code"),
        accessCodeExpiry: timestamp("access_code_expiry"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_admin_access_admin_role").on(table.adminRole),
        index("idx_admin_access_status").on(table.status),
        index("idx_admin_access_user_id").on(table.userId),
    ],
);

export const adminInvitations = pgTable(
    "admin_invitation",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        code: text("code")
            .unique()
            .notNull()
            .$defaultFn(() => createId()),
        email: text("email").notNull(),
        name: text("name"),
        adminRole: adminRoleEnum("admin_role").notNull(),
        permissions: jsonb("permissions").notNull().default({}),
        status: adminInviteStatusEnum("status").notNull().default("PENDING"),
        usedBy: text("used_by"),
        usedAt: timestamp("used_at"),
        expiresAt: timestamp("expires_at").notNull(),
        createdById: text("created_by_id")
            .notNull()
            .references(() => adminAccess.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_admin_invitation_code").on(table.code),
        index("idx_admin_invitation_email").on(table.email),
        index("idx_admin_invitation_status").on(table.status),
        index("idx_admin_invitation_expires_at").on(table.expiresAt),
        index("idx_admin_invitation_created_by_id").on(table.createdById),
    ],
);

export const adminAuditLogs = pgTable(
    "admin_audit_log",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        adminId: text("admin_id")
            .notNull()
            .references(() => adminAccess.id, { onDelete: "cascade" }),
        action: text("action").notNull(),
        module: text("module").notNull(),
        resourceType: text("resource_type"),
        resourceId: text("resource_id"),
        description: text("description"),
        changes: jsonb("changes"),
        metadata: jsonb("metadata"),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_admin_audit_log_admin_id").on(table.adminId),
        index("idx_admin_audit_log_module").on(table.module),
        index("idx_admin_audit_log_action").on(table.action),
        index("idx_admin_audit_log_created_at").on(table.createdAt),
        index("idx_admin_audit_log_resource_type_resource_id").on(table.resourceType, table.resourceId),
    ],
);

export const adminDashboardStats = pgTable(
    "admin_dashboard_stats",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        statType: text("stat_type").unique().notNull(),
        data: jsonb("data").notNull(),
        lastUpdatedAt: timestamp("last_updated_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_admin_dashboard_stats_stat_type").on(table.statType),
        index("idx_admin_dashboard_stats_last_updated_at").on(table.lastUpdatedAt),
    ],
);

export const adminNotifications = pgTable(
    "admin_notification",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        adminId: text("admin_id"),
        title: text("title").notNull(),
        message: text("message").notNull(),
        type: text("type").notNull().default("info"),
        actionUrl: text("action_url"),
        actionLabel: text("action_label"),
        isRead: boolean("is_read").notNull().default(false),
        readAt: timestamp("read_at"),
        metadata: jsonb("metadata"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        index("idx_admin_notification_admin_id").on(table.adminId),
        index("idx_admin_notification_is_read").on(table.isRead),
        index("idx_admin_notification_created_at").on(table.createdAt),
    ],
);

export const adminSystemSettings = pgTable(
    "admin_system_settings",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => createId()),
        key: text("key").unique().notNull(),
        value: jsonb("value").notNull(),
        description: text("description"),
        lastModifiedBy: text("last_modified_by"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at")
            .notNull()
            .$onUpdateFn(() => new Date()),
    },
    (table) => [
        index("idx_admin_system_settings_key").on(table.key),
    ],
);

// ===========================
// Relations
// ===========================

export const adminAccessRelations = relations(adminAccess, ({ one, many }) => ({
    user: one(users, {
        fields: [adminAccess.userId],
        references: [users.id],
    }),
    invitations: many(adminInvitations),
    auditLogs: many(adminAuditLogs),
}));

export const adminInvitationsRelations = relations(adminInvitations, ({ one }) => ({
    createdBy: one(adminAccess, {
        fields: [adminInvitations.createdById],
        references: [adminAccess.id],
    }),
}));

export const adminAuditLogsRelations = relations(adminAuditLogs, ({ one }) => ({
    admin: one(adminAccess, {
        fields: [adminAuditLogs.adminId],
        references: [adminAccess.id],
    }),
}));
