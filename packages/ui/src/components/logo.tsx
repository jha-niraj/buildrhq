/**
 * The ShiprHQ mark.
 *
 * Six blocks climbing a diagonal - a contribution grid, a passing build,
 * progress stacking up. Inline SVG rather than an <img> so it inherits
 * `currentColor` and needs no light/dark variant, no network request, and no
 * layout shift.
 *
 * Geometry matches public/logo.svg and app/icon.svg exactly (94px blocks,
 * radius 15, gap 24, on a 512 grid, spanning 91-421 so it is centred at
 * 256,256 and fills ~65% of the canvas). If the mark ever changes, those three
 * have to move together.
 *
 * Not a client component: no state, no handlers.
 */
export function Logo({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 512 512"
            className={className}
            fill="currentColor"
            role="img"
            aria-label="ShiprHQ"
        >
            <rect x="91" y="327" width="94" height="94" rx="15" />
            <rect x="209" y="327" width="94" height="94" rx="15" />
            <rect x="327" y="327" width="94" height="94" rx="15" />
            <rect x="209" y="209" width="94" height="94" rx="15" />
            <rect x="327" y="209" width="94" height="94" rx="15" />
            <rect x="327" y="91" width="94" height="94" rx="15" />
        </svg>
    )
}

/**
 * The mark inside its black tile, matching the favicon and app icon.
 *
 * Use where the brand needs to read as a discrete badge (sidebar header, auth
 * panel). `Logo` on its own is for places that already have a surface.
 */
export function LogoTile({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white ${className}`}
        >
            <Logo className="h-[58%] w-[58%] text-white dark:text-neutral-900" />
        </span>
    )
}

export default Logo
