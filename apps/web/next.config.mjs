/* global process */

// The authenticated product lives on a separate deploy (app.buildrhq.com).
// Any app/auth path that still lands on the marketing host is 307'd across to
// the app, preserving the query string so deep links (?callbackUrl=…, ?plan=…)
// survive the hop.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4101";

// Paths owned by the app, not the marketing site.
const APP_PATHS = [
    "/signin", "/signup", "/register", "/verify", "/onboarding",
    "/forgotpassword", "/resetpassword", "/error",
    "/home", "/dashboard", "/profile", "/settings",
    "/purchase", "/transactions", "/sharecredits", "/referrals",
    "/ai", "/chat", "/practice", "/mock", "/pathfinder",
    "/projects", "/knowme", "/leaderboard", "/achievements", "/feedback",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },

    // Expose to the browser (marketing navbar/hero read the session + deep-link
    // CTAs into the app).
    env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    },

    async redirects() {
        return APP_PATHS.flatMap((p) => ([
            { source: p, destination: `${APP_URL}${p}`, permanent: false },
            { source: `${p}/:path*`, destination: `${APP_URL}${p}/:path*`, permanent: false },
        ]));
    },

    reactStrictMode: true,
};

export default nextConfig;
