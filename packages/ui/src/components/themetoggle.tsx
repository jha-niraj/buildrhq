"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@repo/ui/lib/utils"
import { startThemeTransition } from "@repo/ui/lib/theme-transition"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()

    // `resolvedTheme` is undefined during SSR and on the first client render -
    // next-themes can only know the real theme once it has read localStorage and
    // the <html> class. Branching on it directly made the server emit the light
    // classes and the client emit the dark ones, which React reported as a
    // hydration mismatch and recovered from by throwing away and re-rendering
    // this subtree. Since the toggle sits in the sidebar footer, that happened on
    // every page load, in every app.
    //
    // Gating on `mounted` makes the server render and the first client render
    // identical by construction. The correct state lands one frame later.
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const isDark = mounted && resolvedTheme === "dark"

    const toggle = (e?: React.MouseEvent) => {
        // Passing an origin runs the directional wipe (light->dark L->R, dark->light
        // R->L; direction is derived from the current theme inside the helper). The
        // coords themselves don't steer the wipe, so a keyboard toggle passes {0,0}.
        startThemeTransition(
            () => setTheme(isDark ? "light" : "dark"),
            e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 },
        )
    }

    return (
        <div
            className={cn(
                "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
                !mounted && "transition-none",
                isDark
                    ? "bg-zinc-950 border border-zinc-800"
                    : "bg-white border border-zinc-200",
                className
            )}
            onClick={toggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle() } }}
            role="button"
            tabIndex={0}
            aria-label="Toggle theme"
        >
            <div className="flex justify-between items-center w-full">
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        !mounted && "transition-none",
                        isDark
                            ? "transform translate-x-0 bg-zinc-800"
                            : "transform translate-x-8 bg-gray-200"
                    )}
                >
                    {
                        isDark ? (
                            <Moon
                                className="w-4 h-4 text-white"
                                strokeWidth={1.5}
                            />
                        ) : (
                            <Sun
                                className="w-4 h-4 text-gray-700"
                                strokeWidth={1.5}
                            />
                        )
                    }
                </div>
                <div
                    className={cn(
                        "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
                        !mounted && "transition-none",
                        isDark
                            ? "bg-transparent"
                            : "transform -translate-x-8"
                    )}
                >
                    {
                        isDark ? (
                            <Sun
                                className="w-4 h-4 text-gray-500"
                                strokeWidth={1.5}
                            />
                        ) : (
                            <Moon
                                className="w-4 h-4 text-black"
                                strokeWidth={1.5}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ThemeToggle
