// Hand-matched to the companies table.
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

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 p-4">
                        <Shimmer className="h-3.5 w-20" delay={i * 0.05} />
                        <Shimmer className="mt-2 h-7 w-16" delay={i * 0.05} />
                    </div>
                ))}
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <Shimmer className="h-10 flex-1 rounded-lg" />
                <Shimmer className="h-10 w-full rounded-lg sm:w-44" delay={0.06} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex gap-4 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Shimmer key={i} className="h-4 flex-1" delay={i * 0.05} />
                    ))}
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Shimmer key={j} className="h-4 flex-1" delay={i * 0.03} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <Shimmer className="h-3.5 w-40" />
                    <Shimmer className="h-8 w-28 rounded-lg" />
                </div>
            </div>
            </div>
        </div>
    );
}
