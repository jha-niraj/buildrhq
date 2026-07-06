import { Suspense } from "react";
import { getSession } from '@repo/auth';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { getHomeData } from "@/actions/(main)/home/home.action";

import GreetingHeader from "./_components/greeting-header";
import ContinueLearning from "./_components/continue-learning";
import PathfinderGoalsCard from "./_components/pathfinder-goals-card";
import ActivityCalendar from "./_components/activity-calendar";
import ProjectsPreview from "./_components/projects-preview";
import MockVoicePreview from "./_components/mock-voice-preview";

import {
    GreetingHeaderSkeleton, ContinueLearningSkeleton, PathfinderGoalsSkeleton,
    ActivityCalendarSkeleton, ProjectsPreviewSkeleton, MockVoicePreviewSkeleton,
} from "./_components/skeletons";

export const metadata = {
    title: "Home | BuildrHQ",
    description: "Your personalized learning dashboard",
};

export default async function HomePage() {
    const session = await getSession(headers());
    if (!session?.user?.id) redirect("/login");

    const homeDataResult = await getHomeData();

    if (!homeDataResult.success || !homeDataResult.data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">Failed to load home data</p>
            </div>
        );
    }

    const {
        user, inProgressProjects, recentStudios, pathfinderGoals,
        activityCalendar, recentMockSessions,
    } = homeDataResult.data;

    const hasContinueLearning = inProgressProjects.length > 0 || recentStudios.length > 0;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4 pb-10">

            {/* ── Greeting header ── */}
            <Suspense fallback={<GreetingHeaderSkeleton />}>
                <GreetingHeader user={user} />
            </Suspense>

            <div className="space-y-4">
                {/* ── Continue Learning (full width, only when items exist) ── */}
                {hasContinueLearning && (
                    <Suspense fallback={<ContinueLearningSkeleton />}>
                        <ContinueLearning
                            projects={inProgressProjects}
                            studios={recentStudios}
                        />
                    </Suspense>
                )}

                {/* ── Activity calendar (full width) ── */}
                <Suspense fallback={<ActivityCalendarSkeleton />}>
                    <ActivityCalendar data={activityCalendar} />
                </Suspense>

                {/* ── Three action cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Suspense fallback={<PathfinderGoalsSkeleton />}>
                        <PathfinderGoalsCard goals={pathfinderGoals} />
                    </Suspense>
                    <Suspense fallback={<ProjectsPreviewSkeleton />}>
                        <ProjectsPreview projects={inProgressProjects} />
                    </Suspense>
                    <Suspense fallback={<MockVoicePreviewSkeleton />}>
                        <MockVoicePreview sessions={recentMockSessions} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
