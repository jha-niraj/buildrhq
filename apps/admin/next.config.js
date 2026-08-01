/* global process */
/** @type {import('next').NextConfig} */
const nextConfig = {
    // @repo/* ship raw .tsx/.ts source (their exports point straight at ./src/**),
    // so Next has to compile them as app source. Without this, Turbopack treats
    // them as external packages and compiles them — and their dependency chain,
    // framer-motion -> motion-dom -> next/dist/build/polyfills/process.js — on a
    // separate path from the app's own graph. The two graphs then disagree about
    // module identity across an HMR rebuild, which surfaces as
    // "module factory is not available" pointing at a @repo/ui file.
    // uni, hiring and web already set this; main and admin did not.
    transpilePackages: ["@repo/ui", "@repo/db", "@repo/auth", "@repo/email"],
    images: {
        unoptimized: true,
    },

    env: {
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },

    serverExternalPackages: ["@prisma/client", "prisma", "sass"],

    reactStrictMode: true,

};

export default nextConfig;