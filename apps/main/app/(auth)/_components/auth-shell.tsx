"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Code2 } from "lucide-react"
import { ThemeToggle } from "@repo/ui/components/themetoggle"
import { AuthVisual } from "./auth-visual"

/**
 * The two-column shell every auth screen sits in.
 *
 * Both columns are `h-screen` and the right column scrolls internally. That is the
 * whole point: sign-in swaps between password / magic-link / verify modes, and
 * those three have different heights. With an auto-height shell the panels resized
 * on every switch and the brand column visibly jumped. Pinning the height means the
 * layout is identical in all three modes and only the form content changes.
 *
 * The theme toggle lives bottom-left, on the brand column, so it is reachable
 * before sign-in without competing with the form for attention.
 */
export function AuthShell({
    children,
    headline,
    sub,
    quote,
}: {
    children: ReactNode
    headline: ReactNode
    sub?: string
    quote?: string
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-neutral-950">
            {/* ── Brand column ── */}
            <aside className="relative hidden h-screen w-1/2 flex-col justify-between overflow-hidden bg-neutral-950 p-10 lg:flex xl:p-12">
                {/* Subtle grid + the animated build pipeline behind the copy. */}
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <AuthVisual className="absolute -right-16 top-1/2 h-[560px] w-[560px] -translate-y-1/2 opacity-70" />

                <Link href="/" className="relative z-10 flex w-fit items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <Code2 className="h-5 w-5 text-white" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-white">BuildrHQ</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
                        {headline}
                    </h2>
                    {sub && <p className="mt-4 text-base leading-relaxed text-white/55">{sub}</p>}
                    {quote && (
                        <p className="mt-8 border-l border-white/15 pl-4 text-sm italic leading-relaxed text-white/45">
                            {quote}
                        </p>
                    )}
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                        Learn · Build · Get hired
                    </p>
                    <ThemeToggle />
                </div>
            </aside>

            {/* ── Form column. Scrolls internally so the shell never grows. ── */}
            <main className="flex h-screen w-full flex-col overflow-y-auto lg:w-1/2">
                <div className="flex min-h-full items-center justify-center px-6 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        {/* Mobile brand + theme toggle — the aside is hidden below lg. */}
                        <div className="mb-8 flex items-center justify-between lg:hidden">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">
                                    <Code2 className="h-4 w-4 text-white dark:text-neutral-900" />
                                </span>
                                <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                                    BuildrHQ
                                </span>
                            </Link>
                            <ThemeToggle />
                        </div>

                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AuthShell
