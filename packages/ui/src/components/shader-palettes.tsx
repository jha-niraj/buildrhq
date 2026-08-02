// Shader palette data lives in this PLAIN module (no "use client") on purpose.
// `hero-shader-bg.tsx` is a client component, and a server component that imports a
// data export from a client module receives a client-reference proxy, not the real
// object - so `SHADER_PALETTES.emerald` would resolve to `undefined` during prerender
// and crash on `colors[0]`. Keeping the data here lets both server and client import it.
//
// Curated for the ShipItHQ brand: professional / premium only. NO blue, indigo,
// purple, or brown. Each palette is 4 colors ordered light -> deep (light palettes,
// dark text on top) or near-black base -> bright accent (dark palettes, white text on top).
export const SHADER_PALETTES = {
    // ── Light (use the `light` prop; dark text reads on top) ─────────────────
    pearl: ["#FBFAF7", "#EFEDE5", "#D8D5C8", "#A7A89C"], // neutral cream, on-brand
    mint: ["#F2FBF6", "#DCF3E6", "#B3E6C8", "#5FB98A"], // soft green
    sageLight: ["#F5F7F1", "#E5EDDD", "#C6D8B6", "#8FBF72"], // muted herb green

    // ── Dark (white text reads on top) ───────────────────────────────────────
    emerald: ["#06100c", "#0a1f17", "#136046", "#34b481"],
    jade: ["#04100e", "#08201d", "#0f5e52", "#2fc7a8"],
    crimson: ["#0d0707", "#1f0d0d", "#7a1f25", "#e0555b"],
    graphite: ["#0a0a0c", "#15151a", "#33333d", "#8a8a96"], // premium neutral, no blue cast
    sage: ["#0a0e0a", "#161d14", "#3f5a36", "#8fbf72"],
    olive: ["#0c0d05", "#1a1c0a", "#5c5e1f", "#b8bd4a"],
} as const

export type ShaderPalette = keyof typeof SHADER_PALETTES
