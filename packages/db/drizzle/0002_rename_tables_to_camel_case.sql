-- Rename every physical table from PascalCase to camelCase.
--
-- Only the physical names change. The Drizzle variable names (`users`,
-- `projectsV2`, ...) and every column name are untouched, so no application
-- code changes with this migration -- app code never names a table as a string,
-- it always goes through the table object.
--
-- Three things ride along with the table rename, because Postgres does NOT
-- rename them for you and leaving them behind would make `\d` output and any
-- future `drizzle-kit push`/`introspect` disagree with the schema:
--
--   * constraints  -- "Session_userId_User_id_fk" -> "session_userId_user_id_fk"
--   * indexes      -- only the constraint-backed ones are PascalCase; the
--                     hand-named "idx_*"/"uq_*" ones are already lowercase and
--                     are deliberately left alone.
--   * sequences    -- "Level_id_seq" -> "level_id_seq"
--
-- Constraint/index/sequence names are remapped SEGMENT-WISE: the name is split
-- on "_" and only whole segments that are exactly an old table name are
-- rewritten. That distinction matters -- a blind text replace of "User" would
-- also have to reason about the "userId" column sitting next to it in
-- "Session_userId_User_id_fk". No table name contains an underscore, so a
-- segment can never straddle a boundary.
--
-- The 26 tables that exist in the database but not in the Drizzle schema
-- (Community*, Conversation, ChatMessage, Badge, ...) are NOT in the map below
-- and keep their PascalCase names. That is intentional: they are dead tables
-- pending deletion, and the casing now marks them as "not part of the schema".
-- Their foreign keys INTO renamed tables are still fixed up, so nothing dangles.
--
-- Everything is guarded (rename only when the old name is present and the new
-- name is free), so this is safe to re-run and safe against a database that was
-- already partially renamed. The whole thing is one DO block, which Postgres
-- executes as a single statement -- so it either fully applies or fully rolls
-- back. There is no half-renamed outcome.
DO $$
DECLARE
    r        record;
    newname  text;
BEGIN
    DROP TABLE IF EXISTS pg_temp._rename_map;
    CREATE TEMP TABLE _rename_map (old_name text PRIMARY KEY, new_name text NOT NULL);
    INSERT INTO _rename_map (old_name, new_name) VALUES
        ('Account', 'account'),
        ('Achievements', 'achievements'),
        ('ActivityEntry', 'activityEntry'),
        ('AdminAccess', 'adminAccess'),
        ('AdminAuditLog', 'adminAuditLog'),
        ('AdminDashboardStats', 'adminDashboardStats'),
        ('AdminInvitation', 'adminInvitation'),
        ('AdminNotification', 'adminNotification'),
        ('AdminSystemSettings', 'adminSystemSettings'),
        ('ApplicationActivity', 'applicationActivity'),
        ('AssessmentCertificate', 'assessmentCertificate'),
        ('AssessmentQuestion', 'assessmentQuestion'),
        ('AssessmentSubModule', 'assessmentSubModule'),
        ('AssessmentTopic', 'assessmentTopic'),
        ('BackgroundJob', 'backgroundJob'),
        ('Certifications', 'certifications'),
        ('ClassEnrollment', 'classEnrollment'),
        ('CodeEvaluation', 'codeEvaluation'),
        ('Comment', 'comment'),
        ('CommunityPostBookmark', 'communityPostBookmark'),
        ('Company', 'company'),
        ('CompanyFollower', 'companyFollower'),
        ('CompanyInvitation', 'companyInvitation'),
        ('CompanyInvoice', 'companyInvoice'),
        ('CompanyMember', 'companyMember'),
        ('CompanyPayment', 'companyPayment'),
        ('CompanySubscription', 'companySubscription'),
        ('CompanyUniversityLink', 'companyUniversityLink'),
        ('Config', 'config'),
        ('CoverLetter', 'coverLetter'),
        ('CreditRequest', 'creditRequest'),
        ('CreditTransaction', 'creditTransaction'),
        ('CreditTransfer', 'creditTransfer'),
        ('CreditTransferOut', 'creditTransferOut'),
        ('DailyActivity', 'dailyActivity'),
        ('Department', 'department'),
        ('Earning', 'earning'),
        ('ExamAnswer', 'examAnswer'),
        ('ExamAttempt', 'examAttempt'),
        ('Feedback', 'feedback'),
        ('Follow', 'follow'),
        ('FollowRequest', 'followRequest'),
        ('InterviewPlanPurchase', 'interviewPlanPurchase'),
        ('InterviewPrepProgress', 'interviewPrepProgress'),
        ('InterviewProcess', 'interviewProcess'),
        ('InterviewProcessTemplate', 'interviewProcessTemplate'),
        ('InterviewRound', 'interviewRound'),
        ('Job', 'job'),
        ('JobApplication', 'jobApplication'),
        ('JobInterviewAssistant', 'jobInterviewAssistant'),
        ('JobMockSession', 'jobMockSession'),
        ('JobRecommendation', 'jobRecommendation'),
        ('KnowMeApiRequest', 'knowMeApiRequest'),
        ('KnowMeChatMessage', 'knowMeChatMessage'),
        ('KnowMeChatSession', 'knowMeChatSession'),
        ('KnowMeCreditTransaction', 'knowMeCreditTransaction'),
        ('KnowMeEmbedding', 'knowMeEmbedding'),
        ('KnowMeEmbeddingJob', 'knowMeEmbeddingJob'),
        ('KnowMeExternalData', 'knowMeExternalData'),
        ('KnowMePersonalData', 'knowMePersonalData'),
        ('KnowMePlatformConnection', 'knowMePlatformConnection'),
        ('KnowMePrivacySettings', 'knowMePrivacySettings'),
        ('KnowMeProfile', 'knowMeProfile'),
        ('KnowMeProfileView', 'knowMeProfileView'),
        ('KnowMeQuestionAnalytics', 'knowMeQuestionAnalytics'),
        ('Level', 'level'),
        ('MemberInvitation', 'memberInvitation'),
        ('MockInterviewBookmark', 'mockInterviewBookmark'),
        ('MockInterviewVoice', 'mockInterviewVoice'),
        ('MockVoiceRating', 'mockVoiceRating'),
        ('MockVoiceSession', 'mockVoiceSession'),
        ('Newsletter', 'newsletter'),
        ('Notification', 'notification'),
        ('OSCertification', 'osCertification'),
        ('OSCertificationExam', 'osCertificationExam'),
        ('OSContribution', 'osContribution'),
        ('OSEarningsTransaction', 'osEarningsTransaction'),
        ('OSGitHubProfile', 'osGitHubProfile'),
        ('OSIssue', 'osIssue'),
        ('OSLearnLesson', 'osLearnLesson'),
        ('OSLearnModule', 'osLearnModule'),
        ('OSLearnPracticeCompletion', 'osLearnPracticeCompletion'),
        ('OSLearnPracticeProject', 'osLearnPracticeProject'),
        ('OSLearnPracticeSubmission', 'osLearnPracticeSubmission'),
        ('OSLearnPracticeTask', 'osLearnPracticeTask'),
        ('OSLearnProgress', 'osLearnProgress'),
        ('OSLessonCompletion', 'osLessonCompletion'),
        ('OSProjectContributor', 'osProjectContributor'),
        ('OSProjectLeaderboard', 'osProjectLeaderboard'),
        ('OSProjectSetupGuide', 'osProjectSetupGuide'),
        ('OpenSourceProject', 'openSourceProject'),
        ('PathfinderCodingSubmission', 'pathfinderCodingSubmission'),
        ('PathfinderDailySession', 'pathfinderDailySession'),
        ('PathfinderGoal', 'pathfinderGoal'),
        ('PathfinderGoalPurchase', 'pathfinderGoalPurchase'),
        ('PathfinderGroup', 'pathfinderGroup'),
        ('PathfinderQuizAttempt', 'pathfinderQuizAttempt'),
        ('PathfinderSubGoal', 'pathfinderSubGoal'),
        ('PathfinderUsageLedger', 'pathfinderUsageLedger'),
        ('PathfinderVerification', 'pathfinderVerification'),
        ('Payment', 'payment'),
        ('PortfolioProject', 'portfolioProject'),
        ('PracticeAnswer', 'practiceAnswer'),
        ('PracticeAttempt', 'practiceAttempt'),
        ('PracticeLeaderboard', 'practiceLeaderboard'),
        ('PracticeModuleProgress', 'practiceModuleProgress'),
        ('PracticeProblem', 'practiceProblem'),
        ('PracticeUserSession', 'practiceUserSession'),
        ('ProfileView', 'profileView'),
        ('ProjectCategory', 'projectCategory'),
        ('ProjectIdea', 'projectIdea'),
        ('ProjectIdeaUpvote', 'projectIdeaUpvote'),
        ('ProjectLink', 'projectLink'),
        ('ProjectMedia', 'projectMedia'),
        ('ProjectTechnology', 'projectTechnology'),
        ('ProjectV2', 'projectV2'),
        ('ProjectV2Bookmark', 'projectV2Bookmark'),
        ('ProjectV2Error', 'projectV2Error'),
        ('ProjectV2ErrorVote', 'projectV2ErrorVote'),
        ('ProjectV2FeatureSuggestion', 'projectV2FeatureSuggestion'),
        ('ProjectV2GlobalLeaderboard', 'projectV2GlobalLeaderboard'),
        ('ProjectV2GuidedSession', 'projectV2GuidedSession'),
        ('ProjectV2Invitation', 'projectV2Invitation'),
        ('ProjectV2KnowledgeBase', 'projectV2KnowledgeBase'),
        ('ProjectV2Leaderboard', 'projectV2Leaderboard'),
        ('ProjectV2Member', 'projectV2Member'),
        ('ProjectV2MockSession', 'projectV2MockSession'),
        ('ProjectV2Page', 'projectV2Page'),
        ('ProjectV2Quiz', 'projectV2Quiz'),
        ('ProjectV2QuizAnswer', 'projectV2QuizAnswer'),
        ('ProjectV2QuizAttempt', 'projectV2QuizAttempt'),
        ('ProjectV2QuizQuestion', 'projectV2QuizQuestion'),
        ('ProjectV2Resource', 'projectV2Resource'),
        ('ProjectV2Sprint', 'projectV2Sprint'),
        ('ProjectV2SprintSuggestion', 'projectV2SprintSuggestion'),
        ('ProjectV2StandupConfig', 'projectV2StandupConfig'),
        ('ProjectV2StandupEntry', 'projectV2StandupEntry'),
        ('ProjectV2Submission', 'projectV2Submission'),
        ('ProjectV2Task', 'projectV2Task'),
        ('ProjectV2TaskDetail', 'projectV2TaskDetail'),
        ('QuestionAnswer', 'questionAnswer'),
        ('RandomPracticeSession', 'randomPracticeSession'),
        ('RecentActivity', 'recentActivity'),
        ('Referral', 'referral'),
        ('ResumeDraft', 'resumeDraft'),
        ('ResumeTemplate', 'resumeTemplate'),
        ('ResumeTemplateGeneration', 'resumeTemplateGeneration'),
        ('Reward', 'reward'),
        ('SavedJob', 'savedJob'),
        ('Session', 'session'),
        ('SkillEndorsement', 'skillEndorsement'),
        ('Skills', 'skills'),
        ('SocialConnection', 'socialConnection'),
        ('SocialLink', 'socialLink'),
        ('StreakReward', 'streakReward'),
        ('StudentUniversityLink', 'studentUniversityLink'),
        ('Studio', 'studio'),
        ('StudioChatMessage', 'studioChatMessage'),
        ('StudioCodeBlock', 'studioCodeBlock'),
        ('StudioFlashcardDeck', 'studioFlashcardDeck'),
        ('StudioFlashcardSession', 'studioFlashcardSession'),
        ('StudioMediaBlock', 'studioMediaBlock'),
        ('StudioQuiz', 'studioQuiz'),
        ('StudioQuizAttempt', 'studioQuizAttempt'),
        ('StudioStep', 'studioStep'),
        ('SubTransaction', 'subTransaction'),
        ('TemplatePurchase', 'templatePurchase'),
        ('University', 'university'),
        ('UniversityAssignment', 'universityAssignment'),
        ('UniversityClass', 'universityClass'),
        ('UniversityCreditTransaction', 'universityCreditTransaction'),
        ('UniversityInvitation', 'universityInvitation'),
        ('UniversityInvoice', 'universityInvoice'),
        ('UniversityJob', 'universityJob'),
        ('UniversityMember', 'universityMember'),
        ('UniversityMemberInvitation', 'universityMemberInvitation'),
        ('UniversityPayment', 'universityPayment'),
        ('UniversitySubmission', 'universitySubmission'),
        ('UniversitySubscription', 'universitySubscription'),
        ('User', 'user'),
        ('UserAchievement', 'userAchievement'),
        ('UserAssessmentStats', 'userAssessmentStats'),
        ('UserDSATrackingEntry', 'userDSATrackingEntry'),
        ('UserEducation', 'userEducation'),
        ('UserExamSet', 'userExamSet'),
        ('UserExamSetAnswer', 'userExamSetAnswer'),
        ('UserExamSetAttempt', 'userExamSetAttempt'),
        ('UserExamSetLike', 'userExamSetLike'),
        ('UserExamSetPurchase', 'userExamSetPurchase'),
        ('UserExamSetQuestion', 'userExamSetQuestion'),
        ('UserLevelProgress', 'userLevelProgress'),
        ('UserOSStats', 'userOSStats'),
        ('UserPracticeSet', 'userPracticeSet'),
        ('UserPracticeSetAnswer', 'userPracticeSetAnswer'),
        ('UserPracticeSetAttempt', 'userPracticeSetAttempt'),
        ('UserPracticeSetLike', 'userPracticeSetLike'),
        ('UserPracticeSetPurchase', 'userPracticeSetPurchase'),
        ('UserPracticeSetQuestion', 'userPracticeSetQuestion'),
        ('UserProfile', 'userProfile'),
        ('UserProjectV2Progress', 'userProjectV2Progress'),
        ('UserQuestionResponse', 'userQuestionResponse'),
        ('UserSkill', 'userSkill'),
        ('UserStats', 'userStats'),
        ('UserTaskV2Assessment', 'userTaskV2Assessment'),
        ('UserTaskV2DetailAccess', 'userTaskV2DetailAccess'),
        ('UserTaskV2Status', 'userTaskV2Status'),
        ('Verification', 'verification'),
        ('WorkExperience', 'workExperience'),
        ('XpTransaction', 'xpTransaction');

    ---------------------------------------------------------------------------
    -- 1. Tables
    ---------------------------------------------------------------------------
    FOR r IN
        SELECT m.old_name, m.new_name
        FROM _rename_map m
        JOIN pg_class c     ON c.relname = m.old_name AND c.relkind = 'r'
        JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
        WHERE NOT EXISTS (
            SELECT 1 FROM pg_class c2
            JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
            WHERE n2.nspname = 'public' AND c2.relname = m.new_name
        )
    LOOP
        EXECUTE format('ALTER TABLE public.%I RENAME TO %I', r.old_name, r.new_name);
    END LOOP;

    ---------------------------------------------------------------------------
    -- 2. Constraints (primary keys, uniques, foreign keys)
    ---------------------------------------------------------------------------
    FOR r IN
        SELECT c.conname, t.relname AS tbl
        FROM pg_constraint c
        JOIN pg_class t     ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace AND n.nspname = 'public'
        WHERE c.conname ~ '^[A-Z]'
    LOOP
        SELECT string_agg(COALESCE(m.new_name, p.part), '_' ORDER BY p.ord)
          INTO newname
          FROM unnest(string_to_array(r.conname, '_')) WITH ORDINALITY AS p(part, ord)
          LEFT JOIN _rename_map m ON m.old_name = p.part;

        CONTINUE WHEN newname IS NULL OR newname = r.conname;

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint c2
            JOIN pg_class t2     ON t2.oid = c2.conrelid
            JOIN pg_namespace n2 ON n2.oid = t2.relnamespace AND n2.nspname = 'public'
            WHERE c2.conname = newname AND t2.relname = r.tbl
        ) THEN
            EXECUTE format('ALTER TABLE public.%I RENAME CONSTRAINT %I TO %I',
                           r.tbl, r.conname, newname);
        END IF;
    END LOOP;

    ---------------------------------------------------------------------------
    -- 3. Any index still PascalCase after step 2
    --    (renaming a constraint renames its backing index, so this normally
    --     finds nothing -- it is here so a partially-renamed database converges.)
    ---------------------------------------------------------------------------
    FOR r IN
        SELECT c.relname
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
        WHERE c.relkind = 'i' AND c.relname ~ '^[A-Z]'
    LOOP
        SELECT string_agg(COALESCE(m.new_name, p.part), '_' ORDER BY p.ord)
          INTO newname
          FROM unnest(string_to_array(r.relname, '_')) WITH ORDINALITY AS p(part, ord)
          LEFT JOIN _rename_map m ON m.old_name = p.part;

        CONTINUE WHEN newname IS NULL OR newname = r.relname;

        IF NOT EXISTS (
            SELECT 1 FROM pg_class c2
            JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
            WHERE n2.nspname = 'public' AND c2.relname = newname
        ) THEN
            EXECUTE format('ALTER INDEX public.%I RENAME TO %I', r.relname, newname);
        END IF;
    END LOOP;

    ---------------------------------------------------------------------------
    -- 4. Sequences ("Level_id_seq" -> "level_id_seq")
    ---------------------------------------------------------------------------
    FOR r IN
        SELECT c.relname
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
        WHERE c.relkind = 'S' AND c.relname ~ '^[A-Z]'
    LOOP
        SELECT string_agg(COALESCE(m.new_name, p.part), '_' ORDER BY p.ord)
          INTO newname
          FROM unnest(string_to_array(r.relname, '_')) WITH ORDINALITY AS p(part, ord)
          LEFT JOIN _rename_map m ON m.old_name = p.part;

        CONTINUE WHEN newname IS NULL OR newname = r.relname;

        IF NOT EXISTS (
            SELECT 1 FROM pg_class c2
            JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
            WHERE n2.nspname = 'public' AND c2.relname = newname
        ) THEN
            EXECUTE format('ALTER SEQUENCE public.%I RENAME TO %I', r.relname, newname);
        END IF;
    END LOOP;

    DROP TABLE IF EXISTS pg_temp._rename_map;
END $$;
