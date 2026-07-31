// Hand-matched to the referral landing.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-md space-y-6">
                <Shimmer className="mx-auto h-16 w-16 rounded-2xl" />
                <Shimmer className="mx-auto h-8 w-72" delay={0.06} />
                <Shimmer className="mx-auto h-4 w-full max-w-sm" delay={0.1} />
                <Shimmer className="h-11 w-full rounded-xl" delay={0.16} />
            </div>
        </div>
    );
}
