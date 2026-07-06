import {
    GreetingHeaderSkeleton, ContinueLearningSkeleton, PathfinderGoalsSkeleton,
    ActivityCalendarSkeleton, ProjectsPreviewSkeleton, MockVoicePreviewSkeleton,
} from "./_components/skeletons";

export default function HomeLoading() {
    return (
        <div className="w-full min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                <GreetingHeaderSkeleton />
                <ContinueLearningSkeleton />
                <ActivityCalendarSkeleton />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PathfinderGoalsSkeleton />
                    <ProjectsPreviewSkeleton />
                    <MockVoicePreviewSkeleton />
                </div>
            </div>
        </div>
    );
}
