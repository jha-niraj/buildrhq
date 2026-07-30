/* global process */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },

    // @repo/* are workspace packages that ship raw .ts/.tsx straight from src/ with no
    // build step, so Next has to compile them itself. Required on Next 16.
    transpilePackages: ["@repo/ui", "@repo/db", "@repo/auth", "@repo/email"],

    env: {
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },

    serverExternalPackages: ["@prisma/client", "prisma", "sass"],

    reactStrictMode: true,
};

export default nextConfig;
