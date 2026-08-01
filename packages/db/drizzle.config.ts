import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Exclude orphaned Prisma-era tables that still exist in the DB but are no
  // longer part of the Drizzle schema. Without this, drizzle-kit reads them
  // from the DB and prompts "is X a rename of one of these?" for every new table.
  //
  // Since migration 0002 every table in the schema is camelCase, so a PascalCase
  // name in the database now MEANS "not part of the schema". The patterns below
  // are the ones that predate that rule and are kept for databases that still
  // have those tables. They do not cover every orphan currently in the database
  // (Community*, Conversation, ChatMessage, Badge, UserBadge, UserFollow,
  // AchievementNotification, FeatureNotifyInterest, SocialShare,
  // UserAchievementStats) — those are pending deletion rather than exclusion.
  //
  // This only affects `push`/`introspect`. `generate` diffs snapshot-to-snapshot
  // and never reads the database, so orphans cannot leak into a migration.
  tablesFilter: [
    "!Launchpad*",  // old launchpad product feature
    "!Space*",      // old spaces feature (SpaceMember, SpaceStep, etc.)
    "!Learn*",      // old learn feature (LearnStep, LearnProgress, etc. — NOT osLearn*)
    "!Codebase*",   // old codebase feature
    "!ProductIdea", // old standalone table
    "!accounts",    // old lowercase better-auth table (the current one is "account")
  ],
  verbose: true,
  strict: true,
});
