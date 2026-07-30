"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

// The one scroll-entrance primitive for the marketing site.
//
// It exists so SERVER components can animate. The blog article, the topic hub and
// the legal pages are all statically generated on purpose (SEO, `dynamicParams =
// false`), and converting them to `"use client"` just to get a fade would throw that
// away. Wrapping their sections in <Reveal> puts the client boundary on this tiny
// component instead — `children` is passed as a prop, so the content inside stays
// server-rendered.
//
// Everything animates the same way (rise + fade, once, triggered slightly before the
// element reaches the viewport) so the whole site feels like one system rather than
// each page inventing its own motion.

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export interface RevealProps {
    children: ReactNode
    /** Seconds to wait before this element starts. Use to cascade siblings. */
    delay?: number
    /** Distance in px the element rises from. Default 16. */
    y?: number
    /**
     * Fade only, never translate. Use when the subtree contains a
     * `position: sticky` element — Framer leaves a `transform` on the element after
     * the animation settles, and a transformed ancestor creates a containing block
     * that stops sticky positioning from resolving against the page scroller.
     */
    fadeOnly?: boolean
    className?: string
}

export function Reveal({ children, delay = 0, y = 16, fadeOnly = false, className }: RevealProps) {
    // Honour the OS setting: content still appears, it just doesn't move.
    const reduced = useReducedMotion()
    const still = reduced || fadeOnly

    return (
        <motion.div
            className={className}
            initial={still ? { opacity: 0 } : { opacity: 0, y }}
            whileInView={still ? { opacity: 1 } : { opacity: 1, y: 0 }}
            // `once` so scrolling back up doesn't replay everything, and a negative
            // margin so the animation starts just before the element is visible —
            // otherwise it finishes off-screen on a fast scroll and looks like nothing
            // happened.
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reduced ? 0.2 : 0.5, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    )
}

const staggerParent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

/**
 * Wrap a list whose items should cascade. Each direct child must be a
 * <RevealItem>; the parent only owns the timing.
 */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
        >
            {children}
        </motion.div>
    )
}

export function RevealItem({ children, className, y = 16 }: { children: ReactNode; className?: string; y?: number }) {
    const reduced = useReducedMotion()
    const variants: Variants = {
        hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: reduced ? 0.2 : 0.5, ease: EASE },
        },
    }
    return (
        <motion.div className={className} variants={variants}>
            {children}
        </motion.div>
    )
}

export default Reveal
