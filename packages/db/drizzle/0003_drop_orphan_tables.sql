-- Drop the 26 tables that exist in the database but not in the Drizzle schema,
-- plus the 13 enum types that only those tables used.
--
-- These are the remains of features that were removed from the codebase without
-- ever being removed from the database: the Community module (posts, comments,
-- events, polls, invites, leaderboards, tags), 1:1 chat (Conversation,
-- ChatMessage, ChatSettings), the badge / achievement-notification system, and
-- a few one-offs (SocialShare, FeatureNotifyInterest, UserAchievementStats, and
-- UserFollow -- superseded by the Follow table in chat.ts).
--
-- Verified against the live database before writing this:
--
--   * 0 foreign keys point INTO these tables from any table we keep, so
--     dropping them cannot orphan a kept row. The 25 FKs pointing OUT of them
--     into kept tables are dropped along with their owning table.
--   * every one of the 26 is EMPTY (0 live rows), so there is no data to lose.
--   * no view depends on any of them.
--   * each of the 13 enum types below is referenced only by columns of these
--     26 tables -- nothing we keep uses them.
--
-- All 26 go in a single DROP TABLE. That matters: the Community tables
-- reference each other, so dropping them one at a time in any order would fail
-- on an inbound foreign key. Naming them together lets Postgres resolve the
-- whole set at once -- which is also why CASCADE is deliberately NOT used. If
-- the "nothing outside this list depends on them" check above were ever wrong,
-- this fails loudly instead of silently dropping something we meant to keep.
DROP TABLE IF EXISTS
    "AchievementNotification",
    "Badge",
    "ChatMessage",
    "ChatSettings",
    "Community",
    "CommunityChallengeNew",
    "CommunityChallengeSubmission",
    "CommunityComment",
    "CommunityCommentLike",
    "CommunityEvent",
    "CommunityEventAttendee",
    "CommunityInvite",
    "CommunityLeaderboard",
    "CommunityMember",
    "CommunityPoll",
    "CommunityPollVote",
    "CommunityPost",
    "CommunityPostLike",
    "CommunityResource",
    "CommunityTag",
    "Conversation",
    "FeatureNotifyInterest",
    "SocialShare",
    "UserAchievementStats",
    "UserBadge",
    "UserFollow";
--> statement-breakpoint
DROP TYPE IF EXISTS
    "AchievementStatus",
    "AttendeeStatus",
    "BadgeCategory",
    "BadgeRarity",
    "ChatMessageStatus",
    "ChatMessageType",
    "CommunityEventStatus",
    "CommunityPostType",
    "CommunityResourceType",
    "CommunityRole",
    "CommunityType",
    "CommunityVisibility",
    "FeatureNotifySection";
