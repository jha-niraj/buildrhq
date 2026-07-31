// Hand-matched to job-applications-content.tsx — same wrapper, same grids, same card chrome, so
// nothing reflows when the real content mounts.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="min-h-full p-6 lg:p-8">
            <ShimmerStyles />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <Shimmer className="h-8 w-56" />
                    <Shimmer className="h-4 w-80" delay={0.06} />
                </div>
                <Shimmer className="h-10 w-36 rounded-xl" delay={0.12} />
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <Shimmer className="h-10 flex-1 rounded-lg" />
                <Shimmer className="h-10 w-full rounded-lg sm:w-44" delay={0.06} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="space-y-2 md:col-span-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                            <Shimmer className="h-9 w-9 shrink-0 rounded-full" delay={i * 0.04} />
                            <div className="min-w-0 flex-1 space-y-1.5">
                                <Shimmer className="h-3.5 w-4/5" delay={i * 0.04} />
                                <Shimmer className="h-3 w-1/2" delay={i * 0.04} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 md:col-span-8">
                    <div className="flex items-start gap-4">
                        <Shimmer className="h-16 w-16 shrink-0 rounded-2xl" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Shimmer className="h-6 w-1/2" delay={0.05} />
                            <Shimmer className="h-4 w-1/3" delay={0.08} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Shimmer key={i} className="h-4 w-full" delay={0.12 + i * 0.03} />
                        ))}
                        <Shimmer className="h-4 w-2/3" delay={0.4} />
                    </div>
                </div>
            </div>
        </div>
    );
}
