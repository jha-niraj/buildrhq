"use client"

import React from "react"

// The marketing site is intentionally light: no user context, no data-store
// providers. Anything client-global (analytics, theme) is wired in layout.tsx.
export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}
