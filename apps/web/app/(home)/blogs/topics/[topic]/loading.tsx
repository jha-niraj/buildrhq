// Hand-matched to the topic hub: bordered header band, then a 3-up post grid.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="w-full">
            <ShimmerStyles />
            <div className="border-b border-neutral-100 dark:border-neutral-900">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <Shimmer className="h-3.5 w-56" />
                    <Shimmer className="mt-8 h-10 w-72" delay={0.06} />
                    <Shimmer className="mt-3 h-5 w-full max-w-2xl" delay={0.09} />
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-6 py-12 pb-24">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
                            <Shimmer className="h-5 w-full" delay={i * 0.05} />
                            <Shimmer className="mt-2 h-5 w-2/3" delay={i * 0.05} />
                            <Shimmer className="mt-4 h-4 w-full" delay={i * 0.05} />
                            <Shimmer className="mt-1.5 h-4 w-5/6" delay={i * 0.05} />
                            <Shimmer className="mt-5 h-3 w-24" delay={i * 0.05} />
                        </div>
                    ))}
                </div>
                <div className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
                    <Shimmer className="mb-4 h-3 w-28" />
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Shimmer key={i} className="h-8 w-28 rounded-full" delay={i * 0.04} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
