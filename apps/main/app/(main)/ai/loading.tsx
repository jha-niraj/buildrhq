// Hand-matched to AIHubClient (_components/AIHubClient.tsx).
//
// Four full-bleed sections, no tab strip — the previous version rendered a
// five-tab strip and a six-card grid that the page has never had. Counts come
// from the component's own literals: `stats` is 4 (grid-cols-2 md:grid-cols-4)
// and `tools` is 3 (md:grid-cols-2 lg:grid-cols-3).
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="w-full">
            <ShimmerStyles />

            {/* Hero — badge, two headline lines, sub, single CTA. */}
            <section className="relative border-b border-neutral-100 pt-32 pb-20 lg:pt-48 lg:pb-32 dark:border-neutral-800">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center space-y-8 text-center">
                        <Shimmer className="h-8 w-72 rounded-full" />
                        <div className="w-full max-w-4xl space-y-3">
                            <Shimmer className="mx-auto h-14 w-full" delay={0.06} />
                            <Shimmer className="mx-auto h-14 w-4/5" delay={0.09} />
                        </div>
                        <div className="w-full max-w-2xl space-y-2">
                            <Shimmer className="mx-auto h-6 w-full" delay={0.14} />
                            <Shimmer className="mx-auto h-6 w-3/4" delay={0.16} />
                        </div>
                        <Shimmer className="h-12 w-44 rounded-full" delay={0.2} />
                    </div>
                </div>
            </section>

            {/* Stat band — four centred tiles: icon, value, label. */}
            <section className="border-b border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <Shimmer className="mb-3 h-6 w-6 rounded" delay={i * 0.05} />
                                <Shimmer className="h-9 w-24" delay={i * 0.05} />
                                <Shimmer className="mt-1 h-4 w-20" delay={i * 0.05} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Developer Studio — section heading, then the three tool cards. */}
            <section className="bg-neutral-50/50 py-24 dark:bg-neutral-950">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 max-w-2xl space-y-4">
                        <Shimmer className="h-9 w-64" />
                        <Shimmer className="h-6 w-full" delay={0.05} />
                    </div>
                    <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-full rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="mb-6 flex items-start justify-between">
                                    <Shimmer className="h-14 w-14 rounded-xl" delay={i * 0.06} />
                                    <Shimmer className="h-6 w-20 rounded-md" delay={i * 0.06} />
                                </div>
                                <Shimmer className="mb-3 h-8 w-3/4" delay={i * 0.06} />
                                <div className="mb-6 space-y-2">
                                    <Shimmer className="h-4 w-full" delay={i * 0.06} />
                                    <Shimmer className="h-4 w-full" delay={i * 0.06} />
                                    <Shimmer className="h-4 w-2/3" delay={i * 0.06} />
                                </div>
                                <div className="flex justify-end">
                                    <Shimmer className="h-4 w-20" delay={i * 0.06} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA — two-line heading, sub, two pill buttons, two ticks. */}
            <section className="border-t border-neutral-100 bg-white py-24 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="mx-auto max-w-4xl space-y-8 px-6 text-center">
                    <div className="space-y-3">
                        <Shimmer className="mx-auto h-12 w-3/4" />
                        <Shimmer className="mx-auto h-12 w-2/3" delay={0.05} />
                    </div>
                    <Shimmer className="mx-auto h-6 w-full max-w-2xl" delay={0.1} />
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Shimmer className="h-14 w-48 rounded-full" delay={0.14} />
                        <Shimmer className="h-14 w-40 rounded-full" delay={0.17} />
                    </div>
                    <div className="flex items-center justify-center gap-6 pt-6">
                        <Shimmer className="h-4 w-32" delay={0.2} />
                        <Shimmer className="h-4 w-32" delay={0.23} />
                    </div>
                </div>
            </section>
        </div>
    );
}
