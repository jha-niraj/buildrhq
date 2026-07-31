// Reuses the exact skeleton KnowMe settings already renders while its own data
// resolves, the same way /profile does. Two hand-written copies of a layout drift
// the moment the page changes; one definition cannot. Placeholder counts here are
// therefore always whatever the component itself decided to show.
import SettingsSkeleton from "./_components/settings-skeleton";

export default function Loading() {
    return <SettingsSkeleton />;
}
