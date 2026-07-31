// Hand-matched to the project quiz.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="flex min-h-full items-center justify-center p-6">
            <ShimmerStyles />
            <div className="w-full max-w-3xl space-y-6">
                <Shimmer className="h-1.5 w-full rounded-full" />
                <Shimmer className="h-4 w-32" delay={0.05} />
                <Shimmer className="h-7 w-full" delay={0.08} />
                <Shimmer className="h-7 w-3/4" delay={0.1} />
                <div className="space-y-3 pt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Shimmer key={i} className="h-14 w-full rounded-xl" delay={0.14 + i * 0.05} />
                    ))}
                </div>
                <Shimmer className="h-11 w-full rounded-xl" delay={0.4} />
            </div>
        </div>
    );
}
