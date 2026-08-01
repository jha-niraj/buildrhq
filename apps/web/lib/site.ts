// Single source of truth for the marketing site's own origin and the authenticated
// app's origin.
//
// Before this file existed, `NEXT_PUBLIC_WEB_URL` and `NEXT_PUBLIC_BASE_URL` were used
// interchangeably across layout/sitemap/robots/blog metadata. Mixing them silently
// produced canonical URLs, sitemap URLs and JSON-LD `@id`s that disagreed with each
// other, which is the single fastest way to lose an index. Everything reads SITE now.

/** This marketing site's canonical, no-trailing-slash origin (shiprhq.com). */
export const SITE = (
    process.env.NEXT_PUBLIC_WEB_URL ?? "https://www.shiprhq.com"
).replace(/\/$/, "");

/**
 * The authenticated product deploy (app.shiprhq.com). The marketing site never
 * renders auth UI or reads a session - it only deep-links here. Anything that needs
 * a logged-in user lives behind this origin.
 */
export const APP_URL = (
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:6001"
).replace(/\/$/, "");

/** Canonical CTA destinations on the app. Keep every "Get started"/"Sign in" here. */
export const APP_LINKS = {
    signup: `${APP_URL}/signup`,
    signin: `${APP_URL}/signin`,
    dashboard: `${APP_URL}/home`,
} as const;

/** Public brand identity reused by metadata, JSON-LD and the footer. */
export const BRAND = {
    name: "ShiprHQ",
    legalName: "ShiprHQ",
    tagline: "The Engineering Intelligence Suite",
    logo: `${SITE}/mainlogo.png`,
    email: "niraj@getcreatr.com",
    social: {
        twitter: "https://x.com/shiprhq",
        github: "https://github.com/jha-niraj",
        linkedin: "https://www.linkedin.com/company/shiprhq",
    },
} as const;

/** Absolute URL helper - JSON-LD and OG tags must never emit relative paths. */
export function abs(path: string): string {
    return path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}
