// Reuses the exact skeleton the KnowMe onboarding wizard already renders while its own data
// resolves, the same way /profile does. Two hand-written copies of a layout drift
// the moment the page changes; one definition cannot. Placeholder counts here are
// therefore always whatever the component itself decided to show.
import OnboardingSkeleton from "./_components/onboarding-skeleton";

export default function Loading() {
    return <OnboardingSkeleton />;
}
