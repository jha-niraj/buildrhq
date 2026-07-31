// Hand-matched to the purchase confirmation.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-2xl space-y-6">
                <Shimmer className="mx-auto h-16 w-16 rounded-full" />
                <Shimmer className="mx-auto h-8 w-64" delay={0.06} />
                <Shimmer className="mx-auto h-4 w-full max-w-md" delay={0.1} />
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-between py-2">
                            <Shimmer className="h-4 w-28" delay={i * 0.05} />
                            <Shimmer className="h-4 w-20" delay={i * 0.05} />
                        </div>
                    ))}
                </div>
                <Shimmer className="h-11 w-full rounded-xl" delay={0.3} />
            </div>
        </div>
    );
}
