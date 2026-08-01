// Hand-matched to the uni pricing page. It had inherited the LEGAL group's prose
// skeleton (paragraph runs), which is wrong - this page is a centred header over a
// 3-up tier grid, so the prose version reflowed hard the moment tiers mounted.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-6 py-16">
            <ShimmerStyles />

            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
                <Shimmer className="mx-auto h-9 w-72" />
                <Shimmer className="mx-auto h-4 w-full" delay={0.06} />
                <Shimmer className="mx-auto h-4 w-2/3" delay={0.09} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`rounded-2xl border bg-white p-6 dark:bg-neutral-950 ${
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
                            {[0, 1, 2, 3, 4, 5].map((j) => (
                                <div key={j} className="flex items-center gap-2.5">
                                    <Shimmer className="h-4 w-4 shrink-0 rounded-full" delay={i * 0.07 + j * 0.03} />
                                    <Shimmer className="h-3.5 flex-1" delay={i * 0.07 + j * 0.03} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
