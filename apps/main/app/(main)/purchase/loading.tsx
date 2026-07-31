// Hand-matched to the purchase page: a max-w-7xl container, a centred header, the
// pricing tier row, then a features band (2-up on mobile, 4-up from md) and a
// bordered FAQ/summary panel.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="container mx-auto max-w-7xl px-6 py-16">
            <ShimmerStyles />

            <div className="mb-12 space-y-3 text-center">
                <Shimmer className="mx-auto h-9 w-72" />
                <Shimmer className="mx-auto h-4 w-full max-w-xl" delay={0.06} />
            </div>

            {/* Pricing tiers. */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`rounded-2xl border bg-white p-6 dark:bg-neutral-900 ${
                            i === 1
                                ? "border-neutral-900 dark:border-white"
                                : "border-neutral-200 dark:border-neutral-800"
                        }`}
                    >
                        <Shimmer className="h-4 w-24" delay={i * 0.07} />
                        <Shimmer className="mt-4 h-10 w-32" delay={i * 0.07} />
                        <Shimmer className="mt-2 h-3.5 w-28" delay={i * 0.07} />
                        <Shimmer className="mt-6 h-11 w-full rounded-xl" delay={i * 0.07} />
                        <div className="mt-6 space-y-3">
                            {[0, 1, 2, 3, 4].map((j) => (
                                <div key={j} className="flex items-center gap-2.5">
                                    <Shimmer className="h-4 w-4 shrink-0 rounded-full" delay={i * 0.07 + j * 0.03} />
                                    <Shimmer className="h-3.5 flex-1" delay={i * 0.07 + j * 0.03} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Features band. */}
            <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                        <Shimmer className="mx-auto h-11 w-11 rounded-xl" delay={i * 0.05} />
                        <Shimmer className="mx-auto mt-3 h-4 w-24" delay={i * 0.05} />
                        <Shimmer className="mx-auto mt-2 h-3.5 w-32" delay={i * 0.05} />
                    </div>
                ))}
            </div>

            {/* Summary / FAQ panel. */}
            <div className="mt-16 overflow-hidden rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-800">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-4">
                            <Shimmer className="h-4 w-1/2" delay={i * 0.05} />
                            <Shimmer className="h-4 w-4 rounded" delay={i * 0.05} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
