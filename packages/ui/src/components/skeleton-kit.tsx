"use client"

import { cn } from "@repo/ui/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// Shared skeleton kit.
//
// The point of a skeleton is that NOTHING MOVES when the real content arrives.
// A generic "spinner in a box" fallback reflows the whole page the moment data
// lands, which reads as slower than no skeleton at all. So these are primitives
// to assemble a per-route shape from — a route's loading.tsx should mirror its
// page section for section, not reach for one generic placeholder.
//
// The shimmer is a CSS background sweep rather than a pulsing opacity: a pulse
// draws the eye to the flashing, a sweep reads as "content streaming in".
// ─────────────────────────────────────────────────────────────────────────────

const SHIMMER_STYLES = `
@keyframes sk-sweep {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.sk-shimmer {
    background-color: color-mix(in oklab, var(--foreground) 8%, transparent);
    background-image: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in oklab, var(--foreground) 6%, transparent) 45%,
        color-mix(in oklab, var(--foreground) 10%, transparent) 50%,
        color-mix(in oklab, var(--foreground) 6%, transparent) 55%,
        transparent 100%
    );
    background-size: 200% 100%;
    animation: sk-sweep 1.6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
    .sk-shimmer { animation: none; }
}
`

/** Mounted once per skeleton tree — duplicated <style> tags are harmless but noisy. */
export function ShimmerStyles() {
    return <style>{SHIMMER_STYLES}</style>
}

/**
 * One shimmering block. `delay` staggers rows so a list reads as a wave rather
 * than every line flashing in lockstep.
 */
export function Shimmer({ className, delay = 0 }: { className?: string; delay?: number }) {
    return (
        <div
            className={cn("sk-shimmer rounded-md", className)}
            style={delay ? { animationDelay: `${delay}s` } : undefined}
        />
    )
}

/** Page title + subtitle + optional action button, matching the standard page header. */
export function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
                <Shimmer className="h-7 w-52" />
                <Shimmer className="h-4 w-72" delay={0.06} />
            </div>
            {action && <Shimmer className="h-9 w-32 rounded-full" delay={0.12} />}
        </div>
    )
}

/** A row of stat tiles. */
export function StatTilesSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                    <Shimmer className="h-3 w-20" delay={i * 0.06} />
                    <Shimmer className="mt-2 h-7 w-16" delay={i * 0.06} />
                </div>
            ))}
        </div>
    )
}

/** A bordered card with a chart-shaped block inside. */
export function ChartCardSkeleton({ height = 220, delay = 0 }: { height?: number; delay?: number }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <Shimmer className="h-4 w-32" delay={delay} />
            <Shimmer className="mt-4 w-full rounded-lg" delay={delay + 0.06} />
            <div className="mt-4" style={{ height }}>
                <Shimmer className="h-full w-full rounded-lg" delay={delay + 0.06} />
            </div>
        </div>
    )
}

/** Stats column beside a chart — the "module row" shape used on the dashboard. */
export function ModuleRowSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <Shimmer className="h-5 w-40" delay={delay} />
                <Shimmer className="h-4 w-20" delay={delay + 0.04} />
            </div>
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="grid grid-cols-2 gap-2.5 lg:w-1/3 lg:grid-cols-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border/60 px-3.5 py-2.5">
                            <Shimmer className="h-3 w-16" delay={delay + i * 0.05} />
                            <Shimmer className="mt-1.5 h-5 w-12" delay={delay + i * 0.05} />
                        </div>
                    ))}
                </div>
                <div className="lg:w-2/3">
                    <Shimmer className="h-[220px] w-full rounded-lg" delay={delay + 0.1} />
                </div>
            </div>
        </div>
    )
}

/** A responsive grid of content cards. */
export function CardGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 2 | 3 | 4 }) {
    const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"
    return (
        <div className={cn("grid grid-cols-1 gap-4", cols)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between">
                        <Shimmer className="h-9 w-9 rounded-xl" delay={i * 0.05} />
                        <Shimmer className="h-5 w-16 rounded-full" delay={i * 0.05} />
                    </div>
                    <Shimmer className="mt-3 h-5 w-3/4" delay={i * 0.05} />
                    <Shimmer className="mt-2 h-4 w-full" delay={i * 0.05} />
                    <Shimmer className="mt-1.5 h-4 w-5/6" delay={i * 0.05} />
                    <div className="mt-4 flex gap-1.5">
                        {Array.from({ length: 3 }).map((_, j) => (
                            <Shimmer key={j} className="h-5 w-14 rounded-md" delay={i * 0.05} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

/** A list/table of rows with a header strip. */
export function TableSkeleton({ rows = 8, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex gap-4 border-b border-border px-4 py-3">
                {Array.from({ length: columns }).map((_, i) => (
                    <Shimmer key={i} className="h-4 flex-1" delay={i * 0.06} />
                ))}
            </div>
            <div className="divide-y divide-border">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                        {Array.from({ length: columns }).map((_, j) => (
                            <Shimmer key={j} className="h-4 flex-1" delay={i * 0.03} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

/** A vertical feed of avatar + two-line rows. */
export function FeedSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="space-y-5">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-3">
                    <Shimmer className="h-8 w-8 shrink-0 rounded-full" delay={i * 0.05} />
                    <div className="min-w-0 flex-1 space-y-2">
                        <Shimmer className="h-4 w-2/3" delay={i * 0.05} />
                        <Shimmer className="h-3 w-24" delay={i * 0.05} />
                    </div>
                </div>
            ))}
        </div>
    )
}

/** Search field + filter controls. */
export function FilterBarSkeleton() {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <Shimmer className="h-10 flex-1 rounded-lg" />
            <Shimmer className="h-10 w-full rounded-lg sm:w-44" delay={0.06} />
        </div>
    )
}

/** Horizontal tab strip. */
export function TabStripSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="flex gap-2 border-b border-border pb-2">
            {Array.from({ length: count }).map((_, i) => (
                <Shimmer key={i} className="h-8 w-24 rounded-lg" delay={i * 0.06} />
            ))}
        </div>
    )
}

/** Standard page wrapper so every skeleton shares the app's page padding. */
export function SkeletonPage({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8", className)}>
            <ShimmerStyles />
            {children}
        </div>
    )
}

/**
 * A reasonable default for a route that has not had a bespoke skeleton written
 * yet: header, stat tiles, and a card grid. Prefer composing the primitives above
 * to match the real page — this exists so no route is left with a blank screen.
 */
export function GenericPageSkeleton() {
    return (
        <SkeletonPage>
            <PageHeaderSkeleton />
            <StatTilesSkeleton />
            <CardGridSkeleton />
        </SkeletonPage>
    )
}
