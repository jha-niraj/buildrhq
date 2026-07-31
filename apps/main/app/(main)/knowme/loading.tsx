// Reuses the exact skeleton the KnowMe dashboard already renders while its own data
// resolves, the same way /profile does. Two hand-written copies of a layout drift
// the moment the page changes; one definition cannot. Placeholder counts here are
// therefore always whatever the component itself decided to show.
import KnowMeDashboardSkeleton from "./_components/knowme-dashboard-skeleton";

export default function Loading() {
    return <KnowMeDashboardSkeleton />;
}
