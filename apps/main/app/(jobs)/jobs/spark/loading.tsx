// Hand-matched to the swipe deck (one centred card, not a list).
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="p-4 lg:p-6">
            <ShimmerStyles />
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shimmer className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Shimmer className="h-5 w-36" delay={0.05} />
                        <Shimmer className="h-3.5 w-44" delay={0.08} />
                    </div>
                </div>
                <Shimmer className="h-9 w-28 rounded-xl" delay={0.12} />
            </div>
            <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-x-4 top-3 h-full rounded-3xl border border-neutral-200 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/60" />
                    <div className="absolute inset-x-2 top-1.5 h-full rounded-3xl border border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900/80" />
                    <div className="relative rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-start gap-4">
                            <Shimmer className="h-14 w-14 shrink-0 rounded-2xl" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Shimmer className="h-6 w-4/5" delay={0.05} />
                                <Shimmer className="h-4 w-1/2" delay={0.08} />
                            </div>
                        </div>
                        <div className="mt-5 space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Shimmer key={i} className="h-4 w-full" delay={0.18 + i * 0.04} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <Shimmer className="h-11 w-11 rounded-full" delay={0.55} />
                    <Shimmer className="h-14 w-14 rounded-full" delay={0.58} />
                    <Shimmer className="h-14 w-14 rounded-full" delay={0.61} />
                    <Shimmer className="h-11 w-11 rounded-full" delay={0.64} />
                </div>
                <Shimmer className="mt-8 h-4 w-48" delay={0.68} />
            </div>
        </div>
    );
}
