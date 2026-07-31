// Hand-matched: reuses the exact same ProfileSkeleton the client renders while its
// data resolves, so the route transition and the loading state are pixel-identical
// and the page only paints once.
import { ProfileSkeleton } from "./_components/profile-skeleton";

export default function Loading() {
    return <ProfileSkeleton />;
}
