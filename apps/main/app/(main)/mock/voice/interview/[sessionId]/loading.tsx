// Hand-matched to the live voice interview.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-xl space-y-6">
                <Shimmer className="mx-auto h-28 w-28 rounded-full" />
                <Shimmer className="mx-auto h-6 w-56" delay={0.08} />
                <Shimmer className="mx-auto h-4 w-full max-w-sm" delay={0.12} />
                <div className="flex justify-center gap-4 pt-4">
                    <Shimmer className="h-14 w-14 rounded-full" delay={0.18} />
                    <Shimmer className="h-14 w-14 rounded-full" delay={0.21} />
                </div>
            </div>
        </div>
    );
}
