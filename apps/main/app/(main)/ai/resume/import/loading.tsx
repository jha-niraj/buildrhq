// Hand-matched to the resume import flow.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-2xl space-y-6">
                <Shimmer className="mx-auto h-8 w-56" />
                <Shimmer className="mx-auto h-4 w-full max-w-md" delay={0.06} />
                <Shimmer className="h-40 w-full rounded-2xl" delay={0.12} />
                <div className="grid grid-cols-2 gap-4">
                    <Shimmer className="h-11 w-full rounded-xl" delay={0.18} />
                    <Shimmer className="h-11 w-full rounded-xl" delay={0.2} />
                </div>
            </div>
        </div>
    );
}
