"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export type FullScreenLoaderProps = {
    /**
     * Logo element, e.g. `<Image src="/logo.svg" alt="ShiprHQ" width={56} height={56} />`.
     * Omit it to get the animated <ShiprMark />, which is the default.
     */
    logo?: ReactNode
    /** Set false to render no mark at all (wordmark + progress only). */
    mark?: boolean
    /** The animated wordmark text. */
    wordmark?: string
    /** Optional caption under the wordmark, e.g. "Setting up your workspace". */
    label?: string
    /** Cover the viewport on the app background (default). Set false to render inline. */
    fullScreen?: boolean
    className?: string
}

// One shared <style> block, namespaced `fsl-` so multiple instances can coexist.
// Everything reads Tailwind's own theme tokens (--background, --foreground,
// --border, --muted-foreground), so light/dark is inherited automatically and no
// colour is hardcoded - which is what keeps it correct now the brand is monochrome.
const STYLES = `
.fsl-vignette {
    background: radial-gradient(ellipse 60% 50% at 50% 42%, color-mix(in oklab, var(--foreground) 6%, transparent) 0%, transparent 72%);
}
.fsl-word {
    position: relative;
    font-family: var(--font-display, var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1;
    font-size: clamp(2rem, 6vw, 3.75rem);
    white-space: nowrap;
    user-select: none;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    background-image: linear-gradient(115deg,
        color-mix(in oklab, var(--foreground) 22%, transparent) 0%,
        color-mix(in oklab, var(--foreground) 22%, transparent) 38%,
        var(--foreground) 50%,
        color-mix(in oklab, var(--foreground) 22%, transparent) 62%,
        color-mix(in oklab, var(--foreground) 22%, transparent) 100%);
    background-size: 220% 100%;
    animation: fsl-sweep 2.6s cubic-bezier(.45,0,.15,1) infinite;
}
@keyframes fsl-sweep { 0% { background-position: 130% 0; } 100% { background-position: -130% 0; } }

.fsl-cap {
    font-family: var(--font-geist-mono, ui-monospace, "SFMono-Regular", monospace);
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted-foreground);
}
.fsl-track {
    position: relative;
    width: 132px;
    height: 2px;
    border-radius: 999px;
    background: var(--border);
    overflow: hidden;
}
.fsl-fill {
    position: absolute;
    inset: 0;
    width: 40%;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, var(--foreground), transparent);
    animation: fsl-run 1.6s cubic-bezier(.45,0,.15,1) infinite;
}
@keyframes fsl-run {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(320%); }
}

@media (prefers-reduced-motion: reduce) {
    .fsl-word { animation: none; background-position: 50% 0; }
    .fsl-fill { animation: none; transform: translateX(0); width: 100%; opacity: 0.5; }
}
`

/**
 * The ShiprHQ mark, animated.
 *
 * A dispatch motif, which is what the name means: a chevron launches out of the
 * tile along its diagonal, leaves a short wake behind it, and the tile's ring
 * completes as it goes. One object doing one thing - deliberately not a second
 * spinner, since the wordmark shimmer and the progress track already carry
 * motion and a third competing loop would read as jitter.
 *
 * Pure inline SVG on `currentColor`, so it inherits the theme with no per-mode
 * branching and costs nothing to load - the loader is the first thing painted on
 * a cold navigation, so it must not wait on an image request.
 */
export function ShiprMark({ size = 56, className = "" }: { size?: number; className?: string }) {
    const reduceMotion = useReducedMotion()

    // The chevron travels up-and-right along the tile's diagonal.
    const launch = { x: [0, 3, 26], y: [0, -3, -26], opacity: [0, 1, 0] }
    const cycle = { duration: 1.9, repeat: Infinity, ease: "easeIn" as const, times: [0, 0.28, 1] }

    return (
        <div className={className} style={{ width: size, height: size, color: "var(--foreground)" }} aria-hidden>
            <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
                {/* Tile. Drawn once on mount rather than looping - it is the frame
                    the motion happens inside, not part of the motion. */}
                <motion.rect
                    x={4} y={4} width={56} height={56} rx={16}
                    stroke="currentColor" strokeOpacity={0.28} strokeWidth={2}
                    initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                <rect x={4} y={4} width={56} height={56} rx={16} fill="currentColor" fillOpacity={0.05} />

                {/* Wake: two short strokes that hang back as the chevron leaves. */}
                {!reduceMotion && [0, 1].map((i) => (
                    <motion.line
                        key={i}
                        x1={20 - i * 6} y1={44 + i * 6} x2={27 - i * 6} y2={37 + i * 6}
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: [0, 0.45, 0], pathLength: [0, 1, 1] }}
                        transition={{ ...cycle, delay: 0.1 + i * 0.08 }}
                    />
                ))}

                {/* The chevron itself. */}
                <motion.path
                    d="M 22 42 L 32 22 L 42 42 L 32 36 Z"
                    fill="currentColor"
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={reduceMotion ? undefined : launch}
                    transition={cycle}
                    style={{ transformOrigin: "32px 32px" }}
                />
                {/* A resting outline so the tile is never empty between launches. */}
                <path
                    d="M 22 42 L 32 22 L 42 42 L 32 36 Z"
                    stroke="currentColor" strokeOpacity={reduceMotion ? 0 : 0.22}
                    strokeWidth={1.5} strokeLinejoin="round"
                />
            </svg>
        </div>
    )
}

export function FullScreenLoader({
    logo,
    mark = true,
    wordmark = "ShiprHQ",
    label,
    fullScreen = true,
    className = "",
}: FullScreenLoaderProps) {
    const reduceMotion = useReducedMotion()
    const glyph = logo ?? (mark ? <ShiprMark /> : null)

    return (
        <div
            className={className}
            style={{
                position: fullScreen ? "fixed" : "relative",
                inset: fullScreen ? 0 : undefined,
                width: fullScreen ? undefined : "100%",
                zIndex: fullScreen ? 50 : undefined,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "var(--background)",
            }}
            role="status"
            aria-label={`Loading ${wordmark}`}
        >
            <div aria-hidden className="fsl-vignette" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                    padding: "0 6vw",
                    textAlign: "center",
                }}
            >
                {glyph ? (
                    <motion.div
                        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                        {/* No pulsing rings behind the mark: the shimmering wordmark and the
                            progress track already carry the motion, and expanding circles read
                            as a second, competing spinner. */}
                        {glyph}
                    </motion.div>
                ) : null}

                <div className="fsl-word">{wordmark}</div>

                <motion.div
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
                    initial={reduceMotion ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {label ? <p className="fsl-cap">{label}</p> : null}
                    <div className="fsl-track">
                        <div className="fsl-fill" />
                    </div>
                </motion.div>
            </div>

            <style>{STYLES}</style>
        </div>
    )
}

export default FullScreenLoader
