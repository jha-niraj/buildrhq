// Hand-matched to the resume creation wizard.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-3xl space-y-6">
                <Shimmer className="h-8 w-64" />
                <Shimmer className="h-4 w-full max-w-md" delay={0.06} />
            <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, s) => (
                    <div key={s} className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 p-6">
                        <Shimmer className="h-5 w-44" delay={s * 0.08} />
                        <Shimmer className="mt-2 h-3.5 w-72" delay={s * 0.08} />
                        <div className="mt-5 space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Shimmer className="h-3.5 w-28" delay={s * 0.08 + i * 0.04} />
                                    <Shimmer className="h-10 w-full rounded-lg" delay={s * 0.08 + i * 0.04} />
                                </div>
                            ))}
                        </div>
                        <Shimmer className="mt-5 h-10 w-32 rounded-lg" delay={s * 0.08} />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
