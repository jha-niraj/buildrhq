// Hand-matched to a public resume (single document column).
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-3xl space-y-6">
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950">
                    <Shimmer className="h-8 w-52" />
                    <Shimmer className="mt-2 h-4 w-72" delay={0.05} />
                    <div className="mt-8 space-y-6">
                        {Array.from({ length: 4 }).map((_, s) => (
                            <div key={s} className="space-y-2">
                                <Shimmer className="h-5 w-40" delay={s * 0.08} />
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Shimmer key={i} className="h-4 w-full" delay={s * 0.08 + i * 0.04} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
