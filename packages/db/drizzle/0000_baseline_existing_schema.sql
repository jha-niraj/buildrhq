-- Baseline: every table that existed when Drizzle migrations were adopted.
--
-- This project was previously managed with `drizzle-kit push`, so all 209 tables
-- below already exist in the production and staging databases. Those databases
-- also already have this migration recorded as applied, so `drizzle-kit migrate`
-- skips the file entirely there — it compares the journal's `when` timestamp
-- against `__drizzle_migrations`, not the file's contents.
--
-- What this file is for is a BRAND-NEW database: `pnpm db:migrate` against an
-- empty Neon branch now provisions the whole schema, then 0001 applies on top.
-- Previously this file was `SELECT 1;`, which meant a fresh database got nothing
-- from 0000 and 0001 failed on its `ALTER TABLE "ProjectIdea"`.
--
-- Every statement is guarded (`IF NOT EXISTS`, or a DO block swallowing
-- `duplicate_object`) so it is also safe to run against a database that was
-- pushed to partially — no ordering surprises, no half-applied baseline.
--
-- Generated from meta/0000_snapshot.json via drizzle-kit; do not hand-edit.
-- Schema changes go in a NEW migration, never here.
DO $$ BEGIN
    CREATE TYPE "public"."ActivityType" AS ENUM('REFERRAL_BONUS', 'SIGNUP', 'FEEDBACK_SUBMITTED', 'REWARD_RECEIVED', 'STARTED_INTERVIEW', 'CREDIT_SHARED', 'CREDIT_RECEIVED', 'CREATED_PEER_TO_PEER_MOCK_INTERVIEW', 'DAILY_QUIZ_COMPLETED', 'COMPLETED_MOCK_INTERVIEW', 'COMPLETED_PRACTICE_SESSION', 'PROJECT_SUBMISSION', 'LEARN_COMPLETED', 'STUDIO_CREATED', 'STUDIO_UPDATED', 'JOINED_SPACE', 'POSTED_IN_SPACE', 'COMMENTED_IN_SPACE', 'COMPLETED_SPACE_STEP', 'CONTRIBUTED_TO_OPEN_SOURCE', 'FOLLOWING_USER', 'COMPLETED_DAILY_CHALLENGE', 'COMPLETED_GOAL_DAY', 'SHARED_ACHIEVEMENT', 'PATHFINDER_GOAL_COMPLETED', 'ASSESSMENT_PASSED', 'PATHFINDER_GOAL_STARTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ContributionStatus" AS ENUM('InProgress', 'Completed', 'Abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ContributionType" AS ENUM('PR', 'ISSUE', 'COMMIT', 'REVIEW', 'COMMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."CreditRequestStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."CreditType" AS ENUM('PURCHASE', 'SPEND', 'BONUS', 'REWARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."Currency" AS ENUM('INR', 'USD', 'EUR', 'GBP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."FeedbackCategory" AS ENUM('BUG', 'FEATURE', 'UI', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."FeedbackStatus" AS ENUM('UNDER_REVIEW', 'PLANNED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."InterviewCardDifficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."IssueDifficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."LearnDifficulty" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."LearnRequestStatus" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."LearnStatus" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."LearnStepType" AS ENUM('EXPLANATION', 'QUIZ', 'CODE_CHALLENGE', 'VIDEO', 'MOCK_INTERVIEW', 'PROJECT', 'INTERVIEW_QUESTIONS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."MockCategory" AS ENUM('TECHNICAL', 'BEHAVIORAL', 'HR', 'SYSTEM_DESIGN', 'LEADERSHIP', 'NEGOTIATION', 'CASE_STUDY', 'CODING', 'GENERAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."MockLevel" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."NotificationType" AS ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OpenSourceDifficulty" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PaymentStatus" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."Platform" AS ENUM('MAIN', 'HIRING', 'UNI', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectStatus" AS ENUM('NotStarted', 'InProgress', 'Completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectTier" AS ENUM('Free', 'Paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."QuizDifficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."QuizQuestionType" AS ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'CODE_OUTPUT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ResourceType" AS ENUM('YOUTUBE_VIDEO', 'VIDEO', 'DOCUMENTATION', 'BLOG_ARTICLE', 'COURSE', 'DISCORD_COMMUNITY', 'TOOL_RECOMMENDATION', 'DESIGN_MOCKUP', 'DESIGN_INSPIRATION', 'GITHUB_REPO', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."Role" AS ENUM('Student', 'Admin', 'HR', 'UNI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SkillCategory" AS ENUM('FRONTEND', 'LANGUAGES', 'BACKEND', 'API', 'DATABASE', 'DEVOPS', 'CLOUD', 'FRAMEWORKS_LIBRARIES', 'TOOLS_DATABASES', 'PLATFORMS', 'AI_TOOLS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SyncStatus" AS ENUM('PENDING', 'SYNCING', 'SUCCESS', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."XpTransactionProps" AS ENUM('EARN', 'SPEND', 'REWARD', 'BONUS', 'PENALTY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PortfolioProjectSource" AS ENUM('PROFILE', 'CONCEPTS', 'RESUMECREATOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProfileLayout" AS ENUM('DEFAULT', 'MINIMAL', 'SHOWCASE', 'PORTFOLIO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProfileTheme" AS ENUM('OCEAN_BLUE', 'SUNSET_ORANGE', 'FOREST_GREEN', 'PURPLE_DREAM', 'DARK_MODE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProfileVisibility" AS ENUM('PUBLIC', 'FOLLOWERS', 'PRIVATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SocialProvider" AS ENUM('TWITTER', 'LINKEDIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AdminInviteStatus" AS ENUM('PENDING', 'USED', 'EXPIRED', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AdminRole" AS ENUM('SUPER_ADMIN', 'CONTENT_ADMIN', 'FINANCE_ADMIN', 'COMMUNITY_ADMIN', 'MODULE_MANAGER', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AdminStatus" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."FollowRequestStatus" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."CompanyInvitationStatus" AS ENUM('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."CompanyMemberJobTitle" AS ENUM('CEO', 'CTO', 'COFOUNDER', 'VP_ENGINEERING', 'ENGINEERING_MANAGER', 'HR_HEAD', 'HR_MANAGER', 'TALENT_ACQUISITION', 'RECRUITER', 'HIRING_MANAGER', 'TECH_LEAD', 'INTERVIEWER', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."CompanyMemberRole" AS ENUM('FOUNDER', 'ADMIN', 'HIRING_MANAGER', 'RECRUITER', 'INTERVIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."CompanyVerificationStatus" AS ENUM('PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."HiringInvoiceStatus" AS ENUM('DRAFT', 'PENDING', 'PAID', 'VOID', 'UNCOLLECTIBLE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."HiringPaymentStatus" AS ENUM('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."HiringSubscriptionPlan" AS ENUM('FREE', 'PRO', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."HiringSubscriptionStatus" AS ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE', 'TRIALING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."MemberInviteStatus" AS ENUM('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."TemplateCategory" AS ENUM('ENGINEERING', 'PRODUCT', 'DESIGN', 'DATA_SCIENCE', 'MARKETING', 'SALES', 'OPERATIONS', 'INTERN', 'GENERAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."TemplateStyle" AS ENUM('STARTUP', 'FAANG', 'MNC', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."InterviewFormat" AS ENUM('VOICE', 'VIDEO', 'IN_PERSON', 'TAKE_HOME', 'LIVE_CODING', 'WHITEBOARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."InterviewRoundType" AS ENUM('PHONE_SCREEN', 'TECHNICAL_CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'TAKE_HOME', 'PANEL', 'HIRING_MANAGER', 'CULTURE_FIT', 'HR_FINAL', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."JobMockSessionType" AS ENUM('VOICE', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."JobMockStatus" AS ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ApplicationActivityType" AS ENUM('MOCK_INTERVIEW', 'AI_RESUME_REVIEW', 'Learn_REVIEW', 'PROJECT_PROGRESS', 'STUDIO_NOTE', 'SKILL_ASSESSMENT', 'ASSIGNMENT_PROGRESS', 'ASSIGNMENT_SUBMISSION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ApplicationStatus" AS ENUM('INTERESTED', 'PREPARING', 'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ASSIGNMENT_SENT', 'ASSIGNMENT_SUBMITTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_EXTENDED', 'HIRED', 'REJECTED', 'WITHDRAWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."EmploymentType" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."JobLocationType" AS ENUM('REMOTE', 'HYBRID', 'ONSITE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."JobStatus" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'FILLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."JobVisibility" AS ENUM('PUBLIC', 'INVITE_ONLY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."Module" AS ENUM('PATHFINDER', 'CONCEPTS', 'RESUME_TEMPLATE', 'RESUME_DRAFT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeDataType" AS ENUM('PROFILE', 'PROJECT', 'ASSESSMENT', 'RESUME', 'COVER_LETTER', 'CUSTOM_BIO', 'GITHUB_REPO', 'GITHUB_CONTRIBUTION', 'LEETCODE_PROBLEM', 'STACKOVERFLOW_ANSWER', 'LINKEDIN_EXPERIENCE', 'OWNER_TRAINING', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeJobStatus" AS ENUM('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeJobType" AS ENUM('FULL_SYNC', 'INCREMENTAL', 'PLATFORM_SYNC', 'MANUAL_UPDATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMePlatform" AS ENUM('GITHUB', 'LEETCODE', 'STACKOVERFLOW', 'LINKEDIN', 'DEVTO', 'HASHNODE', 'CODEPEN', 'DRIBBBLE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMePrivacy" AS ENUM('PUBLIC', 'REGISTERED', 'RECRUITERS', 'PRIVATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeQuestionCategory" AS ENUM('TECHNICAL_SKILLS', 'PROJECTS', 'WORK_EXPERIENCE', 'EDUCATION', 'ASSESSMENTS', 'AVAILABILITY', 'COMPENSATION', 'SOFT_SKILLS', 'GENERAL', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeStatus" AS ENUM('INACTIVE', 'SETUP', 'PROCESSING', 'ACTIVE', 'PAUSED', 'ERROR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeSyncStatus" AS ENUM('PENDING', 'SYNCING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."KnowMeViewerType" AS ENUM('OWNER', 'REGISTERED_USER', 'RECRUITER', 'ANONYMOUS', 'EXTERNAL_API');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PracticeDifficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PracticeMode" AS ENUM('EXAM', 'ASSIST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PracticeModule" AS ENUM('DSA', 'SYSTEM_DESIGN', 'WEB_FRONTEND', 'WEB_BACKEND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PracticeSessionStatus" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AssessmentLanguage" AS ENUM('JAVASCRIPT', 'PYTHON', 'C', 'CPP', 'REACTJS', 'TYPESCRIPT', 'JAVA', 'GO', 'RUST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AssessmentMode" AS ENUM('QUIZ', 'CODE', 'MOCK', 'MIXED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AssessmentQuestionType" AS ENUM('MCQ', 'MULTIPLE_SELECT', 'CODE_OUTPUT', 'CODE_WRITE', 'CODE_DEBUG', 'CODE_COMPLETE', 'SCENARIO', 'TRUE_FALSE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."AssessmentType" AS ENUM('PRACTICE', 'EXAM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."QuestionDifficulty" AS ENUM('EASY', 'INTERMEDIATE', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UserContentStatus" AS ENUM('GENERATING', 'DRAFT', 'ACTIVE', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."FeatureSuggestionStatus" AS ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."FeatureSuggestionType" AS ENUM('FEATURE', 'IMPROVEMENT', 'BUG_FIX', 'UI_UX', 'PERFORMANCE', 'DOCUMENTATION', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."IdeaType" AS ENUM('PROBLEM_STATEMENT', 'TECHNOLOGY_SPECIFIC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."MockSessionType" AS ENUM('PROJECT_FINAL', 'SPRINT_REVIEW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectErrorCategory" AS ENUM('SETUP', 'CONFIGURATION', 'DATABASE', 'API', 'UI', 'STATE', 'DEPLOYMENT', 'SECURITY', 'PERFORMANCE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectErrorSeverity" AS ENUM('HIGH', 'MEDIUM', 'LOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectErrorStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectIdeaStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectV2Difficulty" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectV2InvitationStatus" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectV2MemberRole" AS ENUM('ADMIN', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ProjectV2Visibility" AS ENUM('PRIVATE', 'PUBLIC');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."QuizV2Difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SprintSuggestionStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SuggestionSource" AS ENUM('CREATOR', 'ENROLLED_USER', 'VISITOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."TaskAssessmentType" AS ENUM('QUIZ', 'CODE', 'NONE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."TaskKanbanStatus" AS ENUM('TO_DO', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UserProjectV2Status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSCertificationStatus" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'PASSED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSContributionStatus" AS ENUM('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'MERGED', 'CHANGES_REQUESTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSContributionType" AS ENUM('ISSUE_CREATED', 'ISSUE_SOLVED', 'PR_SUBMITTED', 'PR_MERGED', 'CODE_REVIEW', 'DOCUMENTATION', 'BUG_FIX', 'FEATURE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSIssueDifficulty" AS ENUM('GOOD_FIRST_ISSUE', 'EASY', 'MEDIUM', 'HARD', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSIssueStatus" AS ENUM('OPEN', 'ASSIGNED', 'IN_REVIEW', 'COMPLETED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSLearnLabType" AS ENUM('CODE', 'TERMINAL', 'QUIZ', 'PROJECT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSLearnModuleType" AS ENUM('VIDEO', 'READING', 'INTERACTIVE', 'QUIZ', 'PROJECT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSProjectCategory" AS ENUM('WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'BACKEND', 'FULLSTACK', 'AI_ML', 'DEVOPS', 'BLOCKCHAIN', 'GAME_DEVELOPMENT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSProjectStatus" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."OSProjectType" AS ENUM('LEARNING', 'FREE', 'PAID', 'EXCLUSIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PathfinderCategory" AS ENUM('DSA', 'WEB_DEVELOPMENT', 'FRONTEND', 'BACKEND', 'DEVOPS', 'AI_ML', 'DATABASE', 'SYSTEM_DESIGN', 'MOBILE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PathfinderGoalDuration" AS ENUM('ONE_WEEK', 'FORTNIGHT', 'ONE_MONTH', 'TWO_MONTHS', 'THREE_MONTHS', 'SIX_MONTHS', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PathfinderLevel" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."PathfinderStatus" AS ENUM('ACTIVE', 'VERIFICATION', 'COMPLETED', 'FAILED', 'ABANDONED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SubGoalStatus" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."VerificationSectionStatus" AS ENUM('LOCKED', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."ContentSource" AS ENUM('AI', 'USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioBlockType" AS ENUM('TEXT', 'HEADING', 'CODE', 'QUIZ', 'FLASHCARD', 'IMAGE', 'VIDEO', 'PRACTICE', 'MOCK_INTERVIEW', 'EMBED', 'DIVIDER', 'CALLOUT', 'BULLET_LIST', 'NUMBERED_LIST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioCategory" AS ENUM('GENERAL', 'PROGRAMMING', 'WEB_DEVELOPMENT', 'DATA_SCIENCE', 'DEVOPS', 'MOBILE_DEVELOPMENT', 'SYSTEM_DESIGN', 'INTERVIEW_PREP', 'PROJECT_NOTES', 'TUTORIAL', 'COURSE_NOTES', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioMediaType" AS ENUM('IMAGE', 'VIDEO', 'DIAGRAM', 'UPLOAD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioSource" AS ENUM('MANUAL', 'PATHFINDER', 'SPACE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioStepStatus" AS ENUM('DRAFT', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioStepType" AS ENUM('EXPLANATION', 'NOTE', 'QUIZ', 'CODE', 'IMAGE', 'VIDEO', 'DOCUMENT', 'PROJECT', 'MOCK_INTERVIEW', 'FLASHCARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudioVisibility" AS ENUM('PRIVATE', 'PUBLIC', 'COMMUNITY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SemesterType" AS ENUM('SEMESTER_1', 'SEMESTER_2', 'SEMESTER_3', 'SEMESTER_4', 'SEMESTER_5', 'SEMESTER_6', 'SEMESTER_7', 'SEMESTER_8');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."StudentVerificationStatus" AS ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."SubmissionGradingStatus" AS ENUM('NOT_SUBMITTED', 'SUBMITTED', 'UNDER_REVIEW', 'GRADED', 'RESUBMISSION_REQUESTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityAssignmentStatus" AS ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityAssignmentType" AS ENUM('QUIZ', 'CODING', 'PROJECT', 'MOCK_INTERVIEW', 'SPACE_TOPIC', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityJobVisibility" AS ENUM('PUBLIC', 'UNIVERSITY_ONLY', 'FILTERED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityMemberInviteStatus" AS ENUM('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityMemberJobTitle" AS ENUM('CHANCELLOR', 'PRINCIPAL', 'REGISTRAR', 'DEAN', 'HOD', 'PROFESSOR', 'ASSOCIATE_PROFESSOR', 'ASSISTANT_PROFESSOR', 'LECTURER', 'PLACEMENT_COORDINATOR', 'PLACEMENT_OFFICER', 'FINANCE_MANAGER', 'ACCOUNTS_OFFICER', 'TEACHING_ASSISTANT', 'LAB_INSTRUCTOR', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityMemberRole" AS ENUM('HEAD', 'DEPARTMENT_HEAD', 'PLACEMENT_OFFICER', 'FINANCE_OFFICER', 'FACULTY', 'TEACHING_ASSISTANT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversitySubscriptionPlan" AS ENUM('FREE', 'STARTER', 'GROWTH', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversitySubscriptionStatus" AS ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE', 'TRIALING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityType" AS ENUM('PUBLIC', 'PRIVATE', 'DEEMED', 'AUTONOMOUS', 'STATE', 'CENTRAL', 'AFFILIATED', 'COMMUNITY_COLLEGE', 'TECHNICAL_INSTITUTE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "public"."UniversityVerificationStatus" AS ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"idToken" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"category" "FeedbackCategory" DEFAULT 'OTHER' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "FeedbackStatus" DEFAULT 'UNDER_REVIEW' NOT NULL,
	"isAnonymous" boolean DEFAULT false NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Notification" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "NotificationType" DEFAULT 'INFO' NOT NULL,
	"platform" "Platform" DEFAULT 'MAIN' NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"actionUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserSkill" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"level" text DEFAULT 'beginner' NOT NULL,
	"category" "SkillCategory" NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text DEFAULT 'https://tse4.mm.bing.net/th?id=OIP.-BS8Y2nH1k93GJiitUVBCAHaHa&pid=Api&P=0',
	"hashedPassword" text,
	"mustChangePassword" boolean DEFAULT false NOT NULL,
	"role" "Role" DEFAULT 'Student' NOT NULL,
	"verifyToken" text,
	"verifyTokenExpiry" timestamp,
	"verifyOTP" text,
	"verifyOTPExpiry" timestamp,
	"resetToken" text,
	"restTokenExpiry" timestamp,
	"resetOTP" text,
	"resetOTPExpiry" timestamp,
	"onboardingCompleted" boolean DEFAULT false NOT NULL,
	"onboardingStep" integer DEFAULT 0 NOT NULL,
	"username" text,
	"bio" text,
	"headline" text,
	"location" text,
	"gender" text,
	"phone" text,
	"yearofbirth" text,
	"university" text,
	"semester" text,
	"company" text,
	"occupation" text,
	"website" text,
	"hasResume" boolean DEFAULT false NOT NULL,
	"resume" text,
	"resumeText" text,
	"interests" text[] DEFAULT '{}' NOT NULL,
	"learningPreferences" text[] DEFAULT '{}' NOT NULL,
	"careerGoals" text[] DEFAULT '{}' NOT NULL,
	"targetCompanies" text[] DEFAULT '{}' NOT NULL,
	"expectedSalary" text,
	"noticePeriod" text,
	"workExperience" text,
	"openToWork" boolean DEFAULT false NOT NULL,
	"credits" integer DEFAULT 100 NOT NULL,
	"totalCredits" integer DEFAULT 0 NOT NULL,
	"creditsShared" integer DEFAULT 0 NOT NULL,
	"totalCreditsShared" integer DEFAULT 0 NOT NULL,
	"maxCreditsShared" integer DEFAULT 500 NOT NULL,
	"currentXp" integer DEFAULT 250 NOT NULL,
	"totalXp" integer DEFAULT 250 NOT NULL,
	"currentLevel" integer DEFAULT 1 NOT NULL,
	"referralCode" text,
	"referralCount" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"lastActiveDate" timestamp,
	"githubUrl" text,
	"linkedinUrl" text,
	"twitterUrl" text,
	"websiteUrl" text,
	"profileViews" integer DEFAULT 0 NOT NULL,
	"isPublicProfile" boolean DEFAULT true NOT NULL,
	"yearsOfExperience" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Certifications" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"issuedDate" timestamp NOT NULL,
	"link" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Config" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Newsletter" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"subscribedAt" timestamp DEFAULT now() NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	CONSTRAINT "Newsletter_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PortfolioProject" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectName" text NOT NULL,
	"projectType" text NOT NULL,
	"description" text,
	"bulletPoints" text[] DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'In Progress' NOT NULL,
	"visibility" text DEFAULT 'Public' NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"thumbnailUrl" text,
	"source" "PortfolioProjectSource" DEFAULT 'PROFILE' NOT NULL,
	"learnStepId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProfileView" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"viewerId" text,
	"source" text,
	"referrer" text,
	"userAgent" text,
	"ipAddress" text,
	"country" text,
	"city" text,
	"viewedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectLink" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"linkType" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectMedia" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"mediaType" text NOT NULL,
	"caption" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RecentActivity" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"activityType" text,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Reward" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"xp" integer,
	"credits" integer NOT NULL,
	"amount" integer,
	"description" text NOT NULL,
	"feedbackId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Reward_feedbackId_unique" UNIQUE("feedbackId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SkillEndorsement" (
	"id" text PRIMARY KEY NOT NULL,
	"skillId" text NOT NULL,
	"endorserId" text NOT NULL,
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Skills" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL,
	"category" "SkillCategory" NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SocialLink" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"label" text,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserDSATrackingEntry" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"problemId" text NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"lastAttemptAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserEducation" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"degree" text,
	"institution" text NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"bulletPoints" text[] DEFAULT '{}' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"coverGradient" text DEFAULT '#F59E0B,#FBBF24',
	"theme" "ProfileTheme" DEFAULT 'OCEAN_BLUE' NOT NULL,
	"layout" "ProfileLayout" DEFAULT 'DEFAULT' NOT NULL,
	"tagline" text,
	"visibility" "ProfileVisibility" DEFAULT 'PUBLIC' NOT NULL,
	"showEmail" boolean DEFAULT false NOT NULL,
	"showResume" boolean DEFAULT true NOT NULL,
	"showActivity" boolean DEFAULT true NOT NULL,
	"showStats" boolean DEFAULT true NOT NULL,
	"allowEndorsements" boolean DEFAULT true NOT NULL,
	"allowMessages" boolean DEFAULT true NOT NULL,
	"profileViews" integer DEFAULT 0 NOT NULL,
	"completionScore" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserProfile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WorkExperience" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"companyName" text NOT NULL,
	"companyLogo" text,
	"roleTitle" text NOT NULL,
	"companyWebsite" text,
	"description" text,
	"bulletPoints" text[] DEFAULT '{}' NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"isCurrentlyWorking" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Level" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"xpRequired" integer NOT NULL,
	"xpReward" integer DEFAULT 0 NOT NULL,
	"creditsReward" integer DEFAULT 0 NOT NULL,
	"perks" jsonb,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Level_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SocialConnection" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"provider" "SocialProvider" NOT NULL,
	"providerAccountId" text NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text,
	"tokenExpiresAt" timestamp,
	"accountName" text,
	"accountHandle" text,
	"accountImage" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"lastUsedAt" timestamp,
	"connectedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserLevelProgress" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"level" integer NOT NULL,
	"xpEarned" integer DEFAULT 0 NOT NULL,
	"creditsEarned" integer DEFAULT 0 NOT NULL,
	"achievedAt" timestamp DEFAULT now() NOT NULL,
	"sharedToSocial" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "XpTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"type" "XpTransactionProps" DEFAULT 'REWARD' NOT NULL,
	"source" text,
	"sourceId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ActivityEntry" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"dailyActivityId" text NOT NULL,
	"activityType" "ActivityType" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"xpEarned" integer DEFAULT 0 NOT NULL,
	"creditsEarned" integer DEFAULT 0 NOT NULL,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DailyActivity" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" date NOT NULL,
	"hasActivity" boolean DEFAULT false NOT NULL,
	"totalXpEarned" integer DEFAULT 0 NOT NULL,
	"totalCreditsEarned" integer DEFAULT 0 NOT NULL,
	"totalTimeSpent" integer DEFAULT 0 NOT NULL,
	"activitiesCount" integer DEFAULT 0 NOT NULL,
	"isStreakDay" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "DailyActivity_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StreakReward" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"streakDays" integer NOT NULL,
	"creditsAwarded" integer NOT NULL,
	"awardedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserAchievement" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"achievementType" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"badgeIcon" text NOT NULL,
	"badgeColor" text NOT NULL,
	"creditsAwarded" integer DEFAULT 0 NOT NULL,
	"unlockedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserStats" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"currentStreak" integer DEFAULT 0 NOT NULL,
	"longestStreak" integer DEFAULT 0 NOT NULL,
	"totalSpeakingTime" integer DEFAULT 0 NOT NULL,
	"weeklyTalkingTime" integer DEFAULT 0 NOT NULL,
	"totalConversations" integer DEFAULT 0 NOT NULL,
	"weeklyConversations" integer DEFAULT 0 NOT NULL,
	"lastActivityDate" timestamp,
	"weekStartDate" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserStats_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminAccess" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"adminRole" "AdminRole" DEFAULT 'MODULE_MANAGER' NOT NULL,
	"status" "AdminStatus" DEFAULT 'ACTIVE' NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"lastLoginAt" timestamp,
	"loginCount" integer DEFAULT 0 NOT NULL,
	"invitedBy" text,
	"inviteCode" text,
	"hashedPassword" text,
	"accessCode" text,
	"accessCodeExpiry" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "AdminAccess_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
	"id" text PRIMARY KEY NOT NULL,
	"adminId" text NOT NULL,
	"action" text NOT NULL,
	"module" text NOT NULL,
	"resourceType" text,
	"resourceId" text,
	"description" text,
	"changes" jsonb,
	"metadata" jsonb,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminDashboardStats" (
	"id" text PRIMARY KEY NOT NULL,
	"statType" text NOT NULL,
	"data" jsonb NOT NULL,
	"lastUpdatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "AdminDashboardStats_statType_unique" UNIQUE("statType")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"adminRole" "AdminRole" NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "AdminInviteStatus" DEFAULT 'PENDING' NOT NULL,
	"usedBy" text,
	"usedAt" timestamp,
	"expiresAt" timestamp NOT NULL,
	"createdById" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "AdminInvitation_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminNotification" (
	"id" text PRIMARY KEY NOT NULL,
	"adminId" text,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info' NOT NULL,
	"actionUrl" text,
	"actionLabel" text,
	"isRead" boolean DEFAULT false NOT NULL,
	"readAt" timestamp,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminSystemSettings" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"lastModifiedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "AdminSystemSettings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CodeEvaluation" (
	"id" text PRIMARY KEY NOT NULL,
	"questionText" text NOT NULL,
	"userCode" text NOT NULL,
	"language" text NOT NULL,
	"evaluation" jsonb,
	"score" integer,
	"feedback" text,
	"strengths" text[] DEFAULT '{}' NOT NULL,
	"improvements" text[] DEFAULT '{}' NOT NULL,
	"isSubmitted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"interviewId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CoverLetter" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"jobUrl" text NOT NULL,
	"companyName" text,
	"jobTitle" text,
	"jobDescription" text,
	"questions" jsonb,
	"answers" jsonb,
	"tone" text DEFAULT 'Professional',
	"generatedContent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "InterviewPlanPurchase" (
	"id" text PRIMARY KEY NOT NULL,
	"buyerId" text NOT NULL,
	"interviewPlanId" text NOT NULL,
	"cost" integer NOT NULL,
	"purchasedAt" timestamp DEFAULT now() NOT NULL,
	"newInterviewPlanId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobInterviewAssistant" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"position" text NOT NULL,
	"jobDescription" text NOT NULL,
	"companyUrl" text NOT NULL,
	"companyInfo" jsonb,
	"generatedContent" jsonb NOT NULL,
	"includeAnswers" boolean DEFAULT false NOT NULL,
	"includePractice" boolean DEFAULT false NOT NULL,
	"searchHash" text,
	"slug" text DEFAULT 'niraj jha' NOT NULL,
	"technicalCount" integer DEFAULT 8 NOT NULL,
	"behavioralCount" integer DEFAULT 8 NOT NULL,
	"codingCount" integer DEFAULT 3 NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"publicCost" integer,
	"description" text,
	"creditsCost" integer,
	"purchaseCount" integer DEFAULT 0 NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"rating" real,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "JobInterviewAssistant_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuestionAnswer" (
	"id" text PRIMARY KEY NOT NULL,
	"questionText" text NOT NULL,
	"questionType" text NOT NULL,
	"language" text,
	"answer" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"interviewId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResumeDraft" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"templateSlug" text DEFAULT 'clean-minimal' NOT NULL,
	"content" jsonb NOT NULL,
	"tailoredFor" text,
	"jdSnapshot" text,
	"atsScore" integer,
	"isPublic" boolean DEFAULT false NOT NULL,
	"shareSlug" text NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"importedFrom" text,
	"importedUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ResumeDraft_shareSlug_unique" UNIQUE("shareSlug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResumeTemplate" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"previewImageUrl" text NOT NULL,
	"sectionOrder" jsonb NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"creditsCost" integer DEFAULT 10 NOT NULL,
	"isPlatform" boolean DEFAULT false NOT NULL,
	"createdById" text,
	"isMarketplace" boolean DEFAULT false NOT NULL,
	"isFeatured" boolean DEFAULT false NOT NULL,
	"marketplacePrice" integer DEFAULT 0 NOT NULL,
	"config" jsonb,
	"totalSales" integer DEFAULT 0 NOT NULL,
	"totalRevenue" integer DEFAULT 0 NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ResumeTemplate_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResumeTemplateGeneration" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"templateId" text NOT NULL,
	"generatedContent" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TemplatePurchase" (
	"id" text PRIMARY KEY NOT NULL,
	"buyerId" text NOT NULL,
	"templateId" text NOT NULL,
	"pricePaid" integer NOT NULL,
	"creatorEarning" integer NOT NULL,
	"platformFee" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserQuestionResponse" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"interviewId" text NOT NULL,
	"questionText" text NOT NULL,
	"questionType" text NOT NULL,
	"questionIndex" integer NOT NULL,
	"userAnswer" text NOT NULL,
	"answerMethod" text DEFAULT 'text' NOT NULL,
	"score" integer NOT NULL,
	"feedback" text NOT NULL,
	"strengths" text[] DEFAULT '{}' NOT NULL,
	"improvements" text[] DEFAULT '{}' NOT NULL,
	"comparedToExpert" jsonb NOT NULL,
	"evaluationDetails" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CommunityPostBookmark" (
	"id" text PRIMARY KEY NOT NULL,
	"postId" text NOT NULL,
	"userId" text NOT NULL,
	"folder" text DEFAULT 'Saved',
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MockInterviewBookmark" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text NOT NULL,
	"folder" text DEFAULT 'Saved',
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"mockVoiceSessionId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Bookmark" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"userId" text NOT NULL,
	"folder" text DEFAULT 'Saved',
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Follow" (
	"id" text PRIMARY KEY NOT NULL,
	"followerId" text NOT NULL,
	"followingId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FollowRequest" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"receiverId" text NOT NULL,
	"status" "FollowRequestStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logoUrl" text,
	"website" text,
	"description" text,
	"industry" text,
	"companySize" text,
	"foundedYear" integer,
	"headquarters" text,
	"socialLinks" jsonb,
	"address" text,
	"city" text,
	"state" text,
	"country" text,
	"pincode" text,
	"culture" text,
	"benefits" jsonb,
	"techStack" jsonb,
	"mediaGallery" jsonb,
	"responseRatePercent" real,
	"avgTimeToHireDays" integer,
	"interviewToOfferPercent" real,
	"totalHired" integer DEFAULT 0 NOT NULL,
	"totalApplications" integer DEFAULT 0 NOT NULL,
	"verificationStatus" "CompanyVerificationStatus" DEFAULT 'PENDING' NOT NULL,
	"verifiedAt" timestamp,
	"verifiedBy" text,
	"inviteCode" text,
	"createdByUserId" text,
	"hasInterviewProcess" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Company_slug_unique" UNIQUE("slug"),
	CONSTRAINT "Company_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanyFollower" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"companyId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanyInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"companyName" text,
	"invitedBy" text,
	"inviteCode" text NOT NULL,
	"status" "CompanyInvitationStatus" DEFAULT 'PENDING' NOT NULL,
	"acceptedAt" timestamp,
	"expiresAt" timestamp,
	"metadata" jsonb,
	"companyId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "CompanyInvitation_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanyInvoice" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"paymentId" text NOT NULL,
	"invoiceNumber" text NOT NULL,
	"status" "HiringInvoiceStatus" DEFAULT 'DRAFT' NOT NULL,
	"lineItems" jsonb NOT NULL,
	"subtotal" real NOT NULL,
	"taxAmount" real DEFAULT 0 NOT NULL,
	"taxRate" real DEFAULT 0 NOT NULL,
	"discount" real DEFAULT 0 NOT NULL,
	"totalAmount" real NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"billingName" text,
	"billingEmail" text,
	"billingAddress" text,
	"billingCity" text,
	"billingState" text,
	"billingCountry" text,
	"billingPincode" text,
	"gstNumber" text,
	"invoiceDate" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp,
	"paidAt" timestamp,
	"pdfUrl" text,
	"notes" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "CompanyInvoice_paymentId_unique" UNIQUE("paymentId"),
	CONSTRAINT "CompanyInvoice_invoiceNumber_unique" UNIQUE("invoiceNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanyMember" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"companyId" text NOT NULL,
	"role" "CompanyMemberRole" DEFAULT 'RECRUITER' NOT NULL,
	"jobTitle" "CompanyMemberJobTitle" DEFAULT 'OTHER' NOT NULL,
	"jobTitleCustom" text,
	"displayName" text,
	"email" text NOT NULL,
	"phone" text,
	"permissions" jsonb DEFAULT '["view_jobs","post_jobs","view_applications","review_candidates"]'::jsonb NOT NULL,
	"inviteStatus" "MemberInviteStatus" DEFAULT 'ACCEPTED' NOT NULL,
	"invitedById" text,
	"invitedAt" timestamp,
	"acceptedAt" timestamp,
	"isActive" boolean DEFAULT true NOT NULL,
	"lastActiveAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanyPayment" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"subscriptionId" text,
	"dodoPaymentId" text,
	"dodoCheckoutSessionId" text,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" "HiringPaymentStatus" DEFAULT 'PENDING' NOT NULL,
	"paymentMethod" text,
	"billingEmail" text,
	"billingName" text,
	"description" text,
	"metadata" jsonb,
	"paidAt" timestamp,
	"failedAt" timestamp,
	"refundedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "CompanyPayment_dodoPaymentId_unique" UNIQUE("dodoPaymentId"),
	CONSTRAINT "CompanyPayment_dodoCheckoutSessionId_unique" UNIQUE("dodoCheckoutSessionId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanySubscription" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"plan" "HiringSubscriptionPlan" DEFAULT 'FREE' NOT NULL,
	"status" "HiringSubscriptionStatus" DEFAULT 'ACTIVE' NOT NULL,
	"dodoSubscriptionId" text,
	"dodoProductId" text,
	"dodoPriceId" text,
	"maxJobPosts" integer DEFAULT 3 NOT NULL,
	"maxApplications" integer DEFAULT 50 NOT NULL,
	"maxInterviewTemplates" integer DEFAULT 1 NOT NULL,
	"maxTeamMembers" integer DEFAULT 1 NOT NULL,
	"hasAIScreening" boolean DEFAULT false NOT NULL,
	"hasCustomAssignments" boolean DEFAULT false NOT NULL,
	"hasPrioritySupport" boolean DEFAULT false NOT NULL,
	"hasAPIAccess" boolean DEFAULT false NOT NULL,
	"hasSSO" boolean DEFAULT false NOT NULL,
	"hasWhiteLabel" boolean DEFAULT false NOT NULL,
	"amount" real DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"billingCycle" text DEFAULT 'monthly' NOT NULL,
	"currentPeriodStart" timestamp DEFAULT now() NOT NULL,
	"currentPeriodEnd" timestamp,
	"trialStart" timestamp,
	"trialEnd" timestamp,
	"cancelledAt" timestamp,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "CompanySubscription_companyId_unique" UNIQUE("companyId"),
	CONSTRAINT "CompanySubscription_dodoSubscriptionId_unique" UNIQUE("dodoSubscriptionId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "InterviewProcessTemplate" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"style" "TemplateStyle" DEFAULT 'CUSTOM' NOT NULL,
	"category" "TemplateCategory" DEFAULT 'GENERAL' NOT NULL,
	"rounds" jsonb NOT NULL,
	"estimatedDurationWeeks" integer,
	"roundCount" integer DEFAULT 0 NOT NULL,
	"isAiGenerated" boolean DEFAULT false NOT NULL,
	"aiPrompt" text,
	"isPublic" boolean DEFAULT true NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"createdByCompanyId" text,
	"createdByUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MemberInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" "CompanyMemberRole" DEFAULT 'RECRUITER' NOT NULL,
	"jobTitle" "CompanyMemberJobTitle" DEFAULT 'RECRUITER' NOT NULL,
	"inviteCode" text NOT NULL,
	"invitedById" text NOT NULL,
	"status" "MemberInviteStatus" DEFAULT 'PENDING' NOT NULL,
	"message" text,
	"expiresAt" timestamp,
	"acceptedAt" timestamp,
	"resultingMemberId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "MemberInvitation_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "InterviewPrepProgress" (
	"id" text PRIMARY KEY NOT NULL,
	"applicationId" text NOT NULL,
	"userId" text NOT NULL,
	"overallReadinessScore" integer DEFAULT 0 NOT NULL,
	"targetReadinessScore" integer DEFAULT 80 NOT NULL,
	"roundsCompleted" integer DEFAULT 0 NOT NULL,
	"totalRounds" integer DEFAULT 0 NOT NULL,
	"lastPracticedAt" timestamp,
	"totalPracticeSessions" integer DEFAULT 0 NOT NULL,
	"totalPracticeMinutes" integer DEFAULT 0 NOT NULL,
	"bestScores" jsonb,
	"nextRecommendedRound" text,
	"recommendedResources" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "InterviewPrepProgress_applicationId_unique" UNIQUE("applicationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "InterviewProcess" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"isDefault" boolean DEFAULT false NOT NULL,
	"estimatedDurationWeeks" real,
	"avgTimeToHireDays" integer,
	"responseRatePercent" real,
	"applicationToInterviewPercent" real,
	"interviewToOfferPercent" real,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "InterviewRound" (
	"id" text PRIMARY KEY NOT NULL,
	"processId" text NOT NULL,
	"roundNumber" integer NOT NULL,
	"roundType" "InterviewRoundType" NOT NULL,
	"title" text NOT NULL,
	"durationMinutes" integer,
	"format" "InterviewFormat" DEFAULT 'VIDEO' NOT NULL,
	"description" text NOT NULL,
	"whatToExpect" jsonb,
	"sampleQuestions" jsonb,
	"evaluationCriteria" jsonb,
	"topicsCovered" jsonb,
	"tipsForCandidates" jsonb,
	"passRatePercent" real,
	"daysToNextRound" integer,
	"internalNotes" text,
	"interviewerGuide" text,
	"hasMockInterview" boolean DEFAULT true NOT NULL,
	"mockKnowledgeBase" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobMockSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"jobId" text,
	"companyId" text NOT NULL,
	"roundId" text NOT NULL,
	"sessionType" "JobMockSessionType" DEFAULT 'VOICE' NOT NULL,
	"status" "JobMockStatus" DEFAULT 'SCHEDULED' NOT NULL,
	"conversationId" text,
	"agentId" text,
	"variables" jsonb,
	"scheduledFor" timestamp,
	"startedAt" timestamp,
	"completedAt" timestamp,
	"durationSeconds" integer,
	"recordingUrl" text,
	"transcriptUrl" text,
	"transcript" text,
	"codeSubmission" text,
	"codeLanguage" text,
	"testResults" jsonb,
	"diagramUrl" text,
	"designNotes" text,
	"overallScore" integer,
	"aiAnalysis" jsonb,
	"categoryScores" jsonb,
	"strengths" jsonb,
	"improvements" jsonb,
	"percentileRank" integer,
	"trend" text,
	"userRating" integer,
	"userFeedback" text,
	"creditsUsed" integer DEFAULT 15 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "JobMockSession_conversationId_unique" UNIQUE("conversationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ApplicationActivity" (
	"id" text PRIMARY KEY NOT NULL,
	"applicationId" text NOT NULL,
	"userId" text NOT NULL,
	"activityType" "ApplicationActivityType" NOT NULL,
	"activityId" text,
	"metadata" jsonb,
	"score" integer,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobApplication" (
	"id" text PRIMARY KEY NOT NULL,
	"jobId" text NOT NULL,
	"userId" text NOT NULL,
	"status" "ApplicationStatus" DEFAULT 'INTERESTED' NOT NULL,
	"currentStage" integer,
	"preparationStatus" jsonb DEFAULT '{"profile_complete":false,"resume_reviewed":false,"mock_interview_done":false,"Learns_reviewed":false,"assignment_started":false,"assignment_completed":false}'::jsonb NOT NULL,
	"preparationScore" integer DEFAULT 0 NOT NULL,
	"isReadyToApply" boolean DEFAULT false NOT NULL,
	"assignmentProjectCloneId" text,
	"assignmentStartedAt" timestamp,
	"assignmentSubmittedAt" timestamp,
	"assignmentScore" integer,
	"assignmentFeedback" text,
	"interviewId" text,
	"interviewScheduledAt" timestamp,
	"interviewCompletedAt" timestamp,
	"interviewFeedback" jsonb,
	"reviewedById" text,
	"reviewedAt" timestamp,
	"rejectionReason" text,
	"hrNotes" text,
	"matchScore" integer,
	"coverLetter" text,
	"resumeUrl" text,
	"customQuestionResponses" jsonb DEFAULT '[]'::jsonb,
	"appliedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "JobRecommendation" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"jobId" text NOT NULL,
	"matchScore" integer NOT NULL,
	"matchReasons" jsonb,
	"isDismissed" boolean DEFAULT false NOT NULL,
	"isSaved" boolean DEFAULT false NOT NULL,
	"viewedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Job" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"postedById" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"requirements" jsonb,
	"responsibilities" jsonb,
	"benefits" jsonb,
	"location" text,
	"locationType" "JobLocationType" DEFAULT 'REMOTE' NOT NULL,
	"employmentType" "EmploymentType" DEFAULT 'FULL_TIME' NOT NULL,
	"experienceMin" integer,
	"experienceMax" integer,
	"salaryMin" integer,
	"salaryMax" integer,
	"salaryCurrency" text DEFAULT 'INR' NOT NULL,
	"salaryDisclosed" boolean DEFAULT true NOT NULL,
	"skillsRequired" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skillsPreferred" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hasAssignment" boolean DEFAULT false NOT NULL,
	"assignmentStudioId" text,
	"assignmentProjectId" text,
	"assignmentDeadlineDays" integer,
	"evaluationCriteria" jsonb,
	"assignmentDetails" jsonb,
	"assignmentInstructions" text,
	"customQuestions" jsonb DEFAULT '[]'::jsonb,
	"status" "JobStatus" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "JobVisibility" DEFAULT 'PUBLIC' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"viewsCount" integer DEFAULT 0 NOT NULL,
	"applicationsCount" integer DEFAULT 0 NOT NULL,
	"matchingCriteria" jsonb,
	"interviewProcessId" text,
	"expiresAt" timestamp,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Job_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SavedJob" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"jobId" text NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "BackgroundJob" (
	"id" text PRIMARY KEY NOT NULL,
	"jobId" text NOT NULL,
	"status" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"input" jsonb NOT NULL,
	"result" jsonb,
	"error" text,
	"userId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "BackgroundJob_jobId_unique" UNIQUE("jobId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CreditRequest" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"requestedCredits" integer NOT NULL,
	"linkedinPostUrl" text NOT NULL,
	"twitterPostUrl" text,
	"status" "CreditRequestStatus" DEFAULT 'PENDING' NOT NULL,
	"adminNotes" text,
	"processedAt" timestamp,
	"processedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CreditTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"currency" "Currency" NOT NULL,
	"amount" integer NOT NULL,
	"type" "CreditType" NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"paymentId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CreditTransferOut" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"userEmail" text NOT NULL,
	"creditsTransferred" integer NOT NULL,
	"destinationPlatform" text DEFAULT 'truefool' NOT NULL,
	"transferId" text NOT NULL,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CreditTransfer" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"receiverId" text NOT NULL,
	"amount" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"transferReference" text NOT NULL,
	CONSTRAINT "CreditTransfer_transferReference_unique" UNIQUE("transferReference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Earning" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"module" "Module" NOT NULL,
	"referenceId" text,
	"amount" integer NOT NULL,
	"sourceUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Payment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"credits" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" "Currency" DEFAULT 'INR' NOT NULL,
	"status" "PaymentStatus" DEFAULT 'PENDING' NOT NULL,
	"orderId" text,
	"paymentId" text,
	"razorpayOrderId" text,
	"signature" text,
	"receipt" text,
	"notes" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"completedAt" timestamp,
	CONSTRAINT "Payment_orderId_unique" UNIQUE("orderId"),
	CONSTRAINT "Payment_paymentId_unique" UNIQUE("paymentId"),
	CONSTRAINT "Payment_razorpayOrderId_unique" UNIQUE("razorpayOrderId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Referral" (
	"id" text PRIMARY KEY NOT NULL,
	"referrerId" text NOT NULL,
	"referredUserId" text NOT NULL,
	"referralCode" text NOT NULL,
	"pointsAwarded" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Referral_referredUserId_unique" UNIQUE("referredUserId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"creditTransactionId" text NOT NULL,
	"module" "Module" NOT NULL,
	"referenceId" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "SubTransaction_creditTransactionId_unique" UNIQUE("creditTransactionId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeApiRequest" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"apiKey" text NOT NULL,
	"endpoint" text NOT NULL,
	"method" text NOT NULL,
	"requestIp" text,
	"requestHeaders" jsonb,
	"requestBody" jsonb,
	"responseStatus" integer,
	"responseTimeMs" integer,
	"tokensUsed" integer,
	"costUsd" real,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeChatMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"retrievedChunks" jsonb,
	"modelUsed" text,
	"tokensUsed" integer,
	"responseTimeMs" integer,
	"confidence" real,
	"sources" jsonb,
	"wasHelpful" boolean,
	"feedback" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeChatSession" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"visitorUserId" text,
	"viewerType" "KnowMeViewerType" DEFAULT 'ANONYMOUS' NOT NULL,
	"visitorIp" text,
	"visitorUserAgent" text,
	"visitorCountry" text,
	"visitorCity" text,
	"visitorReferrer" text,
	"sessionToken" text NOT NULL,
	"questionsAsked" integer DEFAULT 0 NOT NULL,
	"messagesCount" integer DEFAULT 0 NOT NULL,
	"rateLimitRemaining" integer DEFAULT 20 NOT NULL,
	"rateLimitResetAt" timestamp DEFAULT now() NOT NULL,
	"source" text,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"lastActivityAt" timestamp DEFAULT now() NOT NULL,
	"endedAt" timestamp,
	CONSTRAINT "KnowMeChatSession_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeCreditTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"transactionType" text NOT NULL,
	"amount" integer NOT NULL,
	"reason" text,
	"balanceBefore" integer NOT NULL,
	"balanceAfter" integer NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeEmbeddingJob" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"jobType" "KnowMeJobType" NOT NULL,
	"status" "KnowMeJobStatus" DEFAULT 'QUEUED' NOT NULL,
	"priority" integer DEFAULT 5 NOT NULL,
	"scope" jsonb,
	"progress" integer DEFAULT 0 NOT NULL,
	"totalItems" integer DEFAULT 0 NOT NULL,
	"processedItems" integer DEFAULT 0 NOT NULL,
	"failedItems" integer DEFAULT 0 NOT NULL,
	"result" jsonb,
	"errorLogs" text[] DEFAULT '{}' NOT NULL,
	"scheduledFor" timestamp,
	"startedAt" timestamp,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"maxAttempts" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeEmbedding" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"sourceType" "KnowMeDataType" NOT NULL,
	"sourceId" text NOT NULL,
	"chunkIndex" integer DEFAULT 0 NOT NULL,
	"chunkText" text NOT NULL,
	"chunkHash" text,
	"vectorId" text NOT NULL,
	"vectorNamespace" text NOT NULL,
	"vectorScore" real,
	"embeddingModel" text DEFAULT 'text-embedding-3-small' NOT NULL,
	"embeddingVersion" integer DEFAULT 1 NOT NULL,
	"dimensions" integer DEFAULT 1024 NOT NULL,
	"metadata" jsonb,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeExternalData" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"connectionId" text,
	"dataType" "KnowMeDataType" NOT NULL,
	"externalId" text,
	"title" text,
	"description" text,
	"url" text,
	"techStack" text[] DEFAULT '{}' NOT NULL,
	"dateCreated" timestamp,
	"dateUpdated" timestamp,
	"metrics" jsonb,
	"rawData" jsonb,
	"isActive" boolean DEFAULT true NOT NULL,
	"isIndexed" boolean DEFAULT false NOT NULL,
	"isDuplicate" boolean DEFAULT false NOT NULL,
	"mergedWithCoderProjectId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMePersonalData" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"dataType" "KnowMeDataType" NOT NULL,
	"title" text,
	"fileName" text,
	"fileUrl" text,
	"fileSize" integer,
	"contentText" text,
	"contentHash" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"isIndexed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMePlatformConnection" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"platform" "KnowMePlatform" NOT NULL,
	"platformUsername" text,
	"platformUserId" text,
	"profileUrl" text,
	"connectionStatus" "KnowMeSyncStatus" DEFAULT 'PENDING' NOT NULL,
	"isConnected" boolean DEFAULT false NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"tokenExpiresAt" timestamp,
	"syncFrequencyDays" integer DEFAULT 10 NOT NULL,
	"lastSyncedAt" timestamp,
	"nextSyncAt" timestamp,
	"lastSyncError" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMePrivacySettings" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"allowAnonymous" boolean DEFAULT true NOT NULL,
	"allowRegisteredUsers" boolean DEFAULT true NOT NULL,
	"allowRecruiters" boolean DEFAULT true NOT NULL,
	"shareBasicInfo" boolean DEFAULT true NOT NULL,
	"shareProjects" boolean DEFAULT true NOT NULL,
	"shareAssessments" boolean DEFAULT true NOT NULL,
	"shareWorkHistory" boolean DEFAULT false NOT NULL,
	"shareEducation" boolean DEFAULT true NOT NULL,
	"shareSalary" boolean DEFAULT false NOT NULL,
	"shareExternalData" jsonb DEFAULT '{"github":true,"leetcode":true}'::jsonb NOT NULL,
	"maxQuestionsPerSession" integer DEFAULT 20 NOT NULL,
	"requireAuthForSensitive" boolean DEFAULT true NOT NULL,
	"blockedUserIds" text[] DEFAULT '{}' NOT NULL,
	"blockedCompanies" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "KnowMePrivacySettings_profileId_unique" UNIQUE("profileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeProfileView" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"viewerUserId" text,
	"viewerType" "KnowMeViewerType" DEFAULT 'ANONYMOUS' NOT NULL,
	"viewerIp" text,
	"sessionDurationSeconds" integer,
	"questionsAsked" integer DEFAULT 0 NOT NULL,
	"source" text,
	"referrer" text,
	"viewedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"status" "KnowMeStatus" DEFAULT 'INACTIVE' NOT NULL,
	"privacy" "KnowMePrivacy" DEFAULT 'PUBLIC' NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"includePersonalData" boolean DEFAULT true NOT NULL,
	"includePlatformData" boolean DEFAULT false NOT NULL,
	"includeProjects" boolean DEFAULT true NOT NULL,
	"includeAssessments" boolean DEFAULT true NOT NULL,
	"includeResume" boolean DEFAULT true NOT NULL,
	"updateCycleDays" integer DEFAULT 10 NOT NULL,
	"lastUpdatedAt" timestamp,
	"nextScheduledUpdate" timestamp,
	"totalEmbeddingsCount" integer DEFAULT 0 NOT NULL,
	"lastEmbeddingVersion" text,
	"apiKey" text,
	"apiKeyHash" text,
	"apiEnabled" boolean DEFAULT false NOT NULL,
	"apiRateLimit" integer DEFAULT 100 NOT NULL,
	"apiUsageToday" integer DEFAULT 0 NOT NULL,
	"apiUsageTotal" integer DEFAULT 0 NOT NULL,
	"apiLastResetAt" timestamp DEFAULT now() NOT NULL,
	"totalQuestionsAnswered" integer DEFAULT 0 NOT NULL,
	"totalSessions" integer DEFAULT 0 NOT NULL,
	"totalVisitors" integer DEFAULT 0 NOT NULL,
	"totalExternalRequests" integer DEFAULT 0 NOT NULL,
	"onboardingStep" integer DEFAULT 0 NOT NULL,
	"onboardingCompleted" boolean DEFAULT false NOT NULL,
	"onboardingStartedAt" timestamp DEFAULT now() NOT NULL,
	"aiPersonality" text,
	"welcomeMessage" text,
	"suggestedQuestions" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "KnowMeProfile_userId_unique" UNIQUE("userId"),
	CONSTRAINT "KnowMeProfile_apiKey_unique" UNIQUE("apiKey")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "KnowMeQuestionAnalytics" (
	"id" text PRIMARY KEY NOT NULL,
	"profileId" text NOT NULL,
	"question" text NOT NULL,
	"questionCategory" "KnowMeQuestionCategory" DEFAULT 'OTHER' NOT NULL,
	"questionKeywords" text[] DEFAULT '{}' NOT NULL,
	"askedByUserId" text,
	"askedByType" "KnowMeViewerType" DEFAULT 'ANONYMOUS' NOT NULL,
	"responseGenerated" boolean DEFAULT true NOT NULL,
	"responseTimeMs" integer,
	"responseTokens" integer,
	"wasHelpful" boolean,
	"source" text,
	"askedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MockInterviewVoice" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "MockCategory" DEFAULT 'TECHNICAL' NOT NULL,
	"level" "MockLevel" DEFAULT 'INTERMEDIATE' NOT NULL,
	"duration" integer DEFAULT 15 NOT NULL,
	"questionsCount" integer DEFAULT 5 NOT NULL,
	"isPublic" boolean DEFAULT true NOT NULL,
	"isPredefined" boolean DEFAULT false NOT NULL,
	"byAdmin" boolean DEFAULT false NOT NULL,
	"knowledgeBase" text NOT NULL,
	"createdById" text,
	"includesResume" boolean DEFAULT false NOT NULL,
	"isFeatured" boolean DEFAULT false NOT NULL,
	"baseCredits" integer DEFAULT 15 NOT NULL,
	"creditsRequired" integer DEFAULT 15 NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"totalSessions" integer DEFAULT 0 NOT NULL,
	"averageRating" real,
	"predefinedId" text,
	"isUniversityMock" boolean DEFAULT false NOT NULL,
	"universityId" text,
	"teacherMemberId" text,
	"classIds" text[] DEFAULT '{}' NOT NULL,
	"assignmentDeadline" timestamp,
	"assignmentCredits" integer,
	"assignmentInstructions" text,
	"pathfinderSubGoalId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "MockInterviewVoice_predefinedId_unique" UNIQUE("predefinedId"),
	CONSTRAINT "MockInterviewVoice_pathfinderSubGoalId_unique" UNIQUE("pathfinderSubGoalId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MockVoiceRating" (
	"id" text PRIMARY KEY NOT NULL,
	"mockId" text NOT NULL,
	"userId" text NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MockVoiceSession" (
	"id" text PRIMARY KEY NOT NULL,
	"mockId" text NOT NULL,
	"userId" text NOT NULL,
	"status" text DEFAULT 'SCHEDULED' NOT NULL,
	"conversationId" text,
	"agentId" text,
	"variables" jsonb NOT NULL,
	"scheduledFor" timestamp,
	"startedAt" timestamp,
	"completedAt" timestamp,
	"duration" integer,
	"recordingUrl" text,
	"transcriptUrl" text,
	"transcript" text,
	"aiAnalysis" jsonb,
	"userRating" integer,
	"userFeedback" text,
	"reviewedAt" timestamp,
	"hasIssues" boolean DEFAULT false NOT NULL,
	"reportedIssues" text[] DEFAULT '{}' NOT NULL,
	"issueDetails" text,
	"issueReportedAt" timestamp,
	"creditsUsed" integer NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "MockVoiceSession_conversationId_unique" UNIQUE("conversationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PracticeLeaderboard" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"module" "PracticeModule" NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"totalXP" integer DEFAULT 0 NOT NULL,
	"completed" integer DEFAULT 0 NOT NULL,
	"averageScore" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PracticeModuleProgress" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"module" "PracticeModule" NOT NULL,
	"totalProblems" integer DEFAULT 0 NOT NULL,
	"completed" integer DEFAULT 0 NOT NULL,
	"inProgress" integer DEFAULT 0 NOT NULL,
	"totalXP" integer DEFAULT 0 NOT NULL,
	"currentStreak" integer DEFAULT 0 NOT NULL,
	"longestStreak" integer DEFAULT 0 NOT NULL,
	"lastPracticedAt" timestamp,
	"easyCompleted" integer DEFAULT 0 NOT NULL,
	"mediumCompleted" integer DEFAULT 0 NOT NULL,
	"hardCompleted" integer DEFAULT 0 NOT NULL,
	"averageScore" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PracticeProblem" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"module" "PracticeModule" NOT NULL,
	"category" text NOT NULL,
	"difficulty" "PracticeDifficulty" NOT NULL,
	"requirements" text[] DEFAULT '{}' NOT NULL,
	"hints" text[] DEFAULT '{}' NOT NULL,
	"starterCode" text,
	"starterCss" text,
	"testCases" jsonb,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "PracticeProblem_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PracticeUserSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"problemId" text NOT NULL,
	"module" "PracticeModule" NOT NULL,
	"mode" "PracticeMode" NOT NULL,
	"status" "PracticeSessionStatus" DEFAULT 'IN_PROGRESS' NOT NULL,
	"code" text,
	"cssCode" text,
	"canvasData" jsonb,
	"language" text DEFAULT 'javascript',
	"attempts" integer DEFAULT 0 NOT NULL,
	"bestScore" integer DEFAULT 0 NOT NULL,
	"lastFeedback" text,
	"requirementsMet" jsonb,
	"totalTimeSeconds" integer DEFAULT 0 NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"voiceUsed" boolean DEFAULT false NOT NULL,
	"chatHistory" jsonb,
	"xpAwarded" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AssessmentCertificate" (
	"id" text PRIMARY KEY NOT NULL,
	"certificateId" text NOT NULL,
	"userId" text NOT NULL,
	"topicName" text NOT NULL,
	"language" "AssessmentLanguage" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"mode" "AssessmentMode" NOT NULL,
	"score" real NOT NULL,
	"passingScore" real NOT NULL,
	"issuedAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp,
	"isActive" boolean DEFAULT true NOT NULL,
	"verificationUrl" text,
	CONSTRAINT "AssessmentCertificate_certificateId_unique" UNIQUE("certificateId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AssessmentQuestion" (
	"id" text PRIMARY KEY NOT NULL,
	"topicId" text NOT NULL,
	"subModuleId" text,
	"type" "AssessmentQuestionType" NOT NULL,
	"mode" "AssessmentMode" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"question" text NOT NULL,
	"questionHtml" text,
	"codeSnippet" text,
	"codeLanguage" text,
	"options" jsonb,
	"correctAnswer" text,
	"answerExplanation" text,
	"testCases" jsonb,
	"starterCode" text,
	"solutionCode" text,
	"hints" jsonb,
	"points" integer DEFAULT 10 NOT NULL,
	"timeLimit" integer,
	"isSeeded" boolean DEFAULT true NOT NULL,
	"aiGenerated" boolean DEFAULT false NOT NULL,
	"generatedFor" text,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"correctAttempts" integer DEFAULT 0 NOT NULL,
	"avgTimeSpent" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AssessmentSubModule" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"topicId" text NOT NULL,
	"totalQuestions" integer DEFAULT 0 NOT NULL,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"avgScore" real DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AssessmentTopic" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"color" text,
	"language" "AssessmentLanguage" NOT NULL,
	"totalQuestions" integer DEFAULT 0 NOT NULL,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"avgScore" real DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "AssessmentTopic_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ExamAnswer" (
	"id" text PRIMARY KEY NOT NULL,
	"attemptId" text NOT NULL,
	"questionId" text NOT NULL,
	"selectedOption" text,
	"selectedOptions" jsonb,
	"codeAnswer" text,
	"textAnswer" text,
	"isCorrect" boolean,
	"partialScore" real,
	"pointsEarned" integer DEFAULT 0 NOT NULL,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"aiEvaluation" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ExamAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"topicId" text NOT NULL,
	"mode" "AssessmentMode" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"totalQuestions" integer NOT NULL,
	"timeLimit" integer NOT NULL,
	"passingScore" real DEFAULT 70 NOT NULL,
	"answeredCount" integer DEFAULT 0 NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"score" real,
	"passed" boolean,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"tabSwitchCount" integer DEFAULT 0 NOT NULL,
	"warnings" jsonb,
	"certificateId" text,
	"certificateUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ExamAttempt_certificateId_unique" UNIQUE("certificateId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PracticeAnswer" (
	"id" text PRIMARY KEY NOT NULL,
	"attemptId" text NOT NULL,
	"questionId" text NOT NULL,
	"selectedOption" text,
	"selectedOptions" jsonb,
	"codeAnswer" text,
	"textAnswer" text,
	"isCorrect" boolean NOT NULL,
	"partialScore" real,
	"pointsEarned" integer DEFAULT 0 NOT NULL,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"aiFeedback" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PracticeAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"topicId" text NOT NULL,
	"subModuleId" text,
	"mode" "AssessmentMode" NOT NULL,
	"difficulty" "QuestionDifficulty",
	"totalQuestions" integer NOT NULL,
	"answeredCount" integer DEFAULT 0 NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RandomPracticeSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"language" "AssessmentLanguage",
	"mode" "AssessmentMode",
	"difficulty" "QuestionDifficulty",
	"questionCount" integer DEFAULT 10 NOT NULL,
	"creditsCost" integer DEFAULT 3 NOT NULL,
	"creditsEarned" integer DEFAULT 0 NOT NULL,
	"totalQuestions" integer NOT NULL,
	"answeredCount" integer DEFAULT 0 NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"questionRefs" jsonb NOT NULL,
	"answers" jsonb,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserAssessmentStats" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"totalPracticeAttempts" integer DEFAULT 0 NOT NULL,
	"practiceQuestionsAnswered" integer DEFAULT 0 NOT NULL,
	"practiceCorrectAnswers" integer DEFAULT 0 NOT NULL,
	"avgPracticeScore" real DEFAULT 0 NOT NULL,
	"totalPracticeTime" integer DEFAULT 0 NOT NULL,
	"totalExamAttempts" integer DEFAULT 0 NOT NULL,
	"examsPassed" integer DEFAULT 0 NOT NULL,
	"examsFailed" integer DEFAULT 0 NOT NULL,
	"avgExamScore" real DEFAULT 0 NOT NULL,
	"certificates" integer DEFAULT 0 NOT NULL,
	"streakDays" integer DEFAULT 0 NOT NULL,
	"longestStreak" integer DEFAULT 0 NOT NULL,
	"lastActivityAt" timestamp,
	"topicProgress" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserAssessmentStats_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserExamSetAnswer" (
	"id" text PRIMARY KEY NOT NULL,
	"attemptId" text NOT NULL,
	"questionId" text NOT NULL,
	"selectedOption" text,
	"selectedOptions" jsonb,
	"codeAnswer" text,
	"textAnswer" text,
	"voiceTranscript" text,
	"isCorrect" boolean,
	"partialScore" real,
	"pointsEarned" integer DEFAULT 0 NOT NULL,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"aiFeedback" text,
	"aiEvaluation" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserExamSetAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"examSetId" text NOT NULL,
	"mode" "AssessmentMode" NOT NULL,
	"totalQuestions" integer NOT NULL,
	"answeredCount" integer DEFAULT 0 NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"score" real,
	"passed" boolean,
	"creditsSpent" integer DEFAULT 0 NOT NULL,
	"creditsEarned" integer DEFAULT 0 NOT NULL,
	"timeLimit" integer NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"tabSwitchCount" integer DEFAULT 0 NOT NULL,
	"warnings" jsonb,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"certificateId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserExamSetAttempt_certificateId_unique" UNIQUE("certificateId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserExamSetLike" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"examSetId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserExamSetPurchase" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"examSetId" text NOT NULL,
	"attachedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserExamSetQuestion" (
	"id" text PRIMARY KEY NOT NULL,
	"examSetId" text NOT NULL,
	"type" "AssessmentQuestionType" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"question" text NOT NULL,
	"codeSnippet" text,
	"codeLanguage" text,
	"options" jsonb,
	"correctAnswer" text,
	"answerExplanation" text,
	"testCases" jsonb,
	"starterCode" text,
	"solutionCode" text,
	"mockPrompt" text,
	"expectedTopics" jsonb,
	"hints" jsonb,
	"points" integer DEFAULT 10 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserExamSet" (
	"id" text PRIMARY KEY NOT NULL,
	"creatorId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"language" "AssessmentLanguage" NOT NULL,
	"topicId" text,
	"mode" "AssessmentMode" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"questionCount" integer DEFAULT 20 NOT NULL,
	"timeLimit" integer DEFAULT 1800 NOT NULL,
	"passingScore" real DEFAULT 70 NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"madePublicAt" timestamp,
	"creditsCost" integer DEFAULT 10 NOT NULL,
	"creditsRefunded" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"avgScore" real DEFAULT 0 NOT NULL,
	"passCount" integer DEFAULT 0 NOT NULL,
	"failCount" integer DEFAULT 0 NOT NULL,
	"status" "UserContentStatus" DEFAULT 'GENERATING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserExamSet_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserPracticeSetAnswer" (
	"id" text PRIMARY KEY NOT NULL,
	"attemptId" text NOT NULL,
	"questionId" text NOT NULL,
	"selectedOption" text,
	"selectedOptions" jsonb,
	"codeAnswer" text,
	"textAnswer" text,
	"voiceTranscript" text,
	"isCorrect" boolean,
	"partialScore" real,
	"pointsEarned" integer DEFAULT 0 NOT NULL,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"aiFeedback" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserPracticeSetAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"practiceSetId" text NOT NULL,
	"mode" "AssessmentMode" NOT NULL,
	"totalQuestions" integer NOT NULL,
	"answeredCount" integer DEFAULT 0 NOT NULL,
	"correctCount" integer DEFAULT 0 NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"creditsSpent" integer DEFAULT 0 NOT NULL,
	"creditsEarned" integer DEFAULT 0 NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserPracticeSetLike" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"practiceSetId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserPracticeSetPurchase" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"practiceSetId" text NOT NULL,
	"attachedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserPracticeSetQuestion" (
	"id" text PRIMARY KEY NOT NULL,
	"practiceSetId" text NOT NULL,
	"type" "AssessmentQuestionType" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"question" text NOT NULL,
	"codeSnippet" text,
	"codeLanguage" text,
	"options" jsonb,
	"correctAnswer" text,
	"answerExplanation" text,
	"testCases" jsonb,
	"starterCode" text,
	"solutionCode" text,
	"mockPrompt" text,
	"expectedTopics" jsonb,
	"hints" jsonb,
	"points" integer DEFAULT 10 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserPracticeSet" (
	"id" text PRIMARY KEY NOT NULL,
	"creatorId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"language" "AssessmentLanguage" NOT NULL,
	"topicId" text,
	"subModuleId" text,
	"mode" "AssessmentMode" NOT NULL,
	"difficulty" "QuestionDifficulty" NOT NULL,
	"questionCount" integer DEFAULT 10 NOT NULL,
	"timeLimit" integer,
	"isPublic" boolean DEFAULT false NOT NULL,
	"madePublicAt" timestamp,
	"creditsCost" integer DEFAULT 5 NOT NULL,
	"creditsRefunded" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"avgScore" real DEFAULT 0 NOT NULL,
	"completions" integer DEFAULT 0 NOT NULL,
	"status" "UserContentStatus" DEFAULT 'GENERATING' NOT NULL,
	"isUniversityAssessment" boolean DEFAULT false NOT NULL,
	"universityId" text,
	"teacherMemberId" text,
	"classIds" text[] DEFAULT '{}' NOT NULL,
	"assignmentDeadline" timestamp,
	"assignmentCredits" integer,
	"assignmentInstructions" text,
	"isLiveSession" boolean DEFAULT false NOT NULL,
	"liveSessionStartedAt" timestamp,
	"liveSessionEndedAt" timestamp,
	"liveSessionActive" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserPracticeSet_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectCategory" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ProjectCategory_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectIdeaUpvote" (
	"id" text PRIMARY KEY NOT NULL,
	"projectIdeaId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectIdea" (
	"id" text PRIMARY KEY NOT NULL,
	"projectTitle" text NOT NULL,
	"projectDescription" text NOT NULL,
	"generationType" text NOT NULL,
	"difficulty" text NOT NULL,
	"primaryLanguageOrFramework" text,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"categories" text[] DEFAULT '{}' NOT NULL,
	"technology" text,
	"ideaType" "IdeaType" DEFAULT 'TECHNOLOGY_SPECIFIC' NOT NULL,
	"overview" text,
	"coreRequirements" text[] DEFAULT '{}' NOT NULL,
	"engineeringConstraints" text[] DEFAULT '{}' NOT NULL,
	"suggestedStacks" jsonb,
	"recruiterSignal" text,
	"isPlatformCurated" boolean DEFAULT false NOT NULL,
	"curatedQuality" text,
	"buildCount" integer DEFAULT 0 NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"figmaLinks" text[] DEFAULT '{}' NOT NULL,
	"resourceLinks" text[] DEFAULT '{}' NOT NULL,
	"stacks" jsonb,
	"blueprintProjectId" text,
	"hasBlueprintGenerated" boolean DEFAULT false NOT NULL,
	"blueprintGeneratedAt" timestamp,
	"status" "ProjectIdeaStatus" DEFAULT 'PENDING' NOT NULL,
	"submittedById" text,
	"isUserSubmitted" boolean DEFAULT false NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"approvedAt" timestamp,
	CONSTRAINT "ProjectIdea_blueprintProjectId_unique" UNIQUE("blueprintProjectId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectTechnology" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"learningOutcomes" text[] DEFAULT '{}' NOT NULL,
	"projectCount" integer DEFAULT 0 NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"categoryId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ProjectTechnology_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2ErrorVote" (
	"id" text PRIMARY KEY NOT NULL,
	"errorId" text NOT NULL,
	"userId" text NOT NULL,
	"voteType" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Error" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"solution" text NOT NULL,
	"severity" "ProjectErrorSeverity" DEFAULT 'MEDIUM' NOT NULL,
	"category" "ProjectErrorCategory" DEFAULT 'OTHER' NOT NULL,
	"taskId" text,
	"errorCode" text,
	"fixedCode" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"status" "ProjectErrorStatus" DEFAULT 'PENDING' NOT NULL,
	"submittedById" text NOT NULL,
	"isAIGenerated" boolean DEFAULT false NOT NULL,
	"helpfulCount" integer DEFAULT 0 NOT NULL,
	"encounteredCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"approvedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2FeatureSuggestion" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "FeatureSuggestionType" DEFAULT 'FEATURE' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"imageUrl" text,
	"status" "FeatureSuggestionStatus" DEFAULT 'PENDING' NOT NULL,
	"suggestedBy" "SuggestionSource" DEFAULT 'VISITOR' NOT NULL,
	"addedByUsers" text[] DEFAULT '{}' NOT NULL,
	"addedToTasks" boolean DEFAULT false NOT NULL,
	"taskId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2GlobalLeaderboard" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"rank" integer NOT NULL,
	"totalScore" real DEFAULT 0 NOT NULL,
	"projectsStarted" integer DEFAULT 0 NOT NULL,
	"projectsCompleted" integer DEFAULT 0 NOT NULL,
	"averageScore" real DEFAULT 0 NOT NULL,
	"totalTasksCompleted" integer DEFAULT 0 NOT NULL,
	"totalQuizzesCompleted" integer DEFAULT 0 NOT NULL,
	"totalMocksCompleted" integer DEFAULT 0 NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProjectV2GlobalLeaderboard_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2GuidedSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"currentSprintIndex" integer DEFAULT 0 NOT NULL,
	"currentTaskIndex" integer DEFAULT 0 NOT NULL,
	"currentStepIndex" integer DEFAULT 0 NOT NULL,
	"conversationHistory" jsonb,
	"isActive" boolean DEFAULT true NOT NULL,
	"mode" text DEFAULT 'GUIDED' NOT NULL,
	"systemContext" text,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"invitedUserId" text,
	"invitedEmail" text,
	"invitedById" text NOT NULL,
	"role" "ProjectV2MemberRole" DEFAULT 'MEMBER' NOT NULL,
	"status" "ProjectV2InvitationStatus" DEFAULT 'PENDING' NOT NULL,
	"inviteToken" text,
	"expiresAt" timestamp,
	"respondedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProjectV2Invitation_inviteToken_unique" UNIQUE("inviteToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2KnowledgeBase" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"points" text[] DEFAULT '{}' NOT NULL,
	"mockKnowledgeBase" text,
	"mockQuestionsData" jsonb,
	"mockGeneratedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ProjectV2KnowledgeBase_projectId_unique" UNIQUE("projectId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Leaderboard" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"rank" integer NOT NULL,
	"score" real NOT NULL,
	"tasksCompleted" integer DEFAULT 0 NOT NULL,
	"totalTasks" integer DEFAULT 0 NOT NULL,
	"progressPercent" real DEFAULT 0 NOT NULL,
	"tasksScore" real DEFAULT 0 NOT NULL,
	"quizScore" real DEFAULT 0 NOT NULL,
	"mockScore" real DEFAULT 0 NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Member" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"userId" text NOT NULL,
	"role" "ProjectV2MemberRole" DEFAULT 'MEMBER' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"invitedBy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2MockSession" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"sessionType" "MockSessionType" DEFAULT 'PROJECT_FINAL' NOT NULL,
	"sprintId" text,
	"agentId" text,
	"conversationId" text,
	"duration" integer,
	"score" integer,
	"technicalScore" integer,
	"communicationScore" integer,
	"LearnualScore" integer,
	"transcript" text,
	"feedback" text,
	"strengths" text[] DEFAULT '{}' NOT NULL,
	"improvements" text[] DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'SCHEDULED' NOT NULL,
	"scheduledAt" timestamp,
	"startedAt" timestamp,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Page" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"name" text NOT NULL,
	"difficulty" "ProjectV2Difficulty" NOT NULL,
	"coreFeatures" text[] DEFAULT '{}' NOT NULL,
	"recommendedComponents" text[] DEFAULT '{}' NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"route" text,
	"purpose" text,
	"estimatedTime" text,
	"layout" jsonb,
	"components" jsonb,
	"userInteractions" text[] DEFAULT '{}' NOT NULL,
	"dataNeeded" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2QuizAnswer" (
	"id" text PRIMARY KEY NOT NULL,
	"attemptId" text NOT NULL,
	"questionId" text NOT NULL,
	"selectedAnswer" integer NOT NULL,
	"isCorrect" boolean DEFAULT false NOT NULL,
	"timeSpent" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2QuizAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"quizId" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"totalQuestions" integer DEFAULT 0 NOT NULL,
	"correctAnswers" integer DEFAULT 0 NOT NULL,
	"timeSpent" integer,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2QuizQuestion" (
	"id" text PRIMARY KEY NOT NULL,
	"quizId" text NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"difficulty" "QuizV2Difficulty" NOT NULL,
	"prompt" text NOT NULL,
	"options" text[] DEFAULT '{}' NOT NULL,
	"correctAnswer" integer NOT NULL,
	"explanation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Quiz" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"totalQuestions" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ProjectV2Quiz_projectId_unique" UNIQUE("projectId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Resource" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"link" text NOT NULL,
	"type" "ResourceType" NOT NULL,
	"description" text,
	"helpfulCount" integer DEFAULT 0 NOT NULL,
	"markedHelpfulBy" text[] DEFAULT '{}' NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"isOfficial" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2SprintSuggestion" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"suggestedById" text NOT NULL,
	"sprintNumber" integer NOT NULL,
	"name" text NOT NULL,
	"goal" text NOT NULL,
	"duration" text NOT NULL,
	"suggestedTasks" jsonb,
	"status" "SprintSuggestionStatus" DEFAULT 'PENDING' NOT NULL,
	"reviewedById" text,
	"reviewedAt" timestamp,
	"reviewNote" text,
	"createdSprintId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Sprint" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"sprintNumber" integer NOT NULL,
	"name" text NOT NULL,
	"goal" text NOT NULL,
	"duration" text NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdBy" text,
	"isApproved" boolean DEFAULT true NOT NULL,
	"isPersonal" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2StandupConfig" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"daysPerWeek" integer NOT NULL,
	"standupTime" text NOT NULL,
	"durationMinutes" integer DEFAULT 10 NOT NULL,
	"selectedDays" integer[] DEFAULT '{}' NOT NULL,
	"creditsPerDay" integer DEFAULT 5 NOT NULL,
	"weeklyCredits" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"currentWeekStart" timestamp DEFAULT now() NOT NULL,
	"currentWeekEnd" timestamp NOT NULL,
	"totalStandups" integer DEFAULT 0 NOT NULL,
	"completedStandups" integer DEFAULT 0 NOT NULL,
	"missedStandups" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2StandupEntry" (
	"id" text PRIMARY KEY NOT NULL,
	"configId" text NOT NULL,
	"scheduledFor" timestamp NOT NULL,
	"submittedAt" timestamp,
	"whatDidYesterday" text,
	"whatDoingToday" text,
	"anyBlockers" text,
	"recordingUrl" text,
	"durationSeconds" integer,
	"status" text DEFAULT 'SCHEDULED' NOT NULL,
	"aiSummary" text,
	"aiSuggestions" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Submission" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"githubUrl" text NOT NULL,
	"liveUrl" text,
	"notes" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"scores" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2TaskDetail" (
	"id" text PRIMARY KEY NOT NULL,
	"taskId" text NOT NULL,
	"subTasks" jsonb NOT NULL,
	"commonErrors" text[] DEFAULT '{}' NOT NULL,
	"errorsToWatchout" text[] DEFAULT '{}' NOT NULL,
	"relatedTasks" jsonb NOT NULL,
	"generatedBy" text NOT NULL,
	"generatedAt" timestamp DEFAULT now() NOT NULL,
	"generationCost" integer DEFAULT 1 NOT NULL,
	"accessCount" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ProjectV2TaskDetail_taskId_unique" UNIQUE("taskId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2Task" (
	"id" text PRIMARY KEY NOT NULL,
	"sprintId" text NOT NULL,
	"title" text NOT NULL,
	"description" text[] DEFAULT '{}' NOT NULL,
	"criteria" text[] DEFAULT '{}' NOT NULL,
	"hints" text[] DEFAULT '{}' NOT NULL,
	"badges" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"difficulty" "ProjectV2Difficulty" NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"terminalCommand" text,
	"category" text,
	"estimatedTime" text,
	"checkpoints" text[] DEFAULT '{}' NOT NULL,
	"relatedPages" text[] DEFAULT '{}' NOT NULL,
	"dependencies" text[] DEFAULT '{}' NOT NULL,
	"learningObjectives" text[] DEFAULT '{}' NOT NULL,
	"prerequisites" text[] DEFAULT '{}' NOT NULL,
	"resources" jsonb,
	"testingGuidelines" text[] DEFAULT '{}' NOT NULL,
	"Learns" jsonb,
	"assessmentType" "TaskAssessmentType" DEFAULT 'QUIZ' NOT NULL,
	"projectV2Id" text,
	"createdBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectV2" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"shortDescription" varchar(200),
	"description" text NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"generationType" text NOT NULL,
	"primaryLanguageOrFramework" text,
	"difficulty" "ProjectV2Difficulty" NOT NULL,
	"visibility" "ProjectV2Visibility" DEFAULT 'PRIVATE' NOT NULL,
	"estimatedHours" integer DEFAULT 20 NOT NULL,
	"includeAssessment" boolean DEFAULT false NOT NULL,
	"isPlatformSeeded" boolean DEFAULT false NOT NULL,
	"projectSource" text DEFAULT 'AI_GENERATED' NOT NULL,
	"guidedModeEnabled" boolean DEFAULT true NOT NULL,
	"blueprintOverview" text NOT NULL,
	"vision" text,
	"targetAudience" text,
	"problemSolution" text,
	"estimatedDuration" text,
	"keyOutcomes" text[] DEFAULT '{}' NOT NULL,
	"recruiterSignal" text,
	"features" jsonb,
	"technicalRequirements" jsonb,
	"dataArchitecture" jsonb,
	"projectStructure" jsonb,
	"setupGuide" jsonb,
	"stacks" jsonb NOT NULL,
	"assistantEcho" jsonb NOT NULL,
	"assistantRaw" jsonb NOT NULL,
	"totalStarted" integer DEFAULT 0 NOT NULL,
	"totalCompleted" integer DEFAULT 0 NOT NULL,
	"totalSubmissions" integer DEFAULT 0 NOT NULL,
	"totalViews" integer DEFAULT 0 NOT NULL,
	"createdBy" text NOT NULL,
	"isUniversityProject" boolean DEFAULT false NOT NULL,
	"universityId" text,
	"teacherMemberId" text,
	"classIds" text[] DEFAULT '{}' NOT NULL,
	"assignmentDeadline" timestamp,
	"assignmentCredits" integer,
	"assignmentInstructions" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "ProjectV2_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserProjectV2Progress" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"status" "UserProjectV2Status" DEFAULT 'NOT_STARTED' NOT NULL,
	"tasksCompleted" integer DEFAULT 0 NOT NULL,
	"totalTasks" integer DEFAULT 0 NOT NULL,
	"progressPercentage" real DEFAULT 0 NOT NULL,
	"totalScore" real DEFAULT 0 NOT NULL,
	"tasksScore" real DEFAULT 0 NOT NULL,
	"quizScore" real DEFAULT 0 NOT NULL,
	"mockScore" real DEFAULT 0 NOT NULL,
	"startedAt" timestamp,
	"submittedAt" timestamp,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserTaskV2Assessment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"taskId" text NOT NULL,
	"assessmentType" "TaskAssessmentType" NOT NULL,
	"quizQuestions" jsonb,
	"quizAnswers" jsonb,
	"quizScore" integer,
	"correctAnswers" integer DEFAULT 0 NOT NULL,
	"totalQuestions" integer DEFAULT 0 NOT NULL,
	"codeSubmission" text,
	"codeLanguage" text,
	"codeValidation" jsonb,
	"codeScore" integer,
	"passed" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"timeSpent" integer,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserTaskV2DetailAccess" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"taskDetailId" text NOT NULL,
	"creditsPaid" integer DEFAULT 1 NOT NULL,
	"accessedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserTaskV2Status" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"taskId" text NOT NULL,
	"progressId" text NOT NULL,
	"status" "TaskKanbanStatus" DEFAULT 'TO_DO' NOT NULL,
	"completedAt" timestamp,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OpenSourceProject" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"longDescription" text,
	"githubRepoUrl" text NOT NULL,
	"githubOwner" text NOT NULL,
	"githubRepo" text NOT NULL,
	"defaultBranch" text DEFAULT 'main' NOT NULL,
	"type" "OSProjectType" DEFAULT 'FREE' NOT NULL,
	"category" "OSProjectCategory" DEFAULT 'WEB_DEVELOPMENT' NOT NULL,
	"status" "OSProjectStatus" DEFAULT 'DRAFT' NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"difficulty" "OSIssueDifficulty" DEFAULT 'MEDIUM' NOT NULL,
	"learningGoals" text[] DEFAULT '{}' NOT NULL,
	"prerequisites" text[] DEFAULT '{}' NOT NULL,
	"estimatedHours" integer,
	"totalBudget" real DEFAULT 0 NOT NULL,
	"remainingBudget" real DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"companyName" text,
	"companyLogo" text,
	"companyUrl" text,
	"totalIssues" integer DEFAULT 0 NOT NULL,
	"openIssues" integer DEFAULT 0 NOT NULL,
	"closedIssues" integer DEFAULT 0 NOT NULL,
	"totalContributors" integer DEFAULT 0 NOT NULL,
	"totalPRsMerged" integer DEFAULT 0 NOT NULL,
	"totalPRsOpen" integer DEFAULT 0 NOT NULL,
	"totalCommits" integer DEFAULT 0 NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"forks" integer DEFAULT 0 NOT NULL,
	"watchers" integer DEFAULT 0 NOT NULL,
	"lastSyncedAt" timestamp,
	"syncError" text,
	"requiresCertification" boolean DEFAULT true NOT NULL,
	"maxActiveIssues" integer DEFAULT 2 NOT NULL,
	"prDeadlineHours" integer DEFAULT 48 NOT NULL,
	"maxContributionsPerUser" integer DEFAULT 0 NOT NULL,
	"readmeContent" text,
	"contributingGuide" text,
	"coverImage" text,
	"bannerImage" text,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"isFeatured" boolean DEFAULT false NOT NULL,
	"maintainerId" text,
	"createdById" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "OpenSourceProject_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSCertificationExam" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"status" "OSCertificationStatus" DEFAULT 'NOT_STARTED' NOT NULL,
	"quizScore" integer,
	"codeScore" integer,
	"scenarioScore" integer,
	"totalScore" integer,
	"passingScore" integer DEFAULT 75 NOT NULL,
	"quizQuestions" jsonb,
	"codeExercises" jsonb,
	"scenarioQuestions" jsonb,
	"quizAnswers" jsonb,
	"codeAnswers" jsonb,
	"scenarioAnswers" jsonb,
	"startedAt" timestamp,
	"completedAt" timestamp,
	"timeLimit" integer DEFAULT 60 NOT NULL,
	"attemptNumber" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSCertification" (
	"id" text PRIMARY KEY NOT NULL,
	"certificateId" text NOT NULL,
	"userId" text NOT NULL,
	"title" text DEFAULT 'Open Source Contributor Certification' NOT NULL,
	"score" integer NOT NULL,
	"issuedAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"verificationUrl" text,
	"qrCode" text,
	CONSTRAINT "OSCertification_certificateId_unique" UNIQUE("certificateId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSContribution" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"issueId" text,
	"userId" text NOT NULL,
	"type" "OSContributionType" NOT NULL,
	"status" "OSContributionStatus" DEFAULT 'PENDING' NOT NULL,
	"githubPrNumber" integer,
	"githubPrUrl" text,
	"githubPrId" text,
	"githubCommitSha" text,
	"githubBranch" text,
	"forkRepoUrl" text,
	"forkOwner" text,
	"title" text,
	"description" text,
	"reviewScore" integer,
	"reviewFeedback" text,
	"reviewCycles" integer DEFAULT 0 NOT NULL,
	"reviewedById" text,
	"reviewedAt" timestamp,
	"xpEarned" integer DEFAULT 0 NOT NULL,
	"bountyEarned" real DEFAULT 0 NOT NULL,
	"linesAdded" integer DEFAULT 0 NOT NULL,
	"linesRemoved" integer DEFAULT 0 NOT NULL,
	"filesChanged" integer DEFAULT 0 NOT NULL,
	"commitsCount" integer DEFAULT 0 NOT NULL,
	"testsPassing" boolean DEFAULT true NOT NULL,
	"isMerged" boolean DEFAULT false NOT NULL,
	"mergedAt" timestamp,
	"mergedBy" text,
	"closedAt" timestamp,
	"checksStatus" text,
	"checksDetails" jsonb,
	"lastSyncedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSEarningsTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"projectId" text,
	"issueId" text,
	"contributionId" text,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"payoutMethod" text,
	"payoutDetails" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSGitHubProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"githubId" text NOT NULL,
	"githubUsername" text NOT NULL,
	"githubName" text,
	"githubAvatar" text,
	"githubBio" text,
	"githubLocation" text,
	"githubCompany" text,
	"githubBlog" text,
	"publicRepos" integer DEFAULT 0 NOT NULL,
	"publicGists" integer DEFAULT 0 NOT NULL,
	"followers" integer DEFAULT 0 NOT NULL,
	"following" integer DEFAULT 0 NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"tokenExpiresAt" timestamp,
	"scopes" text[] DEFAULT '{}' NOT NULL,
	"lastSyncedAt" timestamp,
	"syncError" text,
	"showOnProfile" boolean DEFAULT true NOT NULL,
	"autoSync" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "OSGitHubProfile_userId_unique" UNIQUE("userId"),
	CONSTRAINT "OSGitHubProfile_githubId_unique" UNIQUE("githubId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSIssue" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"githubIssueNumber" integer,
	"githubIssueUrl" text,
	"githubIssueId" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text[] DEFAULT '{}' NOT NULL,
	"acceptanceCriteria" text[] DEFAULT '{}' NOT NULL,
	"hints" text[] DEFAULT '{}' NOT NULL,
	"learningGoals" text[] DEFAULT '{}' NOT NULL,
	"filesToModify" text[] DEFAULT '{}' NOT NULL,
	"relatedDocs" text[] DEFAULT '{}' NOT NULL,
	"status" "OSIssueStatus" DEFAULT 'OPEN' NOT NULL,
	"difficulty" "OSIssueDifficulty" DEFAULT 'EASY' NOT NULL,
	"labels" text[] DEFAULT '{}' NOT NULL,
	"estimatedHours" integer DEFAULT 4 NOT NULL,
	"bountyAmount" real DEFAULT 0 NOT NULL,
	"bountyPaid" boolean DEFAULT false NOT NULL,
	"assignedToId" text,
	"assignedAt" timestamp,
	"deadlineAt" timestamp,
	"prNumber" integer,
	"prUrl" text,
	"prStatus" text,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"lastSyncedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnLesson" (
	"id" text PRIMARY KEY NOT NULL,
	"moduleId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "OSLearnModuleType" DEFAULT 'READING' NOT NULL,
	"content" text,
	"videoUrl" text,
	"interactiveData" jsonb,
	"codeLab" jsonb,
	"terminalLab" jsonb,
	"quizQuestions" jsonb,
	"passingScore" integer DEFAULT 70 NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"estimatedMinutes" integer DEFAULT 10 NOT NULL,
	"isRequired" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnModule" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text,
	"coverImage" text,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"isRequired" boolean DEFAULT true NOT NULL,
	"estimatedMinutes" integer DEFAULT 30 NOT NULL,
	"totalEnrolled" integer DEFAULT 0 NOT NULL,
	"totalCompleted" integer DEFAULT 0 NOT NULL,
	"averageScore" real DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "OSLearnModule_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnPracticeCompletion" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text NOT NULL,
	"tasksCompleted" integer DEFAULT 0 NOT NULL,
	"totalTasks" integer DEFAULT 0 NOT NULL,
	"progressPercent" real DEFAULT 0 NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"completedAt" timestamp,
	"totalXpEarned" integer DEFAULT 0 NOT NULL,
	"totalAttempts" integer DEFAULT 0 NOT NULL,
	"averageScore" real DEFAULT 0 NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnPracticeProject" (
	"id" text PRIMARY KEY NOT NULL,
	"moduleId" text,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"techStack" text[] DEFAULT '{}' NOT NULL,
	"category" "OSProjectCategory" DEFAULT 'WEB_DEVELOPMENT' NOT NULL,
	"difficulty" "OSIssueDifficulty" DEFAULT 'EASY' NOT NULL,
	"starterFiles" jsonb NOT NULL,
	"solutionFiles" jsonb,
	"learningGoals" text[] DEFAULT '{}' NOT NULL,
	"prerequisites" text[] DEFAULT '{}' NOT NULL,
	"estimatedHours" integer DEFAULT 2 NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "OSLearnPracticeProject_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnPracticeSubmission" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"taskId" text NOT NULL,
	"submittedCode" jsonb NOT NULL,
	"isCorrect" boolean DEFAULT false NOT NULL,
	"score" integer,
	"feedback" text,
	"aiReview" jsonb,
	"attemptNumber" integer DEFAULT 1 NOT NULL,
	"xpEarned" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnPracticeTask" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text[] DEFAULT '{}' NOT NULL,
	"hints" text[] DEFAULT '{}' NOT NULL,
	"targetFiles" text[] DEFAULT '{}' NOT NULL,
	"validationRules" jsonb,
	"expectedChanges" jsonb,
	"difficulty" "OSIssueDifficulty" DEFAULT 'EASY' NOT NULL,
	"estimatedMinutes" integer DEFAULT 30 NOT NULL,
	"xpReward" integer DEFAULT 50 NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLearnProgress" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"moduleId" text NOT NULL,
	"lessonsCompleted" integer DEFAULT 0 NOT NULL,
	"totalLessons" integer DEFAULT 0 NOT NULL,
	"progressPercent" real DEFAULT 0 NOT NULL,
	"quizScore" integer,
	"quizAttempts" integer DEFAULT 0 NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"completedAt" timestamp,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSLessonCompletion" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"lessonId" text NOT NULL,
	"score" integer,
	"timeSpent" integer DEFAULT 0 NOT NULL,
	"commandsRun" jsonb,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSProjectContributor" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"userId" text NOT NULL,
	"totalContributions" integer DEFAULT 0 NOT NULL,
	"prsSubmitted" integer DEFAULT 0 NOT NULL,
	"prsMerged" integer DEFAULT 0 NOT NULL,
	"issuesSolved" integer DEFAULT 0 NOT NULL,
	"reviewsGiven" integer DEFAULT 0 NOT NULL,
	"totalXpEarned" integer DEFAULT 0 NOT NULL,
	"totalBountyEarned" real DEFAULT 0 NOT NULL,
	"rank" integer,
	"contributionScore" real DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"lastActiveAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSProjectLeaderboard" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"userId" text NOT NULL,
	"rank" integer NOT NULL,
	"score" real NOT NULL,
	"prsMerged" integer NOT NULL,
	"issuesSolved" integer NOT NULL,
	"bountyEarned" real DEFAULT 0 NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OSProjectSetupGuide" (
	"id" text PRIMARY KEY NOT NULL,
	"projectId" text NOT NULL,
	"steps" jsonb NOT NULL,
	"nodeVersion" text,
	"npmPackages" text[] DEFAULT '{}' NOT NULL,
	"envVariables" jsonb,
	"installCommand" text DEFAULT 'npm install' NOT NULL,
	"devCommand" text DEFAULT 'npm run dev' NOT NULL,
	"buildCommand" text DEFAULT 'npm run build' NOT NULL,
	"testCommand" text DEFAULT 'npm test' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "OSProjectSetupGuide_projectId_unique" UNIQUE("projectId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserOSStats" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"modulesCompleted" integer DEFAULT 0 NOT NULL,
	"lessonsCompleted" integer DEFAULT 0 NOT NULL,
	"totalLearningTime" integer DEFAULT 0 NOT NULL,
	"isCertified" boolean DEFAULT false NOT NULL,
	"certificationScore" integer,
	"certifiedAt" timestamp,
	"totalProjects" integer DEFAULT 0 NOT NULL,
	"totalContributions" integer DEFAULT 0 NOT NULL,
	"prsSubmitted" integer DEFAULT 0 NOT NULL,
	"prsMerged" integer DEFAULT 0 NOT NULL,
	"issuesSolved" integer DEFAULT 0 NOT NULL,
	"reviewsGiven" integer DEFAULT 0 NOT NULL,
	"avgPrScore" real DEFAULT 0 NOT NULL,
	"acceptanceRate" real DEFAULT 0 NOT NULL,
	"totalBountyEarned" real DEFAULT 0 NOT NULL,
	"pendingBounty" real DEFAULT 0 NOT NULL,
	"osXp" integer DEFAULT 0 NOT NULL,
	"globalRank" integer,
	"currentStreak" integer DEFAULT 0 NOT NULL,
	"longestStreak" integer DEFAULT 0 NOT NULL,
	"lastContributionAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UserOSStats_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderCodingSubmission" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"userId" text NOT NULL,
	"submissionType" text NOT NULL,
	"dayNumber" integer,
	"problemId" text NOT NULL,
	"code" text NOT NULL,
	"language" text NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"testsPassed" integer DEFAULT 0 NOT NULL,
	"totalTests" integer DEFAULT 0 NOT NULL,
	"executionTime" integer,
	"testResults" jsonb,
	"submittedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderDailySession" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"userId" text NOT NULL,
	"date" date NOT NULL,
	"totalSubGoals" integer DEFAULT 0 NOT NULL,
	"completedSubGoals" integer DEFAULT 0 NOT NULL,
	"totalQuizQuestions" integer DEFAULT 0 NOT NULL,
	"correctQuizAnswers" integer DEFAULT 0 NOT NULL,
	"totalCodingProblems" integer DEFAULT 0 NOT NULL,
	"solvedCodingProblems" integer DEFAULT 0 NOT NULL,
	"totalTimeMinutes" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderGoalPurchase" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"buyerId" text NOT NULL,
	"creditsPaid" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderGoal" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"groupId" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" "PathfinderCategory" NOT NULL,
	"level" "PathfinderLevel" NOT NULL,
	"focusAreas" text[] DEFAULT '{}' NOT NULL,
	"targetDate" timestamp,
	"duration" "PathfinderGoalDuration",
	"isPublic" boolean DEFAULT true NOT NULL,
	"forkedFromId" text,
	"creditPrice" integer,
	"overview" text,
	"estimatedDays" integer,
	"estimatedHours" integer,
	"learningObjectives" text[] DEFAULT '{}' NOT NULL,
	"prerequisites" text[] DEFAULT '{}' NOT NULL,
	"status" "PathfinderStatus" DEFAULT 'ACTIVE' NOT NULL,
	"progressPercent" integer DEFAULT 0 NOT NULL,
	"totalSubGoals" integer DEFAULT 0 NOT NULL,
	"completedSubGoals" integer DEFAULT 0 NOT NULL,
	"totalQuizAnswered" integer DEFAULT 0 NOT NULL,
	"totalCodingSolved" integer DEFAULT 0 NOT NULL,
	"streakDays" integer DEFAULT 0 NOT NULL,
	"lastActivityAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"startedAt" timestamp,
	"verificationStartedAt" timestamp,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderGroup" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"emoji" text DEFAULT '📁',
	"color" text DEFAULT '#7c3aed',
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderQuizAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"userId" text NOT NULL,
	"quizType" text NOT NULL,
	"dayNumber" integer,
	"score" integer NOT NULL,
	"correctCount" integer NOT NULL,
	"totalQuestions" integer NOT NULL,
	"timeTaken" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"startedAt" timestamp NOT NULL,
	"completedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderSubGoal" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"sessionId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"source" text DEFAULT 'text' NOT NULL,
	"voiceTranscript" text,
	"status" "SubGoalStatus" DEFAULT 'PENDING' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"isAIGenerated" boolean DEFAULT false NOT NULL,
	"isContentLoaded" boolean DEFAULT false NOT NULL,
	"aiCodingProblem" jsonb,
	"hasCoding" boolean DEFAULT false NOT NULL,
	"studioId" text,
	"quizCompleted" boolean DEFAULT false NOT NULL,
	"quizScore" integer,
	"codingCompleted" boolean DEFAULT false NOT NULL,
	"codingPassed" boolean DEFAULT false NOT NULL,
	"codingProgress" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"completedAt" timestamp,
	CONSTRAINT "PathfinderSubGoal_studioId_unique" UNIQUE("studioId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderUsageLedger" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"userId" text NOT NULL,
	"action" text NOT NULL,
	"provider" text NOT NULL,
	"inputTokens" integer DEFAULT 0 NOT NULL,
	"outputTokens" integer DEFAULT 0 NOT NULL,
	"creditsCost" integer DEFAULT 0 NOT NULL,
	"deducted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PathfinderVerification" (
	"id" text PRIMARY KEY NOT NULL,
	"goalId" text NOT NULL,
	"overallScore" integer,
	"passed" boolean DEFAULT false NOT NULL,
	"quizStatus" "VerificationSectionStatus" DEFAULT 'PENDING' NOT NULL,
	"codingStatus" "VerificationSectionStatus" DEFAULT 'LOCKED' NOT NULL,
	"mockStatus" "VerificationSectionStatus" DEFAULT 'LOCKED' NOT NULL,
	"projectStatus" "VerificationSectionStatus" DEFAULT 'LOCKED' NOT NULL,
	"quizScore" integer,
	"codingScore" integer,
	"mockScore" integer,
	"projectComplete" boolean DEFAULT false NOT NULL,
	"quizAttempts" integer DEFAULT 0 NOT NULL,
	"codingAttempts" integer DEFAULT 0 NOT NULL,
	"mockAttempts" integer DEFAULT 0 NOT NULL,
	"verificationCreditsCharged" integer DEFAULT 0 NOT NULL,
	"generatedPlan" jsonb,
	"mockInterviewId" text,
	"mockSessionId" text,
	"projectType" text,
	"projectId" text,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"quizCompletedAt" timestamp,
	"codingCompletedAt" timestamp,
	"mockCompletedAt" timestamp,
	"projectCompletedAt" timestamp,
	"completedAt" timestamp,
	CONSTRAINT "PathfinderVerification_goalId_unique" UNIQUE("goalId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioChatMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"studioId" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioCodeBlock" (
	"id" text PRIMARY KEY NOT NULL,
	"blockId" text NOT NULL,
	"language" text NOT NULL,
	"code" text NOT NULL,
	"isPractice" boolean DEFAULT false NOT NULL,
	"problemTitle" text,
	"problemDescription" text,
	"testCases" jsonb,
	"hints" text[] DEFAULT '{}' NOT NULL,
	"solution" text,
	"studioId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioFlashcardDeck" (
	"id" text PRIMARY KEY NOT NULL,
	"blockId" text NOT NULL,
	"title" text NOT NULL,
	"cards" jsonb NOT NULL,
	"studioId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioFlashcardSession" (
	"id" text PRIMARY KEY NOT NULL,
	"deckId" text NOT NULL,
	"userId" text NOT NULL,
	"cardsStudied" integer NOT NULL,
	"correctCount" integer NOT NULL,
	"studyTime" integer NOT NULL,
	"cardProgress" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioMediaBlock" (
	"id" text PRIMARY KEY NOT NULL,
	"blockId" text NOT NULL,
	"type" "StudioMediaType" NOT NULL,
	"url" text NOT NULL,
	"prompt" text,
	"width" integer,
	"height" integer,
	"duration" integer,
	"studioId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioQuizAttempt" (
	"id" text PRIMARY KEY NOT NULL,
	"quizId" text NOT NULL,
	"userId" text NOT NULL,
	"score" integer NOT NULL,
	"maxScore" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"timeTaken" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioQuiz" (
	"id" text PRIMARY KEY NOT NULL,
	"blockId" text NOT NULL,
	"title" text NOT NULL,
	"questions" jsonb NOT NULL,
	"timeLimit" integer,
	"shuffleQuestions" boolean DEFAULT true NOT NULL,
	"showCorrectAnswers" boolean DEFAULT true NOT NULL,
	"studioId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudioStep" (
	"id" text PRIMARY KEY NOT NULL,
	"studioId" text NOT NULL,
	"orderNumber" integer NOT NULL,
	"type" "StudioStepType" NOT NULL,
	"content" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source" "ContentSource" NOT NULL,
	"status" "StudioStepStatus" DEFAULT 'COMPLETED' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Studio" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"description" text,
	"emoji" text DEFAULT '📚',
	"coverImage" text,
	"source" "StudioSource" DEFAULT 'MANUAL' NOT NULL,
	"sourceId" text,
	"stepCount" integer DEFAULT 0 NOT NULL,
	"category" "StudioCategory" DEFAULT 'GENERAL' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"visibility" "StudioVisibility" DEFAULT 'PRIVATE' NOT NULL,
	"isTemplate" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"clones" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"userId" text NOT NULL,
	"projectId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"lastEditedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Studio_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ClassEnrollment" (
	"id" text PRIMARY KEY NOT NULL,
	"classId" text NOT NULL,
	"studentLinkId" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"enrolledAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CompanyUniversityLink" (
	"id" text PRIMARY KEY NOT NULL,
	"companyId" text NOT NULL,
	"universityId" text NOT NULL,
	"referredById" text,
	"referralCode" text,
	"isPartner" boolean DEFAULT false NOT NULL,
	"partnerSince" timestamp,
	"jobsPosted" integer DEFAULT 0 NOT NULL,
	"studentsHired" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "CompanyUniversityLink_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Department" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"description" text,
	"headUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "StudentUniversityLink" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"universityId" text NOT NULL,
	"departmentId" text,
	"universityEmail" text NOT NULL,
	"verificationStatus" "StudentVerificationStatus" DEFAULT 'PENDING' NOT NULL,
	"verificationOtp" text,
	"otpExpiresAt" timestamp,
	"verifiedAt" timestamp,
	"rejectionReason" text,
	"rollNumber" text,
	"semester" "SemesterType",
	"batchYear" text,
	"creditsAllocated" integer DEFAULT 0 NOT NULL,
	"creditsUsed" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "University" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logoUrl" text,
	"bannerUrl" text,
	"website" text,
	"description" text,
	"email" text,
	"phone" text,
	"universityType" "UniversityType",
	"affiliatedTo" text,
	"accreditation" text,
	"establishedYear" integer,
	"emailDomain" text NOT NULL,
	"address" text,
	"city" text,
	"state" text,
	"country" text DEFAULT 'India' NOT NULL,
	"pincode" text,
	"verificationStatus" "UniversityVerificationStatus" DEFAULT 'PENDING' NOT NULL,
	"verifiedAt" timestamp,
	"verifiedBy" text,
	"rejectionReason" text,
	"totalCreditsAllocated" integer DEFAULT 0 NOT NULL,
	"totalCreditsUsed" integer DEFAULT 0 NOT NULL,
	"creditExpiryDate" timestamp,
	"memberInviteCode" text,
	"studentInviteCode" text,
	"createdByUserId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "University_slug_unique" UNIQUE("slug"),
	CONSTRAINT "University_emailDomain_unique" UNIQUE("emailDomain"),
	CONSTRAINT "University_memberInviteCode_unique" UNIQUE("memberInviteCode"),
	CONSTRAINT "University_studentInviteCode_unique" UNIQUE("studentInviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityAssignment" (
	"id" text PRIMARY KEY NOT NULL,
	"classId" text NOT NULL,
	"createdById" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"instructions" text,
	"type" "UniversityAssignmentType" NOT NULL,
	"referenceId" text,
	"referenceUrl" text,
	"referenceData" jsonb,
	"deadline" timestamp,
	"maxAttempts" integer DEFAULT 1 NOT NULL,
	"lateSubmission" boolean DEFAULT false NOT NULL,
	"latePenalty" integer DEFAULT 0 NOT NULL,
	"creditsRequired" integer DEFAULT 0 NOT NULL,
	"maxScore" integer DEFAULT 100 NOT NULL,
	"passingScore" integer DEFAULT 40 NOT NULL,
	"isAutoGraded" boolean DEFAULT false NOT NULL,
	"status" "UniversityAssignmentStatus" DEFAULT 'DRAFT' NOT NULL,
	"publishedAt" timestamp,
	"closedAt" timestamp,
	"attachments" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityClass" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"departmentId" text,
	"name" text NOT NULL,
	"code" text,
	"description" text,
	"semester" "SemesterType" NOT NULL,
	"academicYear" text NOT NULL,
	"section" text,
	"facultyId" text,
	"studentCount" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityCreditTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"balance" integer NOT NULL,
	"description" text,
	"referenceType" text,
	"referenceId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"universityName" text,
	"invitedBy" text,
	"inviteCode" text NOT NULL,
	"status" "UniversityMemberInviteStatus" DEFAULT 'PENDING' NOT NULL,
	"acceptedAt" timestamp,
	"expiresAt" timestamp,
	"metadata" jsonb,
	"universityId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UniversityInvitation_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityInvoice" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"invoiceNumber" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"invoiceDate" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp,
	"paidAt" timestamp,
	"subtotal" integer NOT NULL,
	"taxAmount" integer DEFAULT 0 NOT NULL,
	"taxRate" real DEFAULT 18 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"totalAmount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"lineItems" jsonb NOT NULL,
	"billingName" text,
	"billingEmail" text,
	"billingAddress" text,
	"billingCity" text,
	"billingState" text,
	"billingCountry" text,
	"billingPincode" text,
	"gstNumber" text,
	"pdfUrl" text,
	"notes" text,
	"paymentId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UniversityInvoice_invoiceNumber_unique" UNIQUE("invoiceNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityJob" (
	"id" text PRIMARY KEY NOT NULL,
	"jobId" text NOT NULL,
	"universityId" text NOT NULL,
	"visibility" "UniversityJobVisibility" DEFAULT 'UNIVERSITY_ONLY' NOT NULL,
	"filters" jsonb,
	"taggedById" text,
	"applications" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityMemberInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"departmentId" text,
	"role" "UniversityMemberRole" DEFAULT 'FACULTY' NOT NULL,
	"jobTitle" "UniversityMemberJobTitle" DEFAULT 'OTHER' NOT NULL,
	"inviteCode" text NOT NULL,
	"invitedById" text NOT NULL,
	"status" "UniversityMemberInviteStatus" DEFAULT 'PENDING' NOT NULL,
	"message" text,
	"expiresAt" timestamp,
	"acceptedAt" timestamp,
	"resultingMemberId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UniversityMemberInvitation_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityMember" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"universityId" text NOT NULL,
	"departmentId" text,
	"role" "UniversityMemberRole" DEFAULT 'FACULTY' NOT NULL,
	"jobTitle" "UniversityMemberJobTitle" DEFAULT 'OTHER' NOT NULL,
	"jobTitleCustom" text,
	"displayName" text,
	"email" text NOT NULL,
	"phone" text,
	"permissions" jsonb DEFAULT '["view_classes","create_assignments","grade_submissions","view_students"]'::jsonb NOT NULL,
	"inviteStatus" "UniversityMemberInviteStatus" DEFAULT 'ACCEPTED' NOT NULL,
	"invitedById" text,
	"invitedAt" timestamp,
	"acceptedAt" timestamp,
	"isActive" boolean DEFAULT true NOT NULL,
	"lastActiveAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversityPayment" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"description" text,
	"dodoPaymentId" text,
	"dodoCheckoutSessionId" text,
	"invoiceId" text,
	"metadata" jsonb,
	"paidAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversitySubmission" (
	"id" text PRIMARY KEY NOT NULL,
	"assignmentId" text NOT NULL,
	"studentLinkId" text NOT NULL,
	"mainPlatformSubmissionId" text,
	"mainPlatformUrl" text,
	"submissionData" jsonb,
	"submissionUrl" text,
	"submissionText" text,
	"attemptNumber" integer DEFAULT 1 NOT NULL,
	"creditsUsed" integer DEFAULT 0 NOT NULL,
	"status" "SubmissionGradingStatus" DEFAULT 'NOT_SUBMITTED' NOT NULL,
	"score" integer,
	"maxScore" integer,
	"percentage" real,
	"passed" boolean,
	"feedback" text,
	"gradedById" text,
	"gradedAt" timestamp,
	"autoGradeResult" jsonb,
	"autoGradedAt" timestamp,
	"isLate" boolean DEFAULT false NOT NULL,
	"latePenalty" integer DEFAULT 0 NOT NULL,
	"submittedAt" timestamp,
	"startedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UniversitySubscription" (
	"id" text PRIMARY KEY NOT NULL,
	"universityId" text NOT NULL,
	"plan" "UniversitySubscriptionPlan" DEFAULT 'FREE' NOT NULL,
	"status" "UniversitySubscriptionStatus" DEFAULT 'ACTIVE' NOT NULL,
	"maxStudents" integer DEFAULT 500 NOT NULL,
	"maxFaculty" integer DEFAULT 10 NOT NULL,
	"maxDepartments" integer DEFAULT 5 NOT NULL,
	"maxClassesPerFaculty" integer DEFAULT 5 NOT NULL,
	"maxCreditsPerMonth" integer DEFAULT 100000 NOT NULL,
	"hasAnalytics" boolean DEFAULT false NOT NULL,
	"hasAdvancedReports" boolean DEFAULT false NOT NULL,
	"hasPlacementModule" boolean DEFAULT false NOT NULL,
	"hasCompanyPortal" boolean DEFAULT false NOT NULL,
	"hasAPIAccess" boolean DEFAULT false NOT NULL,
	"hasPrioritySupport" boolean DEFAULT false NOT NULL,
	"hasWhiteLabel" boolean DEFAULT false NOT NULL,
	"hasCustomBranding" boolean DEFAULT false NOT NULL,
	"billingCycle" text DEFAULT 'monthly' NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"currentPeriodStart" timestamp DEFAULT now() NOT NULL,
	"currentPeriodEnd" timestamp,
	"dodoSubscriptionId" text,
	"dodoCustomerId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "UniversitySubscription_universityId_unique" UNIQUE("universityId")
);
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Certifications" ADD CONSTRAINT "Certifications_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PortfolioProject" ADD CONSTRAINT "PortfolioProject_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProfileView" ADD CONSTRAINT "ProfileView_profileId_UserProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."UserProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectLink" ADD CONSTRAINT "ProjectLink_projectId_PortfolioProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."PortfolioProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectMedia" ADD CONSTRAINT "ProjectMedia_projectId_PortfolioProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."PortfolioProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "RecentActivity" ADD CONSTRAINT "RecentActivity_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "SkillEndorsement" ADD CONSTRAINT "SkillEndorsement_skillId_Skills_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."Skills"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Skills" ADD CONSTRAINT "Skills_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserDSATrackingEntry" ADD CONSTRAINT "UserDSATrackingEntry_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserEducation" ADD CONSTRAINT "UserEducation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "SocialConnection" ADD CONSTRAINT "SocialConnection_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserLevelProgress" ADD CONSTRAINT "UserLevelProgress_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserLevelProgress" ADD CONSTRAINT "UserLevelProgress_level_Level_level_fk" FOREIGN KEY ("level") REFERENCES "public"."Level"("level") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "XpTransaction" ADD CONSTRAINT "XpTransaction_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ActivityEntry" ADD CONSTRAINT "ActivityEntry_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ActivityEntry" ADD CONSTRAINT "ActivityEntry_dailyActivityId_DailyActivity_id_fk" FOREIGN KEY ("dailyActivityId") REFERENCES "public"."DailyActivity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StreakReward" ADD CONSTRAINT "StreakReward_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AdminAccess" ADD CONSTRAINT "AdminAccess_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminId_AdminAccess_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."AdminAccess"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AdminInvitation" ADD CONSTRAINT "AdminInvitation_createdById_AdminAccess_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."AdminAccess"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CodeEvaluation" ADD CONSTRAINT "CodeEvaluation_interviewId_JobInterviewAssistant_id_fk" FOREIGN KEY ("interviewId") REFERENCES "public"."JobInterviewAssistant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "InterviewPlanPurchase" ADD CONSTRAINT "InterviewPlanPurchase_interviewPlanId_JobInterviewAssistant_id_fk" FOREIGN KEY ("interviewPlanId") REFERENCES "public"."JobInterviewAssistant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "InterviewPlanPurchase" ADD CONSTRAINT "InterviewPlanPurchase_newInterviewPlanId_JobInterviewAssistant_id_fk" FOREIGN KEY ("newInterviewPlanId") REFERENCES "public"."JobInterviewAssistant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobInterviewAssistant" ADD CONSTRAINT "JobInterviewAssistant_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_interviewId_JobInterviewAssistant_id_fk" FOREIGN KEY ("interviewId") REFERENCES "public"."JobInterviewAssistant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ResumeDraft" ADD CONSTRAINT "ResumeDraft_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ResumeTemplate" ADD CONSTRAINT "ResumeTemplate_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ResumeTemplateGeneration" ADD CONSTRAINT "ResumeTemplateGeneration_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ResumeTemplateGeneration" ADD CONSTRAINT "ResumeTemplateGeneration_templateId_ResumeTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."ResumeTemplate"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_buyerId_User_id_fk" FOREIGN KEY ("buyerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_templateId_ResumeTemplate_id_fk" FOREIGN KEY ("templateId") REFERENCES "public"."ResumeTemplate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserQuestionResponse" ADD CONSTRAINT "UserQuestionResponse_interviewId_JobInterviewAssistant_id_fk" FOREIGN KEY ("interviewId") REFERENCES "public"."JobInterviewAssistant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CommunityPostBookmark" ADD CONSTRAINT "CommunityPostBookmark_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MockInterviewBookmark" ADD CONSTRAINT "MockInterviewBookmark_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Bookmark" ADD CONSTRAINT "ProjectV2Bookmark_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_User_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_User_id_fk" FOREIGN KEY ("followingId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_senderId_User_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_receiverId_User_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Company" ADD CONSTRAINT "Company_createdByUserId_User_id_fk" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyFollower" ADD CONSTRAINT "CompanyFollower_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyFollower" ADD CONSTRAINT "CompanyFollower_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyInvitation" ADD CONSTRAINT "CompanyInvitation_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyInvoice" ADD CONSTRAINT "CompanyInvoice_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyInvoice" ADD CONSTRAINT "CompanyInvoice_paymentId_CompanyPayment_id_fk" FOREIGN KEY ("paymentId") REFERENCES "public"."CompanyPayment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyMember" ADD CONSTRAINT "CompanyMember_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyPayment" ADD CONSTRAINT "CompanyPayment_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyPayment" ADD CONSTRAINT "CompanyPayment_subscriptionId_CompanySubscription_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."CompanySubscription"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanySubscription" ADD CONSTRAINT "CompanySubscription_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MemberInvitation" ADD CONSTRAINT "MemberInvitation_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MemberInvitation" ADD CONSTRAINT "MemberInvitation_invitedById_CompanyMember_id_fk" FOREIGN KEY ("invitedById") REFERENCES "public"."CompanyMember"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "InterviewPrepProgress" ADD CONSTRAINT "InterviewPrepProgress_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "InterviewProcess" ADD CONSTRAINT "InterviewProcess_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "InterviewRound" ADD CONSTRAINT "InterviewRound_processId_InterviewProcess_id_fk" FOREIGN KEY ("processId") REFERENCES "public"."InterviewProcess"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobMockSession" ADD CONSTRAINT "JobMockSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobMockSession" ADD CONSTRAINT "JobMockSession_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobMockSession" ADD CONSTRAINT "JobMockSession_roundId_InterviewRound_id_fk" FOREIGN KEY ("roundId") REFERENCES "public"."InterviewRound"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ApplicationActivity" ADD CONSTRAINT "ApplicationActivity_applicationId_JobApplication_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."JobApplication"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ApplicationActivity" ADD CONSTRAINT "ApplicationActivity_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_Job_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "JobRecommendation" ADD CONSTRAINT "JobRecommendation_jobId_Job_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_Company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_CompanyMember_id_fk" FOREIGN KEY ("postedById") REFERENCES "public"."CompanyMember"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_Job_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CreditRequest" ADD CONSTRAINT "CreditRequest_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CreditTransferOut" ADD CONSTRAINT "CreditTransferOut_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CreditTransfer" ADD CONSTRAINT "CreditTransfer_senderId_User_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CreditTransfer" ADD CONSTRAINT "CreditTransfer_receiverId_User_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_User_id_fk" FOREIGN KEY ("referrerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUserId_User_id_fk" FOREIGN KEY ("referredUserId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "SubTransaction" ADD CONSTRAINT "SubTransaction_creditTransactionId_CreditTransaction_id_fk" FOREIGN KEY ("creditTransactionId") REFERENCES "public"."CreditTransaction"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeApiRequest" ADD CONSTRAINT "KnowMeApiRequest_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeChatMessage" ADD CONSTRAINT "KnowMeChatMessage_sessionId_KnowMeChatSession_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."KnowMeChatSession"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeChatSession" ADD CONSTRAINT "KnowMeChatSession_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeChatSession" ADD CONSTRAINT "KnowMeChatSession_visitorUserId_User_id_fk" FOREIGN KEY ("visitorUserId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeCreditTransaction" ADD CONSTRAINT "KnowMeCreditTransaction_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeEmbeddingJob" ADD CONSTRAINT "KnowMeEmbeddingJob_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeEmbedding" ADD CONSTRAINT "KnowMeEmbedding_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeExternalData" ADD CONSTRAINT "KnowMeExternalData_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeExternalData" ADD CONSTRAINT "KnowMeExternalData_connectionId_KnowMePlatformConnection_id_fk" FOREIGN KEY ("connectionId") REFERENCES "public"."KnowMePlatformConnection"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMePersonalData" ADD CONSTRAINT "KnowMePersonalData_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMePlatformConnection" ADD CONSTRAINT "KnowMePlatformConnection_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMePrivacySettings" ADD CONSTRAINT "KnowMePrivacySettings_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeProfileView" ADD CONSTRAINT "KnowMeProfileView_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeProfileView" ADD CONSTRAINT "KnowMeProfileView_viewerUserId_User_id_fk" FOREIGN KEY ("viewerUserId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeProfile" ADD CONSTRAINT "KnowMeProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeQuestionAnalytics" ADD CONSTRAINT "KnowMeQuestionAnalytics_profileId_KnowMeProfile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."KnowMeProfile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "KnowMeQuestionAnalytics" ADD CONSTRAINT "KnowMeQuestionAnalytics_askedByUserId_User_id_fk" FOREIGN KEY ("askedByUserId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MockInterviewVoice" ADD CONSTRAINT "MockInterviewVoice_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MockVoiceRating" ADD CONSTRAINT "MockVoiceRating_mockId_MockInterviewVoice_id_fk" FOREIGN KEY ("mockId") REFERENCES "public"."MockInterviewVoice"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MockVoiceRating" ADD CONSTRAINT "MockVoiceRating_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MockVoiceSession" ADD CONSTRAINT "MockVoiceSession_mockId_MockInterviewVoice_id_fk" FOREIGN KEY ("mockId") REFERENCES "public"."MockInterviewVoice"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "MockVoiceSession" ADD CONSTRAINT "MockVoiceSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeLeaderboard" ADD CONSTRAINT "PracticeLeaderboard_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeModuleProgress" ADD CONSTRAINT "PracticeModuleProgress_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeUserSession" ADD CONSTRAINT "PracticeUserSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeUserSession" ADD CONSTRAINT "PracticeUserSession_problemId_PracticeProblem_id_fk" FOREIGN KEY ("problemId") REFERENCES "public"."PracticeProblem"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AssessmentCertificate" ADD CONSTRAINT "AssessmentCertificate_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_topicId_AssessmentTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."AssessmentTopic"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_subModuleId_AssessmentSubModule_id_fk" FOREIGN KEY ("subModuleId") REFERENCES "public"."AssessmentSubModule"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "AssessmentSubModule" ADD CONSTRAINT "AssessmentSubModule_topicId_AssessmentTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."AssessmentTopic"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_attemptId_ExamAttempt_id_fk" FOREIGN KEY ("attemptId") REFERENCES "public"."ExamAttempt"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_questionId_AssessmentQuestion_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."AssessmentQuestion"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_topicId_AssessmentTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."AssessmentTopic"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeAnswer" ADD CONSTRAINT "PracticeAnswer_attemptId_PracticeAttempt_id_fk" FOREIGN KEY ("attemptId") REFERENCES "public"."PracticeAttempt"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeAnswer" ADD CONSTRAINT "PracticeAnswer_questionId_AssessmentQuestion_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."AssessmentQuestion"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_topicId_AssessmentTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."AssessmentTopic"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_subModuleId_AssessmentSubModule_id_fk" FOREIGN KEY ("subModuleId") REFERENCES "public"."AssessmentSubModule"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "RandomPracticeSession" ADD CONSTRAINT "RandomPracticeSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserAssessmentStats" ADD CONSTRAINT "UserAssessmentStats_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetAnswer" ADD CONSTRAINT "UserExamSetAnswer_attemptId_UserExamSetAttempt_id_fk" FOREIGN KEY ("attemptId") REFERENCES "public"."UserExamSetAttempt"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetAnswer" ADD CONSTRAINT "UserExamSetAnswer_questionId_UserExamSetQuestion_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."UserExamSetQuestion"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetAttempt" ADD CONSTRAINT "UserExamSetAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetAttempt" ADD CONSTRAINT "UserExamSetAttempt_examSetId_UserExamSet_id_fk" FOREIGN KEY ("examSetId") REFERENCES "public"."UserExamSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetLike" ADD CONSTRAINT "UserExamSetLike_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetLike" ADD CONSTRAINT "UserExamSetLike_examSetId_UserExamSet_id_fk" FOREIGN KEY ("examSetId") REFERENCES "public"."UserExamSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetPurchase" ADD CONSTRAINT "UserExamSetPurchase_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetPurchase" ADD CONSTRAINT "UserExamSetPurchase_examSetId_UserExamSet_id_fk" FOREIGN KEY ("examSetId") REFERENCES "public"."UserExamSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSetQuestion" ADD CONSTRAINT "UserExamSetQuestion_examSetId_UserExamSet_id_fk" FOREIGN KEY ("examSetId") REFERENCES "public"."UserExamSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSet" ADD CONSTRAINT "UserExamSet_creatorId_User_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserExamSet" ADD CONSTRAINT "UserExamSet_topicId_AssessmentTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."AssessmentTopic"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetAnswer" ADD CONSTRAINT "UserPracticeSetAnswer_attemptId_UserPracticeSetAttempt_id_fk" FOREIGN KEY ("attemptId") REFERENCES "public"."UserPracticeSetAttempt"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetAnswer" ADD CONSTRAINT "UserPracticeSetAnswer_questionId_UserPracticeSetQuestion_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."UserPracticeSetQuestion"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetAttempt" ADD CONSTRAINT "UserPracticeSetAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetAttempt" ADD CONSTRAINT "UserPracticeSetAttempt_practiceSetId_UserPracticeSet_id_fk" FOREIGN KEY ("practiceSetId") REFERENCES "public"."UserPracticeSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetLike" ADD CONSTRAINT "UserPracticeSetLike_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetLike" ADD CONSTRAINT "UserPracticeSetLike_practiceSetId_UserPracticeSet_id_fk" FOREIGN KEY ("practiceSetId") REFERENCES "public"."UserPracticeSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetPurchase" ADD CONSTRAINT "UserPracticeSetPurchase_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetPurchase" ADD CONSTRAINT "UserPracticeSetPurchase_practiceSetId_UserPracticeSet_id_fk" FOREIGN KEY ("practiceSetId") REFERENCES "public"."UserPracticeSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSetQuestion" ADD CONSTRAINT "UserPracticeSetQuestion_practiceSetId_UserPracticeSet_id_fk" FOREIGN KEY ("practiceSetId") REFERENCES "public"."UserPracticeSet"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSet" ADD CONSTRAINT "UserPracticeSet_creatorId_User_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSet" ADD CONSTRAINT "UserPracticeSet_topicId_AssessmentTopic_id_fk" FOREIGN KEY ("topicId") REFERENCES "public"."AssessmentTopic"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserPracticeSet" ADD CONSTRAINT "UserPracticeSet_subModuleId_AssessmentSubModule_id_fk" FOREIGN KEY ("subModuleId") REFERENCES "public"."AssessmentSubModule"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectIdeaUpvote" ADD CONSTRAINT "ProjectIdeaUpvote_projectIdeaId_ProjectIdea_id_fk" FOREIGN KEY ("projectIdeaId") REFERENCES "public"."ProjectIdea"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_blueprintProjectId_ProjectV2_id_fk" FOREIGN KEY ("blueprintProjectId") REFERENCES "public"."ProjectV2"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_submittedById_User_id_fk" FOREIGN KEY ("submittedById") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_categoryId_ProjectCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."ProjectCategory"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2ErrorVote" ADD CONSTRAINT "ProjectV2ErrorVote_errorId_ProjectV2Error_id_fk" FOREIGN KEY ("errorId") REFERENCES "public"."ProjectV2Error"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2ErrorVote" ADD CONSTRAINT "ProjectV2ErrorVote_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Error" ADD CONSTRAINT "ProjectV2Error_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Error" ADD CONSTRAINT "ProjectV2Error_taskId_ProjectV2Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."ProjectV2Task"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Error" ADD CONSTRAINT "ProjectV2Error_submittedById_User_id_fk" FOREIGN KEY ("submittedById") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2FeatureSuggestion" ADD CONSTRAINT "ProjectV2FeatureSuggestion_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2FeatureSuggestion" ADD CONSTRAINT "ProjectV2FeatureSuggestion_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2GlobalLeaderboard" ADD CONSTRAINT "ProjectV2GlobalLeaderboard_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2GuidedSession" ADD CONSTRAINT "ProjectV2GuidedSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2GuidedSession" ADD CONSTRAINT "ProjectV2GuidedSession_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Invitation" ADD CONSTRAINT "ProjectV2Invitation_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Invitation" ADD CONSTRAINT "ProjectV2Invitation_invitedUserId_User_id_fk" FOREIGN KEY ("invitedUserId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Invitation" ADD CONSTRAINT "ProjectV2Invitation_invitedById_User_id_fk" FOREIGN KEY ("invitedById") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2KnowledgeBase" ADD CONSTRAINT "ProjectV2KnowledgeBase_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Leaderboard" ADD CONSTRAINT "ProjectV2Leaderboard_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Leaderboard" ADD CONSTRAINT "ProjectV2Leaderboard_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Member" ADD CONSTRAINT "ProjectV2Member_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Member" ADD CONSTRAINT "ProjectV2Member_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2MockSession" ADD CONSTRAINT "ProjectV2MockSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2MockSession" ADD CONSTRAINT "ProjectV2MockSession_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2MockSession" ADD CONSTRAINT "ProjectV2MockSession_sprintId_ProjectV2Sprint_id_fk" FOREIGN KEY ("sprintId") REFERENCES "public"."ProjectV2Sprint"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Page" ADD CONSTRAINT "ProjectV2Page_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2QuizAnswer" ADD CONSTRAINT "ProjectV2QuizAnswer_attemptId_ProjectV2QuizAttempt_id_fk" FOREIGN KEY ("attemptId") REFERENCES "public"."ProjectV2QuizAttempt"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2QuizAnswer" ADD CONSTRAINT "ProjectV2QuizAnswer_questionId_ProjectV2QuizQuestion_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."ProjectV2QuizQuestion"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2QuizAttempt" ADD CONSTRAINT "ProjectV2QuizAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2QuizAttempt" ADD CONSTRAINT "ProjectV2QuizAttempt_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2QuizAttempt" ADD CONSTRAINT "ProjectV2QuizAttempt_quizId_ProjectV2Quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."ProjectV2Quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2QuizQuestion" ADD CONSTRAINT "ProjectV2QuizQuestion_quizId_ProjectV2Quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."ProjectV2Quiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Quiz" ADD CONSTRAINT "ProjectV2Quiz_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Resource" ADD CONSTRAINT "ProjectV2Resource_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Resource" ADD CONSTRAINT "ProjectV2Resource_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2SprintSuggestion" ADD CONSTRAINT "ProjectV2SprintSuggestion_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2SprintSuggestion" ADD CONSTRAINT "ProjectV2SprintSuggestion_suggestedById_User_id_fk" FOREIGN KEY ("suggestedById") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2SprintSuggestion" ADD CONSTRAINT "ProjectV2SprintSuggestion_reviewedById_User_id_fk" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Sprint" ADD CONSTRAINT "ProjectV2Sprint_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Sprint" ADD CONSTRAINT "ProjectV2Sprint_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2StandupConfig" ADD CONSTRAINT "ProjectV2StandupConfig_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2StandupEntry" ADD CONSTRAINT "ProjectV2StandupEntry_configId_ProjectV2StandupConfig_id_fk" FOREIGN KEY ("configId") REFERENCES "public"."ProjectV2StandupConfig"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Submission" ADD CONSTRAINT "ProjectV2Submission_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Submission" ADD CONSTRAINT "ProjectV2Submission_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2TaskDetail" ADD CONSTRAINT "ProjectV2TaskDetail_taskId_ProjectV2Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."ProjectV2Task"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Task" ADD CONSTRAINT "ProjectV2Task_sprintId_ProjectV2Sprint_id_fk" FOREIGN KEY ("sprintId") REFERENCES "public"."ProjectV2Sprint"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2Task" ADD CONSTRAINT "ProjectV2Task_projectV2Id_ProjectV2_id_fk" FOREIGN KEY ("projectV2Id") REFERENCES "public"."ProjectV2"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ProjectV2" ADD CONSTRAINT "ProjectV2_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserProjectV2Progress" ADD CONSTRAINT "UserProjectV2Progress_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserProjectV2Progress" ADD CONSTRAINT "UserProjectV2Progress_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2Assessment" ADD CONSTRAINT "UserTaskV2Assessment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2Assessment" ADD CONSTRAINT "UserTaskV2Assessment_taskId_ProjectV2Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."ProjectV2Task"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2DetailAccess" ADD CONSTRAINT "UserTaskV2DetailAccess_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2DetailAccess" ADD CONSTRAINT "UserTaskV2DetailAccess_taskDetailId_ProjectV2TaskDetail_id_fk" FOREIGN KEY ("taskDetailId") REFERENCES "public"."ProjectV2TaskDetail"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2Status" ADD CONSTRAINT "UserTaskV2Status_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2Status" ADD CONSTRAINT "UserTaskV2Status_projectId_ProjectV2_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."ProjectV2"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2Status" ADD CONSTRAINT "UserTaskV2Status_taskId_ProjectV2Task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."ProjectV2Task"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserTaskV2Status" ADD CONSTRAINT "UserTaskV2Status_progressId_UserProjectV2Progress_id_fk" FOREIGN KEY ("progressId") REFERENCES "public"."UserProjectV2Progress"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OpenSourceProject" ADD CONSTRAINT "OpenSourceProject_maintainerId_User_id_fk" FOREIGN KEY ("maintainerId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OpenSourceProject" ADD CONSTRAINT "OpenSourceProject_createdById_User_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSCertificationExam" ADD CONSTRAINT "OSCertificationExam_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSCertification" ADD CONSTRAINT "OSCertification_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSContribution" ADD CONSTRAINT "OSContribution_projectId_OpenSourceProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OpenSourceProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSContribution" ADD CONSTRAINT "OSContribution_issueId_OSIssue_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."OSIssue"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSContribution" ADD CONSTRAINT "OSContribution_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSContribution" ADD CONSTRAINT "OSContribution_reviewedById_User_id_fk" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSEarningsTransaction" ADD CONSTRAINT "OSEarningsTransaction_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSGitHubProfile" ADD CONSTRAINT "OSGitHubProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSIssue" ADD CONSTRAINT "OSIssue_projectId_OpenSourceProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OpenSourceProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSIssue" ADD CONSTRAINT "OSIssue_assignedToId_User_id_fk" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLearnLesson" ADD CONSTRAINT "OSLearnLesson_moduleId_OSLearnModule_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."OSLearnModule"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLearnPracticeCompletion" ADD CONSTRAINT "OSLearnPracticeCompletion_projectId_OSLearnPracticeProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OSLearnPracticeProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLearnPracticeSubmission" ADD CONSTRAINT "OSLearnPracticeSubmission_taskId_OSLearnPracticeTask_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."OSLearnPracticeTask"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLearnPracticeTask" ADD CONSTRAINT "OSLearnPracticeTask_projectId_OSLearnPracticeProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OSLearnPracticeProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLearnProgress" ADD CONSTRAINT "OSLearnProgress_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLearnProgress" ADD CONSTRAINT "OSLearnProgress_moduleId_OSLearnModule_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."OSLearnModule"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLessonCompletion" ADD CONSTRAINT "OSLessonCompletion_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSLessonCompletion" ADD CONSTRAINT "OSLessonCompletion_lessonId_OSLearnLesson_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."OSLearnLesson"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSProjectContributor" ADD CONSTRAINT "OSProjectContributor_projectId_OpenSourceProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OpenSourceProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSProjectContributor" ADD CONSTRAINT "OSProjectContributor_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSProjectLeaderboard" ADD CONSTRAINT "OSProjectLeaderboard_projectId_OpenSourceProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OpenSourceProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSProjectLeaderboard" ADD CONSTRAINT "OSProjectLeaderboard_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "OSProjectSetupGuide" ADD CONSTRAINT "OSProjectSetupGuide_projectId_OpenSourceProject_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."OpenSourceProject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UserOSStats" ADD CONSTRAINT "UserOSStats_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderCodingSubmission" ADD CONSTRAINT "PathfinderCodingSubmission_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderDailySession" ADD CONSTRAINT "PathfinderDailySession_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderGoalPurchase" ADD CONSTRAINT "PathfinderGoalPurchase_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderGoalPurchase" ADD CONSTRAINT "PathfinderGoalPurchase_buyerId_User_id_fk" FOREIGN KEY ("buyerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderGoal" ADD CONSTRAINT "PathfinderGoal_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderGoal" ADD CONSTRAINT "PathfinderGoal_groupId_PathfinderGroup_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."PathfinderGroup"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderGroup" ADD CONSTRAINT "PathfinderGroup_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderQuizAttempt" ADD CONSTRAINT "PathfinderQuizAttempt_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderSubGoal" ADD CONSTRAINT "PathfinderSubGoal_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderSubGoal" ADD CONSTRAINT "PathfinderSubGoal_sessionId_PathfinderDailySession_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."PathfinderDailySession"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderUsageLedger" ADD CONSTRAINT "PathfinderUsageLedger_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "PathfinderVerification" ADD CONSTRAINT "PathfinderVerification_goalId_PathfinderGoal_id_fk" FOREIGN KEY ("goalId") REFERENCES "public"."PathfinderGoal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioChatMessage" ADD CONSTRAINT "StudioChatMessage_studioId_Studio_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioCodeBlock" ADD CONSTRAINT "StudioCodeBlock_studioId_Studio_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioFlashcardDeck" ADD CONSTRAINT "StudioFlashcardDeck_studioId_Studio_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioFlashcardSession" ADD CONSTRAINT "StudioFlashcardSession_deckId_StudioFlashcardDeck_id_fk" FOREIGN KEY ("deckId") REFERENCES "public"."StudioFlashcardDeck"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioFlashcardSession" ADD CONSTRAINT "StudioFlashcardSession_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioMediaBlock" ADD CONSTRAINT "StudioMediaBlock_studioId_Studio_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioQuizAttempt" ADD CONSTRAINT "StudioQuizAttempt_quizId_StudioQuiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."StudioQuiz"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioQuizAttempt" ADD CONSTRAINT "StudioQuizAttempt_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioQuiz" ADD CONSTRAINT "StudioQuiz_studioId_Studio_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudioStep" ADD CONSTRAINT "StudioStep_studioId_Studio_id_fk" FOREIGN KEY ("studioId") REFERENCES "public"."Studio"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Studio" ADD CONSTRAINT "Studio_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_UniversityClass_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."UniversityClass"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_studentLinkId_StudentUniversityLink_id_fk" FOREIGN KEY ("studentLinkId") REFERENCES "public"."StudentUniversityLink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "CompanyUniversityLink" ADD CONSTRAINT "CompanyUniversityLink_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "Department" ADD CONSTRAINT "Department_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudentUniversityLink" ADD CONSTRAINT "StudentUniversityLink_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "StudentUniversityLink" ADD CONSTRAINT "StudentUniversityLink_departmentId_Department_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityAssignment" ADD CONSTRAINT "UniversityAssignment_classId_UniversityClass_id_fk" FOREIGN KEY ("classId") REFERENCES "public"."UniversityClass"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityClass" ADD CONSTRAINT "UniversityClass_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityClass" ADD CONSTRAINT "UniversityClass_departmentId_Department_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityClass" ADD CONSTRAINT "UniversityClass_facultyId_UniversityMember_id_fk" FOREIGN KEY ("facultyId") REFERENCES "public"."UniversityMember"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityCreditTransaction" ADD CONSTRAINT "UniversityCreditTransaction_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityInvitation" ADD CONSTRAINT "UniversityInvitation_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityInvoice" ADD CONSTRAINT "UniversityInvoice_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityJob" ADD CONSTRAINT "UniversityJob_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityMemberInvitation" ADD CONSTRAINT "UniversityMemberInvitation_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityMemberInvitation" ADD CONSTRAINT "UniversityMemberInvitation_invitedById_UniversityMember_id_fk" FOREIGN KEY ("invitedById") REFERENCES "public"."UniversityMember"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityMember" ADD CONSTRAINT "UniversityMember_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityMember" ADD CONSTRAINT "UniversityMember_departmentId_Department_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversityPayment" ADD CONSTRAINT "UniversityPayment_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversitySubmission" ADD CONSTRAINT "UniversitySubmission_assignmentId_UniversityAssignment_id_fk" FOREIGN KEY ("assignmentId") REFERENCES "public"."UniversityAssignment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversitySubmission" ADD CONSTRAINT "UniversitySubmission_studentLinkId_StudentUniversityLink_id_fk" FOREIGN KEY ("studentLinkId") REFERENCES "public"."StudentUniversityLink"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    ALTER TABLE "UniversitySubscription" ADD CONSTRAINT "UniversitySubscription_universityId_University_id_fk" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_account_providerId_accountId" ON "Account" USING btree ("providerId","accountId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "Account" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_feedback_userId" ON "Feedback" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_feedback_category" ON "Feedback" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_feedback_status" ON "Feedback" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notification_userId" ON "Notification" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notification_read" ON "Notification" USING btree ("read");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notification_platform" ON "Notification" USING btree ("platform");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "Session" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_token" ON "Session" USING btree ("token");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userSkill_userId_name" ON "UserSkill" USING btree ("userId","name");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userSkill_userId" ON "UserSkill" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userSkill_category" ON "UserSkill" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_username" ON "User" USING btree ("username");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "User" USING btree ("role");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_referralCode" ON "User" USING btree ("referralCode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "Verification" USING btree ("identifier");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_achievements_userId" ON "Achievements" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cert_userId" ON "Certifications" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_config_key" ON "Config" USING btree ("key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_newsletter_email" ON "Newsletter" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_newsletter_subscribedAt" ON "Newsletter" USING btree ("subscribedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_portfolio_userId" ON "PortfolioProject" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_portfolio_learnStepId" ON "PortfolioProject" USING btree ("learnStepId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_portfolio_source" ON "PortfolioProject" USING btree ("source");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_profileView_profileId" ON "ProfileView" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_profileView_viewerId" ON "ProfileView" USING btree ("viewerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_profileView_viewedAt" ON "ProfileView" USING btree ("viewedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectLink_projectId" ON "ProjectLink" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectMedia_projectId" ON "ProjectMedia" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recentActivity_userId" ON "RecentActivity" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_skillEndorse_skillId_endorserId" ON "SkillEndorsement" USING btree ("skillId","endorserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skillEndorse_skillId" ON "SkillEndorsement" USING btree ("skillId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skillEndorse_endorserId" ON "SkillEndorsement" USING btree ("endorserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_skills_userId" ON "Skills" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_socialLink_userId_platform" ON "SocialLink" USING btree ("userId","platform");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_socialLink_userId" ON "SocialLink" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_dsaTrack_userId_problemId" ON "UserDSATrackingEntry" USING btree ("userId","problemId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dsaTrack_userId" ON "UserDSATrackingEntry" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userEdu_userId" ON "UserEducation" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workExp_userId" ON "WorkExperience" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_level_level" ON "Level" USING btree ("level");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_socialConnection_userId_provider" ON "SocialConnection" USING btree ("userId","provider");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_socialConnection_userId" ON "SocialConnection" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_socialConnection_provider" ON "SocialConnection" USING btree ("provider");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userLevelProgress_userId_level" ON "UserLevelProgress" USING btree ("userId","level");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userLevelProgress_userId" ON "UserLevelProgress" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userLevelProgress_level" ON "UserLevelProgress" USING btree ("level");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_xpTransaction_userId" ON "XpTransaction" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_xpTransaction_createdAt" ON "XpTransaction" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_xpTransaction_type" ON "XpTransaction" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activityEntry_userId" ON "ActivityEntry" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activityEntry_dailyActivityId" ON "ActivityEntry" USING btree ("dailyActivityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activityEntry_activityType" ON "ActivityEntry" USING btree ("activityType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activityEntry_userId_createdAt" ON "ActivityEntry" USING btree ("userId","createdAt");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_dailyActivity_userId_date" ON "DailyActivity" USING btree ("userId","date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dailyActivity_userId" ON "DailyActivity" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dailyActivity_date" ON "DailyActivity" USING btree ("date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dailyActivity_userId_date" ON "DailyActivity" USING btree ("userId","date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dailyActivity_isStreakDay" ON "DailyActivity" USING btree ("isStreakDay");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_streakReward_userId_streakDays" ON "StreakReward" USING btree ("userId","streakDays");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_streakReward_userId" ON "StreakReward" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userAchievement_userId" ON "UserAchievement" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userAchievement_achievementType" ON "UserAchievement" USING btree ("achievementType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userStats_userId" ON "UserStats" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAccess_adminRole" ON "AdminAccess" USING btree ("adminRole");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAccess_status" ON "AdminAccess" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAccess_userId" ON "AdminAccess" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAuditLog_adminId" ON "AdminAuditLog" USING btree ("adminId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAuditLog_module" ON "AdminAuditLog" USING btree ("module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAuditLog_action" ON "AdminAuditLog" USING btree ("action");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAuditLog_createdAt" ON "AdminAuditLog" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminAuditLog_resourceType_resourceId" ON "AdminAuditLog" USING btree ("resourceType","resourceId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminDashboardStats_statType" ON "AdminDashboardStats" USING btree ("statType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminDashboardStats_lastUpdatedAt" ON "AdminDashboardStats" USING btree ("lastUpdatedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminInvitation_code" ON "AdminInvitation" USING btree ("code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminInvitation_email" ON "AdminInvitation" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminInvitation_status" ON "AdminInvitation" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminInvitation_expiresAt" ON "AdminInvitation" USING btree ("expiresAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminInvitation_createdById" ON "AdminInvitation" USING btree ("createdById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminNotification_adminId" ON "AdminNotification" USING btree ("adminId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminNotification_isRead" ON "AdminNotification" USING btree ("isRead");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminNotification_createdAt" ON "AdminNotification" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_adminSystemSettings_key" ON "AdminSystemSettings" USING btree ("key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "codeEvaluation_interviewId_idx" ON "CodeEvaluation" USING btree ("interviewId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "codeEvaluation_language_idx" ON "CodeEvaluation" USING btree ("language");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "codeEvaluation_isSubmitted_idx" ON "CodeEvaluation" USING btree ("isSubmitted");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coverLetter_userId_idx" ON "CoverLetter" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobInterviewAssistant_userId_idx" ON "JobInterviewAssistant" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobInterviewAssistant_searchHash_idx" ON "JobInterviewAssistant" USING btree ("searchHash");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobInterviewAssistant_isPublic_idx" ON "JobInterviewAssistant" USING btree ("isPublic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobInterviewAssistant_position_idx" ON "JobInterviewAssistant" USING btree ("position");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "questionAnswer_interviewId_questionText_language_key" ON "QuestionAnswer" USING btree ("interviewId","questionText","language");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questionAnswer_interviewId_idx" ON "QuestionAnswer" USING btree ("interviewId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questionAnswer_questionType_idx" ON "QuestionAnswer" USING btree ("questionType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "questionAnswer_language_idx" ON "QuestionAnswer" USING btree ("language");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resumeDraft_userId_idx" ON "ResumeDraft" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resumeDraft_shareSlug_idx" ON "ResumeDraft" USING btree ("shareSlug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resumeDraft_isPublic_idx" ON "ResumeDraft" USING btree ("isPublic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resumeTemplateGeneration_userId_idx" ON "ResumeTemplateGeneration" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resumeTemplateGeneration_templateId_idx" ON "ResumeTemplateGeneration" USING btree ("templateId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resumeTemplateGeneration_userId_templateId_idx" ON "ResumeTemplateGeneration" USING btree ("userId","templateId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "templatePurchase_buyerId_templateId_key" ON "TemplatePurchase" USING btree ("buyerId","templateId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "templatePurchase_buyerId_idx" ON "TemplatePurchase" USING btree ("buyerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "templatePurchase_templateId_idx" ON "TemplatePurchase" USING btree ("templateId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userQuestionResponse_interviewId_questionType_questionIndex_key" ON "UserQuestionResponse" USING btree ("interviewId","questionType","questionIndex");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "communityPostBookmark_postId_userId_key" ON "CommunityPostBookmark" USING btree ("postId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "communityPostBookmark_postId_idx" ON "CommunityPostBookmark" USING btree ("postId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "communityPostBookmark_userId_idx" ON "CommunityPostBookmark" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "communityPostBookmark_folder_idx" ON "CommunityPostBookmark" USING btree ("folder");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "mockInterviewBookmark_sessionId_userId_key" ON "MockInterviewBookmark" USING btree ("sessionId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mockInterviewBookmark_sessionId_idx" ON "MockInterviewBookmark" USING btree ("sessionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mockInterviewBookmark_userId_idx" ON "MockInterviewBookmark" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mockInterviewBookmark_folder_idx" ON "MockInterviewBookmark" USING btree ("folder");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "projectV2Bookmark_projectId_userId_key" ON "ProjectV2Bookmark" USING btree ("projectId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projectV2Bookmark_projectId_idx" ON "ProjectV2Bookmark" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projectV2Bookmark_userId_idx" ON "ProjectV2Bookmark" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projectV2Bookmark_folder_idx" ON "ProjectV2Bookmark" USING btree ("folder");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "follow_followerId_followingId_key" ON "Follow" USING btree ("followerId","followingId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follow_followerId_idx" ON "Follow" USING btree ("followerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follow_followingId_idx" ON "Follow" USING btree ("followingId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "followRequest_senderId_receiverId_key" ON "FollowRequest" USING btree ("senderId","receiverId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "followRequest_senderId_idx" ON "FollowRequest" USING btree ("senderId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "followRequest_receiverId_idx" ON "FollowRequest" USING btree ("receiverId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_company_slug" ON "Company" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_company_verificationStatus" ON "Company" USING btree ("verificationStatus");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_company_createdByUserId" ON "Company" USING btree ("createdByUserId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_companyFollower_userId_companyId" ON "CompanyFollower" USING btree ("userId","companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyFollower_userId" ON "CompanyFollower" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyFollower_companyId" ON "CompanyFollower" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvitation_email" ON "CompanyInvitation" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvitation_inviteCode" ON "CompanyInvitation" USING btree ("inviteCode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvitation_status" ON "CompanyInvitation" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvoice_companyId" ON "CompanyInvoice" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvoice_status" ON "CompanyInvoice" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvoice_invoiceNumber" ON "CompanyInvoice" USING btree ("invoiceNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyInvoice_invoiceDate" ON "CompanyInvoice" USING btree ("invoiceDate");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_companyMember_userId_companyId" ON "CompanyMember" USING btree ("userId","companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyMember_userId" ON "CompanyMember" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyMember_companyId" ON "CompanyMember" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyMember_email" ON "CompanyMember" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyMember_role" ON "CompanyMember" USING btree ("role");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyPayment_companyId" ON "CompanyPayment" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyPayment_subscriptionId" ON "CompanyPayment" USING btree ("subscriptionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyPayment_status" ON "CompanyPayment" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyPayment_dodoPaymentId" ON "CompanyPayment" USING btree ("dodoPaymentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companyPayment_dodoCheckoutSessionId" ON "CompanyPayment" USING btree ("dodoCheckoutSessionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companySubscription_companyId" ON "CompanySubscription" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companySubscription_status" ON "CompanySubscription" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_companySubscription_dodoSubscriptionId" ON "CompanySubscription" USING btree ("dodoSubscriptionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewProcessTemplate_style" ON "InterviewProcessTemplate" USING btree ("style");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewProcessTemplate_category" ON "InterviewProcessTemplate" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewProcessTemplate_isPublic" ON "InterviewProcessTemplate" USING btree ("isPublic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewProcessTemplate_usageCount" ON "InterviewProcessTemplate" USING btree ("usageCount");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_memberInvitation_email" ON "MemberInvitation" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_memberInvitation_inviteCode" ON "MemberInvitation" USING btree ("inviteCode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_memberInvitation_status" ON "MemberInvitation" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_memberInvitation_companyId" ON "MemberInvitation" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewPrepProgress_userId" ON "InterviewPrepProgress" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewProcess_companyId" ON "InterviewProcess" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewProcess_isDefault" ON "InterviewProcess" USING btree ("isDefault");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_interviewRound_processId_roundNumber" ON "InterviewRound" USING btree ("processId","roundNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewRound_processId" ON "InterviewRound" USING btree ("processId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_interviewRound_roundType" ON "InterviewRound" USING btree ("roundType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobMockSession_userId" ON "JobMockSession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobMockSession_jobId" ON "JobMockSession" USING btree ("jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobMockSession_companyId" ON "JobMockSession" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobMockSession_roundId" ON "JobMockSession" USING btree ("roundId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobMockSession_status" ON "JobMockSession" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobMockSession_conversationId" ON "JobMockSession" USING btree ("conversationId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_applicationActivity_applicationId" ON "ApplicationActivity" USING btree ("applicationId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_applicationActivity_userId" ON "ApplicationActivity" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_applicationActivity_activityType" ON "ApplicationActivity" USING btree ("activityType");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_jobApplication_jobId_userId" ON "JobApplication" USING btree ("jobId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobApplication_jobId" ON "JobApplication" USING btree ("jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobApplication_userId" ON "JobApplication" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobApplication_status" ON "JobApplication" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobApplication_reviewedById" ON "JobApplication" USING btree ("reviewedById");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_jobRecommendation_userId_jobId" ON "JobRecommendation" USING btree ("userId","jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobRecommendation_userId" ON "JobRecommendation" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobRecommendation_jobId" ON "JobRecommendation" USING btree ("jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobRecommendation_matchScore" ON "JobRecommendation" USING btree ("matchScore");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_companyId" ON "Job" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_slug" ON "Job" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_status" ON "Job" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_locationType" ON "Job" USING btree ("locationType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_employmentType" ON "Job" USING btree ("employmentType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_job_postedById" ON "Job" USING btree ("postedById");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_savedJob_userId_jobId" ON "SavedJob" USING btree ("userId","jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_savedJob_userId" ON "SavedJob" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_backgroundJob_jobId" ON "BackgroundJob" USING btree ("jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_backgroundJob_status" ON "BackgroundJob" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_backgroundJob_userId" ON "BackgroundJob" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditRequest_userId_idx" ON "CreditRequest" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditRequest_status_idx" ON "CreditRequest" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditRequest_createdAt_idx" ON "CreditRequest" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransaction_userId_idx" ON "CreditTransaction" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransaction_paymentId_idx" ON "CreditTransaction" USING btree ("paymentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransaction_createdAt_idx" ON "CreditTransaction" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransferOut_userId_idx" ON "CreditTransferOut" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransferOut_transferId_idx" ON "CreditTransferOut" USING btree ("transferId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransferOut_createdAt_idx" ON "CreditTransferOut" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransfer_senderId_idx" ON "CreditTransfer" USING btree ("senderId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "creditTransfer_receiverId_idx" ON "CreditTransfer" USING btree ("receiverId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "earning_userId_idx" ON "Earning" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "earning_module_idx" ON "Earning" USING btree ("module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "earning_referenceId_idx" ON "Earning" USING btree ("referenceId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "earning_userId_module_idx" ON "Earning" USING btree ("userId","module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_userId_idx" ON "Payment" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_status_idx" ON "Payment" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_orderId_idx" ON "Payment" USING btree ("orderId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_paymentId_idx" ON "Payment" USING btree ("paymentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_createdAt_idx" ON "Payment" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_referrerId_idx" ON "Referral" USING btree ("referrerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_referralCode_idx" ON "Referral" USING btree ("referralCode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subTransaction_module_idx" ON "SubTransaction" USING btree ("module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subTransaction_referenceId_idx" ON "SubTransaction" USING btree ("referenceId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subTransaction_module_referenceId_idx" ON "SubTransaction" USING btree ("module","referenceId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeApiRequest_profileId_idx" ON "KnowMeApiRequest" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeApiRequest_apiKey_idx" ON "KnowMeApiRequest" USING btree ("apiKey");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeApiRequest_createdAt_idx" ON "KnowMeApiRequest" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeChatMessage_sessionId_idx" ON "KnowMeChatMessage" USING btree ("sessionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeChatMessage_createdAt_idx" ON "KnowMeChatMessage" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeChatSession_profileId_idx" ON "KnowMeChatSession" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeChatSession_visitorUserId_idx" ON "KnowMeChatSession" USING btree ("visitorUserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeChatSession_sessionToken_idx" ON "KnowMeChatSession" USING btree ("sessionToken");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeChatSession_startedAt_idx" ON "KnowMeChatSession" USING btree ("startedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeCreditTransaction_userId_idx" ON "KnowMeCreditTransaction" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeCreditTransaction_createdAt_idx" ON "KnowMeCreditTransaction" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbeddingJob_profileId_idx" ON "KnowMeEmbeddingJob" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbeddingJob_status_idx" ON "KnowMeEmbeddingJob" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbeddingJob_scheduledFor_idx" ON "KnowMeEmbeddingJob" USING btree ("scheduledFor");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbedding_profileId_idx" ON "KnowMeEmbedding" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbedding_sourceType_idx" ON "KnowMeEmbedding" USING btree ("sourceType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbedding_vectorId_idx" ON "KnowMeEmbedding" USING btree ("vectorId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeEmbedding_isActive_idx" ON "KnowMeEmbedding" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "knowMeExternalData_profileId_connectionId_externalId_key" ON "KnowMeExternalData" USING btree ("profileId","connectionId","externalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeExternalData_profileId_idx" ON "KnowMeExternalData" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeExternalData_dataType_idx" ON "KnowMeExternalData" USING btree ("dataType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeExternalData_isActive_idx" ON "KnowMeExternalData" USING btree ("isActive");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePersonalData_profileId_idx" ON "KnowMePersonalData" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePersonalData_dataType_idx" ON "KnowMePersonalData" USING btree ("dataType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePersonalData_isActive_idx" ON "KnowMePersonalData" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "knowMePlatformConnection_profileId_platform_key" ON "KnowMePlatformConnection" USING btree ("profileId","platform");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePlatformConnection_profileId_idx" ON "KnowMePlatformConnection" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePlatformConnection_platform_idx" ON "KnowMePlatformConnection" USING btree ("platform");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePlatformConnection_connectionStatus_idx" ON "KnowMePlatformConnection" USING btree ("connectionStatus");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMePrivacySettings_profileId_idx" ON "KnowMePrivacySettings" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeProfileView_profileId_idx" ON "KnowMeProfileView" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeProfileView_viewerUserId_idx" ON "KnowMeProfileView" USING btree ("viewerUserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeProfileView_viewedAt_idx" ON "KnowMeProfileView" USING btree ("viewedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeProfile_userId_idx" ON "KnowMeProfile" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeProfile_status_idx" ON "KnowMeProfile" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeProfile_apiKey_idx" ON "KnowMeProfile" USING btree ("apiKey");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeQuestionAnalytics_profileId_idx" ON "KnowMeQuestionAnalytics" USING btree ("profileId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeQuestionAnalytics_questionCategory_idx" ON "KnowMeQuestionAnalytics" USING btree ("questionCategory");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeQuestionAnalytics_askedAt_idx" ON "KnowMeQuestionAnalytics" USING btree ("askedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "knowMeQuestionAnalytics_askedByUserId_idx" ON "KnowMeQuestionAnalytics" USING btree ("askedByUserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_category" ON "MockInterviewVoice" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_level" ON "MockInterviewVoice" USING btree ("level");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_isPublic" ON "MockInterviewVoice" USING btree ("isPublic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_isPredefined" ON "MockInterviewVoice" USING btree ("isPredefined");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_createdById" ON "MockInterviewVoice" USING btree ("createdById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_popularity" ON "MockInterviewVoice" USING btree ("popularity");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_universityId" ON "MockInterviewVoice" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockInterviewVoice_isUniversityMock" ON "MockInterviewVoice" USING btree ("isUniversityMock");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_mockVoiceRating_mockId_userId" ON "MockVoiceRating" USING btree ("mockId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceRating_mockId" ON "MockVoiceRating" USING btree ("mockId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceRating_userId" ON "MockVoiceRating" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceSession_mockId" ON "MockVoiceSession" USING btree ("mockId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceSession_userId" ON "MockVoiceSession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceSession_status" ON "MockVoiceSession" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceSession_conversationId" ON "MockVoiceSession" USING btree ("conversationId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_mockVoiceSession_scheduledFor" ON "MockVoiceSession" USING btree ("scheduledFor");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_practiceLeaderboard_userId_module" ON "PracticeLeaderboard" USING btree ("userId","module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceLeaderboard_module" ON "PracticeLeaderboard" USING btree ("module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceLeaderboard_module_rank" ON "PracticeLeaderboard" USING btree ("module","rank");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_practiceModuleProgress_userId_module" ON "PracticeModuleProgress" USING btree ("userId","module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceModuleProgress_userId" ON "PracticeModuleProgress" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceModuleProgress_module" ON "PracticeModuleProgress" USING btree ("module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceProblem_module_category" ON "PracticeProblem" USING btree ("module","category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceProblem_module_difficulty" ON "PracticeProblem" USING btree ("module","difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceProblem_slug" ON "PracticeProblem" USING btree ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_practiceUserSession_userId_problemId_mode" ON "PracticeUserSession" USING btree ("userId","problemId","mode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceUserSession_userId_module" ON "PracticeUserSession" USING btree ("userId","module");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceUserSession_userId_problemId" ON "PracticeUserSession" USING btree ("userId","problemId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceUserSession_userId_module_status" ON "PracticeUserSession" USING btree ("userId","module","status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentCertificate_userId" ON "AssessmentCertificate" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentCertificate_certificateId" ON "AssessmentCertificate" USING btree ("certificateId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_topicId" ON "AssessmentQuestion" USING btree ("topicId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_subModuleId" ON "AssessmentQuestion" USING btree ("subModuleId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_type" ON "AssessmentQuestion" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_mode" ON "AssessmentQuestion" USING btree ("mode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_difficulty" ON "AssessmentQuestion" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_isSeeded" ON "AssessmentQuestion" USING btree ("isSeeded");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentQuestion_isActive" ON "AssessmentQuestion" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_assessmentSubModule_topicId_slug" ON "AssessmentSubModule" USING btree ("topicId","slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentSubModule_topicId" ON "AssessmentSubModule" USING btree ("topicId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentSubModule_isActive" ON "AssessmentSubModule" USING btree ("isActive");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentTopic_language" ON "AssessmentTopic" USING btree ("language");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessmentTopic_isActive" ON "AssessmentTopic" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_examAnswer_attemptId_questionId" ON "ExamAnswer" USING btree ("attemptId","questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_examAnswer_attemptId" ON "ExamAnswer" USING btree ("attemptId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_examAnswer_questionId" ON "ExamAnswer" USING btree ("questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_examAttempt_userId" ON "ExamAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_examAttempt_topicId" ON "ExamAttempt" USING btree ("topicId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_examAttempt_status" ON "ExamAttempt" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_examAttempt_passed" ON "ExamAttempt" USING btree ("passed");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_practiceAnswer_attemptId_questionId" ON "PracticeAnswer" USING btree ("attemptId","questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceAnswer_attemptId" ON "PracticeAnswer" USING btree ("attemptId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceAnswer_questionId" ON "PracticeAnswer" USING btree ("questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceAttempt_userId" ON "PracticeAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceAttempt_topicId" ON "PracticeAttempt" USING btree ("topicId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceAttempt_subModuleId" ON "PracticeAttempt" USING btree ("subModuleId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_practiceAttempt_status" ON "PracticeAttempt" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_randomPracticeSession_userId" ON "RandomPracticeSession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_randomPracticeSession_status" ON "RandomPracticeSession" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_randomPracticeSession_createdAt" ON "RandomPracticeSession" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userAssessmentStats_userId" ON "UserAssessmentStats" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userExamSetAnswer_attemptId_questionId" ON "UserExamSetAnswer" USING btree ("attemptId","questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetAnswer_attemptId" ON "UserExamSetAnswer" USING btree ("attemptId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetAnswer_questionId" ON "UserExamSetAnswer" USING btree ("questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetAttempt_userId" ON "UserExamSetAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetAttempt_examSetId" ON "UserExamSetAttempt" USING btree ("examSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetAttempt_status" ON "UserExamSetAttempt" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetAttempt_passed" ON "UserExamSetAttempt" USING btree ("passed");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userExamSetLike_userId_examSetId" ON "UserExamSetLike" USING btree ("userId","examSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetLike_userId" ON "UserExamSetLike" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetLike_examSetId" ON "UserExamSetLike" USING btree ("examSetId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userExamSetPurchase_userId_examSetId" ON "UserExamSetPurchase" USING btree ("userId","examSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetPurchase_userId" ON "UserExamSetPurchase" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetPurchase_examSetId" ON "UserExamSetPurchase" USING btree ("examSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSetQuestion_examSetId" ON "UserExamSetQuestion" USING btree ("examSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSet_creatorId" ON "UserExamSet" USING btree ("creatorId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSet_language" ON "UserExamSet" USING btree ("language");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSet_isPublic" ON "UserExamSet" USING btree ("isPublic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSet_status" ON "UserExamSet" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userExamSet_createdAt" ON "UserExamSet" USING btree ("createdAt");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userPracticeSetAnswer_attemptId_questionId" ON "UserPracticeSetAnswer" USING btree ("attemptId","questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetAnswer_attemptId" ON "UserPracticeSetAnswer" USING btree ("attemptId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetAnswer_questionId" ON "UserPracticeSetAnswer" USING btree ("questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetAttempt_userId" ON "UserPracticeSetAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetAttempt_practiceSetId" ON "UserPracticeSetAttempt" USING btree ("practiceSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetAttempt_status" ON "UserPracticeSetAttempt" USING btree ("status");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userPracticeSetLike_userId_practiceSetId" ON "UserPracticeSetLike" USING btree ("userId","practiceSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetLike_userId" ON "UserPracticeSetLike" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetLike_practiceSetId" ON "UserPracticeSetLike" USING btree ("practiceSetId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userPracticeSetPurchase_userId_practiceSetId" ON "UserPracticeSetPurchase" USING btree ("userId","practiceSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetPurchase_userId" ON "UserPracticeSetPurchase" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetPurchase_practiceSetId" ON "UserPracticeSetPurchase" USING btree ("practiceSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSetQuestion_practiceSetId" ON "UserPracticeSetQuestion" USING btree ("practiceSetId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_creatorId" ON "UserPracticeSet" USING btree ("creatorId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_language" ON "UserPracticeSet" USING btree ("language");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_isPublic" ON "UserPracticeSet" USING btree ("isPublic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_status" ON "UserPracticeSet" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_createdAt" ON "UserPracticeSet" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_universityId" ON "UserPracticeSet" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_isUniversityAssessment" ON "UserPracticeSet" USING btree ("isUniversityAssessment");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userPracticeSet_isLiveSession" ON "UserPracticeSet" USING btree ("isLiveSession");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectCategory_slug" ON "ProjectCategory" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectCategory_orderIndex" ON "ProjectCategory" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectCategory_isActive" ON "ProjectCategory" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectIdeaUpvote_projectIdeaId_userId" ON "ProjectIdeaUpvote" USING btree ("projectIdeaId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdeaUpvote_projectIdeaId" ON "ProjectIdeaUpvote" USING btree ("projectIdeaId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdeaUpvote_userId" ON "ProjectIdeaUpvote" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_technology" ON "ProjectIdea" USING btree ("technology");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_status" ON "ProjectIdea" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_difficulty" ON "ProjectIdea" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_submittedById" ON "ProjectIdea" USING btree ("submittedById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_createdAt" ON "ProjectIdea" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_upvotes" ON "ProjectIdea" USING btree ("upvotes");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_hasBlueprintGenerated" ON "ProjectIdea" USING btree ("hasBlueprintGenerated");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_ideaType" ON "ProjectIdea" USING btree ("ideaType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectIdea_isPlatformCurated" ON "ProjectIdea" USING btree ("isPlatformCurated");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectTechnology_categoryId" ON "ProjectTechnology" USING btree ("categoryId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectTechnology_slug" ON "ProjectTechnology" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectTechnology_orderIndex" ON "ProjectTechnology" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectTechnology_isActive" ON "ProjectTechnology" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2ErrorVote_errorId_userId_voteType" ON "ProjectV2ErrorVote" USING btree ("errorId","userId","voteType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2ErrorVote_errorId" ON "ProjectV2ErrorVote" USING btree ("errorId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2ErrorVote_userId" ON "ProjectV2ErrorVote" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_projectId" ON "ProjectV2Error" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_taskId" ON "ProjectV2Error" USING btree ("taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_severity" ON "ProjectV2Error" USING btree ("severity");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_category" ON "ProjectV2Error" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_status" ON "ProjectV2Error" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_submittedById" ON "ProjectV2Error" USING btree ("submittedById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_helpfulCount" ON "ProjectV2Error" USING btree ("helpfulCount");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Error_createdAt" ON "ProjectV2Error" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2FeatureSuggestion_userId" ON "ProjectV2FeatureSuggestion" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2FeatureSuggestion_projectId" ON "ProjectV2FeatureSuggestion" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2FeatureSuggestion_status" ON "ProjectV2FeatureSuggestion" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2FeatureSuggestion_type" ON "ProjectV2FeatureSuggestion" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2FeatureSuggestion_suggestedBy" ON "ProjectV2FeatureSuggestion" USING btree ("suggestedBy");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2FeatureSuggestion_createdAt" ON "ProjectV2FeatureSuggestion" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2GlobalLeaderboard_rank" ON "ProjectV2GlobalLeaderboard" USING btree ("rank");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2GlobalLeaderboard_totalScore" ON "ProjectV2GlobalLeaderboard" USING btree ("totalScore");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2GlobalLeaderboard_averageScore" ON "ProjectV2GlobalLeaderboard" USING btree ("averageScore");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2GuidedSession_userId_projectId" ON "ProjectV2GuidedSession" USING btree ("userId","projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2GuidedSession_userId" ON "ProjectV2GuidedSession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2GuidedSession_projectId" ON "ProjectV2GuidedSession" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2GuidedSession_isActive" ON "ProjectV2GuidedSession" USING btree ("isActive");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2Invitation_projectId_invitedUserId" ON "ProjectV2Invitation" USING btree ("projectId","invitedUserId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2Invitation_projectId_invitedEmail" ON "ProjectV2Invitation" USING btree ("projectId","invitedEmail");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Invitation_projectId" ON "ProjectV2Invitation" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Invitation_invitedUserId" ON "ProjectV2Invitation" USING btree ("invitedUserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Invitation_invitedEmail" ON "ProjectV2Invitation" USING btree ("invitedEmail");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Invitation_inviteToken" ON "ProjectV2Invitation" USING btree ("inviteToken");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Invitation_status" ON "ProjectV2Invitation" USING btree ("status");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2Leaderboard_userId_projectId" ON "ProjectV2Leaderboard" USING btree ("userId","projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Leaderboard_projectId_rank" ON "ProjectV2Leaderboard" USING btree ("projectId","rank");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Leaderboard_projectId_score" ON "ProjectV2Leaderboard" USING btree ("projectId","score");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Leaderboard_userId" ON "ProjectV2Leaderboard" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2Member_projectId_userId" ON "ProjectV2Member" USING btree ("projectId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Member_projectId" ON "ProjectV2Member" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Member_userId" ON "ProjectV2Member" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2MockSession_userId" ON "ProjectV2MockSession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2MockSession_projectId" ON "ProjectV2MockSession" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2MockSession_sprintId" ON "ProjectV2MockSession" USING btree ("sprintId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2MockSession_status" ON "ProjectV2MockSession" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2MockSession_completedAt" ON "ProjectV2MockSession" USING btree ("completedAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2MockSession_sessionType" ON "ProjectV2MockSession" USING btree ("sessionType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Page_projectId" ON "ProjectV2Page" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Page_orderIndex" ON "ProjectV2Page" USING btree ("orderIndex");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2QuizAnswer_attemptId_questionId" ON "ProjectV2QuizAnswer" USING btree ("attemptId","questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAnswer_attemptId" ON "ProjectV2QuizAnswer" USING btree ("attemptId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAnswer_questionId" ON "ProjectV2QuizAnswer" USING btree ("questionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAnswer_isCorrect" ON "ProjectV2QuizAnswer" USING btree ("isCorrect");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2QuizAttempt_userId_quizId" ON "ProjectV2QuizAttempt" USING btree ("userId","quizId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAttempt_userId" ON "ProjectV2QuizAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAttempt_projectId" ON "ProjectV2QuizAttempt" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAttempt_quizId" ON "ProjectV2QuizAttempt" USING btree ("quizId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizAttempt_isCompleted" ON "ProjectV2QuizAttempt" USING btree ("isCompleted");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizQuestion_quizId" ON "ProjectV2QuizQuestion" USING btree ("quizId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizQuestion_orderIndex" ON "ProjectV2QuizQuestion" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2QuizQuestion_difficulty" ON "ProjectV2QuizQuestion" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Resource_userId" ON "ProjectV2Resource" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Resource_projectId" ON "ProjectV2Resource" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Resource_type" ON "ProjectV2Resource" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Resource_createdAt" ON "ProjectV2Resource" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Resource_helpfulCount" ON "ProjectV2Resource" USING btree ("helpfulCount");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2SprintSuggestion_projectId" ON "ProjectV2SprintSuggestion" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2SprintSuggestion_suggestedById" ON "ProjectV2SprintSuggestion" USING btree ("suggestedById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2SprintSuggestion_status" ON "ProjectV2SprintSuggestion" USING btree ("status");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2Sprint_projectId_sprintNumber" ON "ProjectV2Sprint" USING btree ("projectId","sprintNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Sprint_projectId" ON "ProjectV2Sprint" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Sprint_orderIndex" ON "ProjectV2Sprint" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Sprint_projectId_orderIndex" ON "ProjectV2Sprint" USING btree ("projectId","orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Sprint_createdBy" ON "ProjectV2Sprint" USING btree ("createdBy");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_projectV2StandupConfig_userId_projectId" ON "ProjectV2StandupConfig" USING btree ("userId","projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2StandupConfig_userId" ON "ProjectV2StandupConfig" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2StandupConfig_projectId" ON "ProjectV2StandupConfig" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2StandupConfig_isActive" ON "ProjectV2StandupConfig" USING btree ("isActive");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2StandupEntry_configId" ON "ProjectV2StandupEntry" USING btree ("configId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2StandupEntry_scheduledFor" ON "ProjectV2StandupEntry" USING btree ("scheduledFor");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2StandupEntry_status" ON "ProjectV2StandupEntry" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Submission_userId" ON "ProjectV2Submission" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Submission_projectId" ON "ProjectV2Submission" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Submission_status" ON "ProjectV2Submission" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2TaskDetail_taskId" ON "ProjectV2TaskDetail" USING btree ("taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Task_sprintId" ON "ProjectV2Task" USING btree ("sprintId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Task_orderIndex" ON "ProjectV2Task" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Task_difficulty" ON "ProjectV2Task" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Task_category" ON "ProjectV2Task" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Task_sprintId_orderIndex" ON "ProjectV2Task" USING btree ("sprintId","orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2Task_assessmentType" ON "ProjectV2Task" USING btree ("assessmentType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_createdBy" ON "ProjectV2" USING btree ("createdBy");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_visibility" ON "ProjectV2" USING btree ("visibility");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_difficulty" ON "ProjectV2" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_createdAt" ON "ProjectV2" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_slug" ON "ProjectV2" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_isPlatformSeeded" ON "ProjectV2" USING btree ("isPlatformSeeded");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_projectSource" ON "ProjectV2" USING btree ("projectSource");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_universityId" ON "ProjectV2" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_projectV2_isUniversityProject" ON "ProjectV2" USING btree ("isUniversityProject");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userProjectV2Progress_userId_projectId" ON "UserProjectV2Progress" USING btree ("userId","projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userProjectV2Progress_userId" ON "UserProjectV2Progress" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userProjectV2Progress_projectId" ON "UserProjectV2Progress" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userProjectV2Progress_status" ON "UserProjectV2Progress" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userProjectV2Progress_totalScore" ON "UserProjectV2Progress" USING btree ("totalScore");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userTaskV2Assessment_userId_taskId" ON "UserTaskV2Assessment" USING btree ("userId","taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Assessment_userId" ON "UserTaskV2Assessment" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Assessment_taskId" ON "UserTaskV2Assessment" USING btree ("taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Assessment_assessmentType" ON "UserTaskV2Assessment" USING btree ("assessmentType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Assessment_passed" ON "UserTaskV2Assessment" USING btree ("passed");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userTaskV2DetailAccess_userId_taskDetailId" ON "UserTaskV2DetailAccess" USING btree ("userId","taskDetailId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2DetailAccess_userId" ON "UserTaskV2DetailAccess" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2DetailAccess_taskDetailId" ON "UserTaskV2DetailAccess" USING btree ("taskDetailId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_userTaskV2Status_userId_taskId" ON "UserTaskV2Status" USING btree ("userId","taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Status_userId" ON "UserTaskV2Status" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Status_taskId" ON "UserTaskV2Status" USING btree ("taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Status_projectId" ON "UserTaskV2Status" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Status_progressId" ON "UserTaskV2Status" USING btree ("progressId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userTaskV2Status_status" ON "UserTaskV2Status" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_type" ON "OpenSourceProject" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_category" ON "OpenSourceProject" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_status" ON "OpenSourceProject" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_maintainerId" ON "OpenSourceProject" USING btree ("maintainerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_createdById" ON "OpenSourceProject" USING btree ("createdById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_slug" ON "OpenSourceProject" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_orderIndex" ON "OpenSourceProject" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osp_isFeatured" ON "OpenSourceProject" USING btree ("isFeatured");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osce_userId" ON "OSCertificationExam" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osce_status" ON "OSCertificationExam" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oscert_userId" ON "OSCertification" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oscert_certificateId" ON "OSCertification" USING btree ("certificateId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_projectId" ON "OSContribution" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_issueId" ON "OSContribution" USING btree ("issueId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_userId" ON "OSContribution" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_type" ON "OSContribution" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_status" ON "OSContribution" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_githubPrNumber" ON "OSContribution" USING btree ("githubPrNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osc_isMerged" ON "OSContribution" USING btree ("isMerged");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oset_userId" ON "OSEarningsTransaction" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oset_type" ON "OSEarningsTransaction" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oset_status" ON "OSEarningsTransaction" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osgh_githubUsername" ON "OSGitHubProfile" USING btree ("githubUsername");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osgh_githubId" ON "OSGitHubProfile" USING btree ("githubId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osi_projectId" ON "OSIssue" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osi_status" ON "OSIssue" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osi_difficulty" ON "OSIssue" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osi_assignedToId" ON "OSIssue" USING btree ("assignedToId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osi_githubIssueNumber" ON "OSIssue" USING btree ("githubIssueNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osi_orderIndex" ON "OSIssue" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osll_moduleId" ON "OSLearnLesson" USING btree ("moduleId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_osll_orderIndex" ON "OSLearnLesson" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslm_orderIndex" ON "OSLearnModule" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslm_isRequired" ON "OSLearnModule" USING btree ("isRequired");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_oslpcompl_userId_projectId" ON "OSLearnPracticeCompletion" USING btree ("userId","projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpcompl_userId" ON "OSLearnPracticeCompletion" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpcompl_projectId" ON "OSLearnPracticeCompletion" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpp_slug" ON "OSLearnPracticeProject" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpp_difficulty" ON "OSLearnPracticeProject" USING btree ("difficulty");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpp_orderIndex" ON "OSLearnPracticeProject" USING btree ("orderIndex");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslps_userId" ON "OSLearnPracticeSubmission" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslps_taskId" ON "OSLearnPracticeSubmission" USING btree ("taskId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpt_projectId" ON "OSLearnPracticeTask" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslpt_orderIndex" ON "OSLearnPracticeTask" USING btree ("orderIndex");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_oslp_userId_moduleId" ON "OSLearnProgress" USING btree ("userId","moduleId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslp_userId" ON "OSLearnProgress" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslp_moduleId" ON "OSLearnProgress" USING btree ("moduleId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_oslc_userId_lessonId" ON "OSLessonCompletion" USING btree ("userId","lessonId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslc_userId" ON "OSLessonCompletion" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_oslc_lessonId" ON "OSLessonCompletion" USING btree ("lessonId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ospc_projectId_userId" ON "OSProjectContributor" USING btree ("projectId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ospc_projectId" ON "OSProjectContributor" USING btree ("projectId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ospc_userId" ON "OSProjectContributor" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ospc_rank" ON "OSProjectContributor" USING btree ("rank");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ospl_projectId_userId" ON "OSProjectLeaderboard" USING btree ("projectId","userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ospl_projectId_rank" ON "OSProjectLeaderboard" USING btree ("projectId","rank");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uos_userId" ON "UserOSStats" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uos_globalRank" ON "UserOSStats" USING btree ("globalRank");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfcs_goalId" ON "PathfinderCodingSubmission" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfcs_userId" ON "PathfinderCodingSubmission" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfcs_problemId" ON "PathfinderCodingSubmission" USING btree ("problemId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_pfds_goalId_date" ON "PathfinderDailySession" USING btree ("goalId","date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfds_goalId" ON "PathfinderDailySession" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfds_userId" ON "PathfinderDailySession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfds_date" ON "PathfinderDailySession" USING btree ("date");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_pfgp_goalId_buyerId" ON "PathfinderGoalPurchase" USING btree ("goalId","buyerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgp_goalId" ON "PathfinderGoalPurchase" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgp_buyerId" ON "PathfinderGoalPurchase" USING btree ("buyerId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_pfgoal_userId_slug" ON "PathfinderGoal" USING btree ("userId","slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgoal_userId" ON "PathfinderGoal" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgoal_groupId" ON "PathfinderGoal" USING btree ("groupId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgoal_status" ON "PathfinderGoal" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgoal_category" ON "PathfinderGoal" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfgoal_createdAt" ON "PathfinderGoal" USING btree ("createdAt");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_pfg_userId_name" ON "PathfinderGroup" USING btree ("userId","name");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfg_userId" ON "PathfinderGroup" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfqa_goalId" ON "PathfinderQuizAttempt" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfqa_userId" ON "PathfinderQuizAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfqa_quizType" ON "PathfinderQuizAttempt" USING btree ("quizType");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfsg_goalId" ON "PathfinderSubGoal" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfsg_sessionId" ON "PathfinderSubGoal" USING btree ("sessionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfsg_status" ON "PathfinderSubGoal" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pful_goalId" ON "PathfinderUsageLedger" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pful_userId" ON "PathfinderUsageLedger" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pful_createdAt" ON "PathfinderUsageLedger" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pfv_goalId" ON "PathfinderVerification" USING btree ("goalId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_scm_studioId" ON "StudioChatMessage" USING btree ("studioId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_scb_studioId" ON "StudioCodeBlock" USING btree ("studioId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_scb_blockId" ON "StudioCodeBlock" USING btree ("blockId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sfd_studioId" ON "StudioFlashcardDeck" USING btree ("studioId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sfd_blockId" ON "StudioFlashcardDeck" USING btree ("blockId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sfs_deckId" ON "StudioFlashcardSession" USING btree ("deckId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sfs_userId" ON "StudioFlashcardSession" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_smb_studioId" ON "StudioMediaBlock" USING btree ("studioId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_smb_blockId" ON "StudioMediaBlock" USING btree ("blockId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sqa_quizId" ON "StudioQuizAttempt" USING btree ("quizId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sqa_userId" ON "StudioQuizAttempt" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sq_studioId" ON "StudioQuiz" USING btree ("studioId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sq_blockId" ON "StudioQuiz" USING btree ("blockId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ss_studioId_orderNumber" ON "StudioStep" USING btree ("studioId","orderNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ss_type" ON "StudioStep" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_studio_userId" ON "Studio" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_studio_category" ON "Studio" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_studio_visibility" ON "Studio" USING btree ("visibility");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_studio_source_sourceId" ON "Studio" USING btree ("source","sourceId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ce_classId_studentLinkId" ON "ClassEnrollment" USING btree ("classId","studentLinkId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ce_classId" ON "ClassEnrollment" USING btree ("classId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ce_studentLinkId" ON "ClassEnrollment" USING btree ("studentLinkId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_cul_companyId_universityId" ON "CompanyUniversityLink" USING btree ("companyId","universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cul_companyId" ON "CompanyUniversityLink" USING btree ("companyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cul_universityId" ON "CompanyUniversityLink" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cul_referredById" ON "CompanyUniversityLink" USING btree ("referredById");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_dept_universityId_name" ON "Department" USING btree ("universityId","name");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_dept_universityId_code" ON "Department" USING btree ("universityId","code");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dept_universityId" ON "Department" USING btree ("universityId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_sul_userId_universityId" ON "StudentUniversityLink" USING btree ("userId","universityId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_sul_universityId_universityEmail" ON "StudentUniversityLink" USING btree ("universityId","universityEmail");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_sul_universityId_rollNumber" ON "StudentUniversityLink" USING btree ("universityId","rollNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sul_userId" ON "StudentUniversityLink" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sul_universityId" ON "StudentUniversityLink" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sul_departmentId" ON "StudentUniversityLink" USING btree ("departmentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sul_verificationStatus" ON "StudentUniversityLink" USING btree ("verificationStatus");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uni_slug" ON "University" USING btree ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uni_emailDomain" ON "University" USING btree ("emailDomain");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uni_verificationStatus" ON "University" USING btree ("verificationStatus");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uni_createdByUserId" ON "University" USING btree ("createdByUserId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ua_classId" ON "UniversityAssignment" USING btree ("classId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ua_createdById" ON "UniversityAssignment" USING btree ("createdById");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ua_type" ON "UniversityAssignment" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ua_status" ON "UniversityAssignment" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ua_deadline" ON "UniversityAssignment" USING btree ("deadline");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_uc_universityId_code_academicYear_section" ON "UniversityClass" USING btree ("universityId","code","academicYear","section");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uc_universityId" ON "UniversityClass" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uc_departmentId" ON "UniversityClass" USING btree ("departmentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uc_facultyId" ON "UniversityClass" USING btree ("facultyId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uc_semester" ON "UniversityClass" USING btree ("semester");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uc_academicYear" ON "UniversityClass" USING btree ("academicYear");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uct_universityId" ON "UniversityCreditTransaction" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uct_type" ON "UniversityCreditTransaction" USING btree ("type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uct_createdAt" ON "UniversityCreditTransaction" USING btree ("createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uinv_email" ON "UniversityInvitation" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uinv_inviteCode" ON "UniversityInvitation" USING btree ("inviteCode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uinv_status" ON "UniversityInvitation" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uinvo_universityId" ON "UniversityInvoice" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uinvo_status" ON "UniversityInvoice" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uinvo_invoiceDate" ON "UniversityInvoice" USING btree ("invoiceDate");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_uj_jobId_universityId" ON "UniversityJob" USING btree ("jobId","universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uj_jobId" ON "UniversityJob" USING btree ("jobId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uj_universityId" ON "UniversityJob" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_uj_visibility" ON "UniversityJob" USING btree ("visibility");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_umi_email" ON "UniversityMemberInvitation" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_umi_inviteCode" ON "UniversityMemberInvitation" USING btree ("inviteCode");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_umi_status" ON "UniversityMemberInvitation" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_umi_universityId" ON "UniversityMemberInvitation" USING btree ("universityId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_um_userId_universityId" ON "UniversityMember" USING btree ("userId","universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_um_userId" ON "UniversityMember" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_um_universityId" ON "UniversityMember" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_um_departmentId" ON "UniversityMember" USING btree ("departmentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_um_email" ON "UniversityMember" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_um_role" ON "UniversityMember" USING btree ("role");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_upay_universityId" ON "UniversityPayment" USING btree ("universityId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_upay_status" ON "UniversityPayment" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_upay_dodoPaymentId" ON "UniversityPayment" USING btree ("dodoPaymentId");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_us_assignmentId_studentLinkId_attemptNumber" ON "UniversitySubmission" USING btree ("assignmentId","studentLinkId","attemptNumber");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_us_assignmentId" ON "UniversitySubmission" USING btree ("assignmentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_us_studentLinkId" ON "UniversitySubmission" USING btree ("studentLinkId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_us_status" ON "UniversitySubmission" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_us_mainPlatformSubmissionId" ON "UniversitySubmission" USING btree ("mainPlatformSubmissionId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_usub_plan" ON "UniversitySubscription" USING btree ("plan");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_usub_status" ON "UniversitySubscription" USING btree ("status");
