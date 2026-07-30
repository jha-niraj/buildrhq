import {
    HomeDashboardSkeleton, ContinueLearningSkeleton, ActivityCalendarSkeleton,
} from "./_components/skeletons";

// Mirrors the real page: the analytics dashboard, then the two surfaces below it.
// Deliberately a SKELETON rather than the full-page BuildrHQLoader — the sidebar is
// already painted around this, so previewing the layout beats a centred spinner.
export default function HomeLoading() {
    return (
        <div className="w-full pb-4">
            <div className="mx-auto w-full px-4 pt-6 pb-10 sm:px-6 lg:px-8">
                <HomeDashboardSkeleton />
            </div>
            <div className="mx-auto w-full space-y-4 px-4 pb-10 sm:px-6 lg:px-8">
                <ContinueLearningSkeleton />
                <ActivityCalendarSkeleton />
            </div>
        </div>
    );
}
