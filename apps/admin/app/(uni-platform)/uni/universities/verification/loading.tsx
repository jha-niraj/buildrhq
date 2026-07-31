// Hand-matched to the university verification queue.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="p-6">
            <ShimmerStyles />
            <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <Shimmer className="h-8 w-56" />
                    <Shimmer className="h-4 w-80" delay={0.06} />
                </div>
                <Shimmer className="h-10 w-36 rounded-xl" delay={0.12} />
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 p-4">
                        <Shimmer className="h-3.5 w-20" delay={i * 0.05} />
                        <Shimmer className="mt-2 h-7 w-16" delay={i * 0.05} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="flex items-start gap-3">
                            <Shimmer className="h-12 w-12 shrink-0 rounded-xl" delay={i * 0.05} />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Shimmer className="h-5 w-3/4" delay={i * 0.05} />
                                <Shimmer className="h-3.5 w-1/2" delay={i * 0.05} />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <Shimmer className="h-10 w-full rounded-lg" delay={i * 0.05} />
                            <Shimmer className="h-10 w-full rounded-lg" delay={i * 0.05} />
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
