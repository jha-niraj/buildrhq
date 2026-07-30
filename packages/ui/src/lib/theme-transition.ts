import { flushSync } from "react-dom"

// Animated theme switch via the View Transitions API: a directional horizontal WIPE
// of the new theme - light->dark wipes LEFT-to-RIGHT, dark->light wipes RIGHT-to-LEFT.
// A straight `clip-path: inset()` wipe (not a corner circle) keeps the reveal edge
// vertical. Direction is chosen by the theme we switch TO, not the click point.
//
// Pairs with the CSS in packages/ui/src/styles/globals.css (the
// html[data-theme-transition] view-transition rules + the vt-theme-reveal keyframe).
//
// disableTransitionOnChange (set on every ThemeProvider) kills CSS transitions at
// switch time, so a View-Transition is the only thing that animates. flushSync applies
// the <html> class synchronously inside the callback so the "after" snapshot is
// correct. The clip is driven by a CSS keyframe (bound with `both`), NOT a JS
// .animate() after transition.ready - binding the keyframe means the new snapshot is
// clipped from its first frame, so there's no flash-then-jump.

/** The click point the reveal expands from (its presence = reveal vs fade). */
export type ThemeTransitionOrigin = { x: number; y: number }

type DocumentWithViewTransition = Document & {
    startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> }
}

export function startThemeTransition(apply: () => void, origin?: ThemeTransitionOrigin): void {
    const doc = typeof document !== "undefined"
        ? (document as DocumentWithViewTransition)
        : undefined
    const prefersReduced = typeof window !== "undefined"
        && typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Unsupported (e.g. Firefox) or reduced-motion: swap instantly, no animation.
    if (!doc?.startViewTransition || prefersReduced) {
        apply()
        return
    }

    const root = document.documentElement
    if (origin) {
        // Direction chosen by the theme we switch TO. attribute="class" -> `dark` on
        // <html> means dark theme, so the absence of `dark` right now means this
        // toggle turns dark ON.
        const goingToDark = !root.classList.contains("dark")
        // inset(top right bottom left): the far edge starts collapsed at 100%, then
        // animates to 0. light->dark collapses from the RIGHT (wipes L->R); dark->light
        // collapses from the LEFT (wipes R->L).
        const clipFrom = goingToDark ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"
        root.style.setProperty("--vt-clip-from", clipFrom)
    }
    // reveal = directional wipe (user toggle); fade = cross-fade (programmatic, no origin).
    root.dataset.themeTransition = origin ? "reveal" : "fade"

    const transition = doc.startViewTransition(() => flushSync(apply))
    transition.finished
        .catch(() => {
            // A superseding transition (rapid re-toggle) rejects - safe to ignore.
        })
        .finally(() => {
            delete root.dataset.themeTransition
            root.style.removeProperty("--vt-clip-from")
        })
}
