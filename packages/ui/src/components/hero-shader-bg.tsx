"use client"

import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "../lib/utils"
import { SHADER_PALETTES } from "./shader-palettes"

// Lazy-load the WebGL shader lib so it becomes its own async chunk instead of sitting in
// the critical hero bundle. Combined with the visibility gate below, the shader JS only
// downloads when a hero is near the viewport - keeping initial hydration/TBT light.
const MeshGradient = lazy(() =>
    import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient })),
)

// Re-export so callers can import the palette type alongside the hero bg component.
export type { ShaderPalette } from "./shader-palettes"
export { SHADER_PALETTES } from "./shader-palettes"

// ── Performance cap ───────────────────────────────────────────────────────────
// A full-screen WebGL canvas at device-pixel-ratio renders millions of fragments per
// frame. These are soft, blurry gradients, so ~720p of pixels is visually
// indistinguishable from 4K but costs a fraction. maxPixelCount is the hard cap on
// total rendered pixels (after DPR); minPixelRatio floors the DPR.
const MAX_PIXELS = 1280 * 720

export function ShaderHeroBg({
    colors,
    light = false, // true => add a soft wash so DARK text stays legible on a light palette
    speed = 1,
    className,
}: {
    colors?: readonly string[]
    light?: boolean
    speed?: number
    className?: string
}) {
    // Defensive fallback: if `colors` arrives empty/undefined (e.g. a server
    // component accidentally imports SHADER_PALETTES from this "use client"
    // module and gets a client-reference proxy), use the on-brand pearl palette
    // instead of crashing on `colors[0]`.
    const palette = colors && colors.length ? colors : SHADER_PALETTES.pearl
    const reduced = useReducedMotion()
    const ref = useRef<HTMLDivElement>(null)
    // Gate the WebGL canvas on visibility: it mounts just before it scrolls into view
    // and unmounts once well past, so off-screen shaders cost zero GPU/CPU.
    const [active, setActive] = useState(false)
    // Drives the mesh's fade-in: false on the frame the mesh first mounts (opacity 0),
    // flipped true one frame later so the CSS opacity transition has a real 0->1 to play.
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (typeof IntersectionObserver === "undefined") {
            setActive(true)
            return
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) setActive(e.isIntersecting)
            },
            { rootMargin: "300px 0px" }, // mount slightly before entering, unmount after leaving
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    // Fade the mesh in over the instantly-painted base color: when the shader becomes
    // active it mounts at opacity 0, then one requestAnimationFrame later we flip `shown`
    // so the transition animates 0 -> 1 (a same-commit jump to 1 wouldn't animate). The
    // gradient deepens in smoothly instead of popping, matching the content's ease-in.
    useEffect(() => {
        if (!active) {
            setShown(false)
            return
        }
        const id = requestAnimationFrame(() => setShown(true))
        return () => cancelAnimationFrame(id)
    }, [active])

    return (
        <div
            ref={ref}
            aria-hidden
            className={cn("absolute inset-0 z-0 overflow-hidden", className)}
            style={{ background: palette[0] }} // (A) instant base color = no flash / SSR-safe
        >
            {active && (
                <Suspense fallback={null}>
                    <MeshGradient
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%", // (B) fill the parent
                            // (F) fade in over the base color; reduced-motion => instant, no transition
                            opacity: reduced ? 1 : shown ? 1 : 0,
                            transition: reduced ? undefined : "opacity 900ms ease-out",
                        }}
                        colors={palette as string[]}
                        distortion={0.8}
                        swirl={0.8}
                        grainMixer={0.35} // film grain is the most expensive knob - keep it light
                        grainOverlay={0}
                        speed={reduced ? 0 : speed} // (C) reduced-motion => frozen still gradient
                        scale={1.15}
                        rotation={0}
                        offsetX={-0.14}
                        offsetY={-0.13}
                        minPixelRatio={1} // (D) floor DPR at 1
                        maxPixelCount={MAX_PIXELS} // (E) hard cap total rendered pixels
                    />
                </Suspense>
            )}
            {light && (
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(110% 90% at 18% 30%, rgba(255,253,247,0.55) 0%, transparent 55%)",
                    }}
                />
            )}
        </div>
    )
}

// Convenience wrapper for the flagship landing hero - a refined neutral pearl wash that
// sits naturally on the warm cream brand. Pass `light` so dark hero text stays legible.
export function HeroShaderBg() {
    return <ShaderHeroBg colors={SHADER_PALETTES.pearl} light />
}
