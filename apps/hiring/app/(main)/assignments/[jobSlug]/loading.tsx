// Hand-matched to assignment-detail-content.tsx — same wrapper, same grids, same card chrome, so
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

            <div className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Shimmer key={i} className="h-9 w-28 rounded-lg" delay={i * 0.05} />
                ))}
            </div>

            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shimmer className="h-10 w-10 rounded-full" delay={i * 0.04} />
                                <div className="space-y-1.5">
                                    <Shimmer className="h-4 w-40" delay={i * 0.04} />
                                    <Shimmer className="h-3 w-28" delay={i * 0.04} />
                                </div>
                            </div>
                            <Shimmer className="h-8 w-24 rounded-lg" delay={i * 0.04} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
