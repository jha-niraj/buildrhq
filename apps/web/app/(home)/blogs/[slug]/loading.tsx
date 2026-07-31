// Hand-matched to the article page: breadcrumb, title block, cover, then max-w-5xl prose.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="w-full">
            <ShimmerStyles />
            <div className="mx-auto max-w-5xl px-6 pt-10">
                <Shimmer className="h-3.5 w-64" />
                <div className="mt-8 space-y-4">
                    <Shimmer className="h-3 w-28" delay={0.05} />
                    <Shimmer className="h-11 w-full" delay={0.08} />
                    <Shimmer className="h-11 w-3/4" delay={0.1} />
                    <Shimmer className="h-5 w-full max-w-2xl" delay={0.14} />
                    <div className="flex items-center gap-3 pt-2">
                        <Shimmer className="h-10 w-10 rounded-full" delay={0.18} />
                        <div className="space-y-1.5">
                            <Shimmer className="h-3.5 w-32" delay={0.18} />
                            <Shimmer className="h-3 w-40" delay={0.18} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mb-12 mt-10 max-w-5xl px-6">
                <Shimmer className="aspect-[2/1] w-full rounded-2xl" delay={0.22} />
            </div>

            <div className="mx-auto max-w-5xl px-6 pb-16">
                <Shimmer className="h-36 w-full rounded-2xl" delay={0.26} />
                <div className="mt-10 space-y-8">
                    {Array.from({ length: 5 }).map((_, s) => (
                        <div key={s} className="space-y-2.5">
                            <Shimmer className="h-7 w-1/2" delay={s * 0.06} />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Shimmer key={i} className="h-4 w-full" delay={s * 0.06 + i * 0.03} />
                            ))}
                            <Shimmer className="h-4 w-3/4" delay={s * 0.06} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 pb-24">
                <div className="border-t border-neutral-200 pt-10 dark:border-neutral-800">
                    <Shimmer className="mb-6 h-6 w-48" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="space-y-2">
                                <Shimmer className="h-5 w-full" delay={i * 0.06} />
                                <Shimmer className="h-4 w-full" delay={i * 0.06} />
                                <Shimmer className="h-4 w-2/3" delay={i * 0.06} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
