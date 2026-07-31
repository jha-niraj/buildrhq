// Hand-matched to the blog index: hero, then a 3-up post grid.
import { Shimmer, ShimmerStyles } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-6 py-20">
            <ShimmerStyles />
            <div className="mb-12 max-w-2xl space-y-4">
                <Shimmer className="h-10 w-56" />
                <Shimmer className="h-5 w-full" delay={0.06} />
                <Shimmer className="h-5 w-2/3" delay={0.09} />
            </div>
            <div className="mb-10 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Shimmer key={i} className="h-8 w-24 rounded-full" delay={i * 0.04} />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Shimmer className="aspect-[16/10] w-full rounded-2xl" delay={i * 0.04} />
                        <Shimmer className="h-3 w-24" delay={i * 0.04} />
                        <Shimmer className="h-5 w-full" delay={i * 0.04} />
                        <Shimmer className="h-4 w-full" delay={i * 0.04} />
                        <Shimmer className="h-4 w-2/3" delay={i * 0.04} />
                    </div>
                ))}
            </div>
        </div>
    );
}
