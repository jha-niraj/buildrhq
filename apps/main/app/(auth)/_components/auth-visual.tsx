"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * The animated panel on the left of every auth screen.
 *
 * Pure inline SVG — no image, no canvas, no WebGL — so it costs nothing to load
 * and inherits the theme through `currentColor`. The motif is a build pipeline:
 * three inputs funnelling through two stages into one shipped artifact, with
 * packets travelling the wires and each node lighting as its packet lands. It
 * reads as "things being built and shipped", which is what the product does,
 * rather than being decoration for its own sake.
 *
 * It now carries the panel alone — the 48px grid that used to sit behind it was
 * removed, so the composition has to hold up on its own. That is why the timing
 * is derived rather than hand-tuned per element: a packet leaves at
 * `STAGE_DELAY * stage`, and the node it feeds flares at the moment it lands.
 * Nothing pulses on its own private schedule, so the whole thing reads as one
 * mechanism instead of six unrelated loops.
 *
 * Every colour is a neutral opacity of `currentColor`, so it flips with the
 * theme with no per-mode branching.
 */

const EASE = [0.22, 1, 0.36, 1] as const

/** One full pass of the pipeline, in seconds. */
const CYCLE = 5.2
/** How long a packet takes to traverse one wire. */
const TRAVEL = 1.5
/** Gap between the two stages firing — stage 2 leaves as stage 1 arrives. */
const STAGE_DELAY = 1.35

// A 400x400 viewBox: three sources → two builders → one shipped artifact.
// `stage` is how many hops from the sources, which drives every delay below.
const NODES = [
    { x: 70, y: 80, stage: 0, r: 5 },
    { x: 70, y: 200, stage: 0, r: 5 },
    { x: 70, y: 320, stage: 0, r: 5 },
    { x: 200, y: 140, stage: 1, r: 6 },
    { x: 200, y: 260, stage: 1, r: 6 },
    { x: 330, y: 200, stage: 2, r: 7.5 },
]

const WIRES = [
    { d: "M 70 80 C 130 80, 140 140, 200 140", stage: 0 },
    { d: "M 70 200 C 130 200, 140 140, 200 140", stage: 0 },
    { d: "M 70 200 C 130 200, 140 260, 200 260", stage: 0 },
    { d: "M 70 320 C 130 320, 140 260, 200 260", stage: 0 },
    { d: "M 200 140 C 260 140, 270 200, 330 200", stage: 1 },
    { d: "M 200 260 C 260 260, 270 200, 330 200", stage: 1 },
]

/** When a packet on `stage` starts moving. */
const departAt = (stage: number) => stage * STAGE_DELAY
/** When it lands — and therefore when the node it feeds should flare. */
const arriveAt = (stage: number) => departAt(stage) + TRAVEL

export function AuthVisual({ className = "" }: { className?: string }) {
    const reduced = useReducedMotion()

    // Reduced motion keeps the full composition, just static: the diagram is the
    // content here, so dropping to an empty panel would leave a bare dark column.
    const loop = (delay: number, duration: number) => ({
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.max(0, CYCLE - duration - delay),
        ease: "easeInOut" as const,
    })

    return (
        <div className={`pointer-events-none select-none ${className}`} aria-hidden>
            <svg viewBox="0 0 400 400" className="h-full w-full text-white" fill="none">
                <defs>
                    {/* Fades each wire's leading edge so a packet emerges and
                        dissolves rather than popping on at a hard endpoint. */}
                    <linearGradient id="av-wire" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="av-halo">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.34" />
                        <stop offset="70%" stopColor="currentColor" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Standing structure — always visible, so the shape reads even
                    before the first packet and under prefers-reduced-motion. */}
                {WIRES.map((w, i) => (
                    <path key={`w-${i}`} d={w.d} stroke="currentColor" strokeOpacity={0.13} strokeWidth={1.5} />
                ))}

                {/* Packets. Each is a short dash swept along its wire by animating
                    strokeDashoffset against a normalised pathLength, which keeps one
                    element per wire instead of a separate travelling circle. */}
                {!reduced && WIRES.map((w, i) => (
                    <motion.path
                        key={`p-${i}`}
                        d={w.d}
                        stroke="url(#av-wire)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="0.16 0.84"
                        initial={{ strokeDashoffset: 1, opacity: 0 }}
                        animate={{ strokeDashoffset: [1, 0], opacity: [0, 0.9, 0.9, 0] }}
                        transition={{
                            ...loop(departAt(w.stage) + (i % 2) * 0.12, TRAVEL),
                            ease: "linear",
                            times: undefined,
                        }}
                    />
                ))}

                {NODES.map((n, i) => (
                    <g key={`n-${i}`}>
                        {/* Halo — flares as this node's inbound packet lands. Stage 0
                            has no inbound packet, so it flares at the cycle start,
                            which is exactly when it emits. */}
                        <motion.circle
                            cx={n.x}
                            cy={n.y}
                            r={n.r * 3.4}
                            fill="url(#av-halo)"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={reduced ? { scale: 1, opacity: 0.5 } : { scale: [0.7, 1.15, 0.85], opacity: [0, 0.9, 0] }}
                            transition={reduced ? undefined : loop(n.stage === 0 ? 0 : arriveAt(n.stage - 1), 1.5)}
                            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                        />
                        {/* Core — settles brighter at each stage, so the eye is drawn
                            left-to-right toward the shipped artifact. */}
                        <motion.circle
                            cx={n.x}
                            cy={n.y}
                            r={n.r}
                            fill="currentColor"
                            initial={{ fillOpacity: 0.22 }}
                            animate={
                                reduced
                                    ? { fillOpacity: 0.3 + n.stage * 0.22 }
                                    : { fillOpacity: [0.22, 0.95, 0.3 + n.stage * 0.12] }
                            }
                            transition={reduced ? undefined : loop(n.stage === 0 ? 0 : arriveAt(n.stage - 1), 1.5)}
                        />
                        {/* Thin ring, static — gives each node an edge against the
                            dark panel now that the grid is gone. */}
                        <circle cx={n.x} cy={n.y} r={n.r + 5} stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
                    </g>
                ))}

                {/* The shipped artifact: a ring that draws itself closed once, then a
                    ripple on every cycle as the final packet lands. */}
                <motion.circle
                    cx={330}
                    cy={200}
                    r={26}
                    stroke="currentColor"
                    strokeOpacity={0.42}
                    strokeWidth={1.5}
                    initial={reduced ? undefined : { pathLength: 0 }}
                    animate={reduced ? undefined : { pathLength: 1 }}
                    transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
                    style={{ transformOrigin: "330px 200px", rotate: -90 }}
                />
                {!reduced && (
                    <motion.circle
                        cx={330}
                        cy={200}
                        r={26}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
                        transition={loop(arriveAt(1), 2)}
                        style={{ transformOrigin: "330px 200px" }}
                    />
                )}
            </svg>
        </div>
    )
}

export default AuthVisual
