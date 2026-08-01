// Legal/long-form prose: a card grid would be wrong here, so this mirrors the
// actual shape - a title block followed by paragraph runs.
import { SkeletonPage, Shimmer } from "@repo/ui/components/skeleton-kit";

export default function Loading() {
    return (
        <SkeletonPage className="mx-auto max-w-7xl">
            <div className="space-y-3">
                <Shimmer className="h-9 w-64" />
                <Shimmer className="h-4 w-96" delay={0.06} />
            </div>
            <div className="space-y-8 pt-6">
                {Array.from({ length: 6 }).map((_, s) => (
                    <div key={s} className="space-y-2.5">
                        <Shimmer className="h-5 w-52" delay={s * 0.08} />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Shimmer key={i} className="h-4 w-full" delay={s * 0.08 + i * 0.03} />
                        ))}
                        <Shimmer className="h-4 w-2/3" delay={s * 0.08} />
                    </div>
                ))}
            </div>
        </SkeletonPage>
    );
}
