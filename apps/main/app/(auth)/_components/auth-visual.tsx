"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * The animated panel on the left of every auth screen.
 *
 * Pure inline SVG — no image, no canvas, no WebGL — so it costs nothing to load
 * and inherits the theme through `currentColor`. The motif is a build pipeline:
 * nodes connected by paths, with a pulse travelling along the wires and the nodes
 * lighting up in sequence. It reads as "things being built and shipped", which is
 * what the product does, rather than being decoration for its own sake.
 *
 * Every colour is a neutral opacity of `currentColor`, so the whole thing flips
 * with the theme with no per-mode branching.
 */

const EASE = [0.22, 1, 0.36, 1] as const

// Node positions on a 400x400 viewBox, laid out as three feeding into two into one —
// a funnel from many inputs to one shipped artifact.
const NODES = [
    { x: 70, y: 80 }, { x: 70, y: 200 }, { x: 70, y: 320 },
    { x: 200, y: 140 }, { x: 200, y: 260 },
    { x: 330, y: 200 },
]

const WIRES = [
    "M 70 80 C 130 80, 140 140, 200 140",
    "M 70 200 C 130 200, 140 140, 200 140",
    "M 70 200 C 130 200, 140 260, 200 260",
    "M 70 320 C 130 320, 140 260, 200 260",
    "M 200 140 C 260 140, 270 200, 330 200",
    "M 200 260 C 260 260, 270 200, 330 200",
]

export function AuthVisual({ className = "" }: { className?: string }) {
    const reduced = useReducedMotion()

    return (
        <div className={`pointer-events-none select-none ${className}`} aria-hidden>
            <svg viewBox="0 0 400 400" className="h-full w-full text-white" fill="none">
                {/* Static wires — the structure, always visible. */}
                {WIRES.map((d, i) => (
                    <path key={`w-${i}`} d={d} stroke="currentColor" strokeOpacity={0.14} strokeWidth={1.5} />
                ))}

                {/* Each wire draws itself in, then a bright pulse runs along it. */}
                {!reduced && WIRES.map((d, i) => (
                    <motion.path
                        key={`p-${i}`}
                        d={d}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray="0.18 0.82"
                        initial={{ strokeDashoffset: 1, opacity: 0 }}
                        animate={{ strokeDashoffset: [1, -1], opacity: [0, 0.75, 0] }}
                        transition={{
                            duration: 3.2,
                            delay: i * 0.45,
                            repeat: Infinity,
                            repeatDelay: 1.4,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Nodes: a soft halo that breathes, and a solid core. */}
                {NODES.map((n, i) => (
                    <g key={`n-${i}`}>
                        <motion.circle
                            cx={n.x} cy={n.y} r={16}
                            fill="currentColor" fillOpacity={0.06}
                            initial={reduced ? undefined : { scale: 0.8, opacity: 0.4 }}
                            animate={reduced ? undefined : { scale: [0.8, 1.15, 0.8], opacity: [0.35, 0.7, 0.35] }}
                            transition={{ duration: 3.6, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                        />
                        <motion.circle
                            cx={n.x} cy={n.y} r={5}
                            fill="currentColor"
                            initial={reduced ? { fillOpacity: 0.7 } : { fillOpacity: 0.25 }}
                            animate={reduced ? undefined : { fillOpacity: [0.25, 0.95, 0.25] }}
                            transition={{ duration: 3.6, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </g>
                ))}

                {/* The shipped artifact: a ring that closes around the final node. */}
                <motion.circle
                    cx={330} cy={200} r={26}
                    stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5}
                    initial={reduced ? undefined : { pathLength: 0, rotate: -90 }}
                    animate={reduced ? undefined : { pathLength: 1 }}
                    transition={{ duration: 1.6, delay: 0.8, ease: EASE }}
                    style={{ transformOrigin: "330px 200px", rotate: -90 }}
                />
                {!reduced && (
                    <motion.circle
                        cx={330} cy={200} r={26}
                        stroke="currentColor" strokeWidth={1.5}
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.9, opacity: 0 }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 1.6 }}
                        style={{ transformOrigin: "330px 200px" }}
                    />
                )}
            </svg>
        </div>
    )
}

export default AuthVisual
