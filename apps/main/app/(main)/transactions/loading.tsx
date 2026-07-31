// Hand-matched to the transactions page: a max-w-5xl container, a header, a stat
// pair, a tab strip, then the ledger rows. The generated skeleton drew a card grid
// and missed the tabs entirely.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="container mx-auto max-w-5xl px-6 py-16">
            <ShimmerStyles />

            <div className="mb-8 space-y-2">
                <Shimmer className="h-9 w-64" />
                <Shimmer className="h-4 w-96" delay={0.06} />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
                {[0, 1].map((i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <Shimmer className="h-3.5 w-28" delay={i * 0.06} />
                        <Shimmer className="mt-2 h-8 w-24" delay={i * 0.06} />
                    </div>
                ))}
            </div>

            {/* Tab strip */}
            <div className="mb-6 flex gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
                {[0, 1, 2].map((i) => (
                    <Shimmer key={i} className="h-9 w-32 rounded-lg" delay={i * 0.06} />
                ))}
            </div>

            {/* Ledger rows */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-5 py-4">
                            <Shimmer className="h-9 w-9 shrink-0 rounded-xl" delay={i * 0.04} />
                            <div className="min-w-0 flex-1 space-y-1.5">
                                <Shimmer className="h-4 w-2/5" delay={i * 0.04} />
                                <Shimmer className="h-3 w-28" delay={i * 0.04} />
                            </div>
                            <Shimmer className="h-5 w-20 shrink-0" delay={i * 0.04} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
