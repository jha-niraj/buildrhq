// Hand-matched to help: same wrapper, grids and card chrome as the real page.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="min-h-full p-6 lg:p-8">
            <ShimmerStyles />
            <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <Shimmer className="h-8 w-56" />
                    <Shimmer className="h-4 w-80" delay={0.06} />
                </div>
                <Shimmer className="h-10 w-36 rounded-xl" delay={0.12} />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
                        <Shimmer className="h-11 w-11 rounded-xl" delay={i * 0.05} />
                        <Shimmer className="mt-4 h-5 w-3/4" delay={i * 0.05} />
                        <Shimmer className="mt-2 h-4 w-full" delay={i * 0.05} />
                        <Shimmer className="mt-1.5 h-4 w-2/3" delay={i * 0.05} />
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
                        <Shimmer className="h-4 w-2/3" delay={i * 0.05} />
                        <Shimmer className="h-4 w-4 rounded" delay={i * 0.05} />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
