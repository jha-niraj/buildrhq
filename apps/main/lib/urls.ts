// ─────────────────────────────────────────────────────────────────────────────
// Shareable URLs.
//
// Every link a user copies out of the product is built here, for two reasons
// that both bit us:
//
//  1. `window.location.origin` is not available during a server render, and the
//     usual guard — `typeof window !== "undefined" ? window.location.origin : ""`
//     — silently degrades to a RELATIVE url rather than failing. A component
//     that renders one of these server-side hands the user "/profile/alice" to
//     paste into Slack. `NEXT_PUBLIC_BASE_URL` is available in both environments,
//     so the value is right on the first render with no browser global involved.
//
//  2. Even in the browser, `window.location.origin` is the origin the AUTHOR is
//     on, not the one the recipient can reach. Copying a share link from a
//     preview deploy or from localhost produced a link nobody else could open.
//     The canonical origin is a deploy-time fact, not a runtime one.
//
// The path builders exist because the paths were wrong: the share modal was
// handing out `/u/{username}` and the resume tab `/resume/{username}`, neither
// of which is a route in this app. Both 404'd for every recipient. Keeping the
// paths beside the route they name is what stops that recurring.
// ─────────────────────────────────────────────────────────────────────────────

/** This deploy's own public origin, with no trailing slash. */
export function appOrigin(): string {
    const configured = process.env.NEXT_PUBLIC_BASE_URL;
    if (configured) return configured.replace(/\/+$/, "");
    // Only reached when the env var is unset — a misconfiguration rather than a
    // supported mode. Prefer the live origin over the production guess, since a
    // link that works locally beats one that points at the wrong host entirely.
    if (typeof window !== "undefined") return window.location.origin;
    return "https://app.buildrhq.com";
}

/** Absolute url for an app-relative path. */
export function absoluteUrl(path: string): string {
    return `${appOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** A user's public profile — app/(main)/profile/[username]. */
export function publicProfileUrl(username: string): string {
    return absoluteUrl(`/profile/${encodeURIComponent(username)}`);
}

/** A user's published resume — app/(main)/ai/resume/[username]. */
export function publicResumeUrl(username: string): string {
    return absoluteUrl(`/ai/resume/${encodeURIComponent(username)}`);
}

/** A shared resume draft by its share slug — app/(main)/r/[slug]. */
export function resumeShareUrl(shareSlug: string): string {
    return absoluteUrl(`/r/${encodeURIComponent(shareSlug)}`);
}

/** A project's shareable leaderboard — app/(main)/projects/[slug]/leaderboard. */
export function projectLeaderboardUrl(slug: string, username: string): string {
    const params = new URLSearchParams({ username, showProgress: "true" });
    return absoluteUrl(`/projects/${encodeURIComponent(slug)}/leaderboard?${params}`);
}
