import { createAuthClient } from "better-auth/react";

// The marketing site (web) has no auth API of its own — its auth client must talk
// to the app deploy. Set NEXT_PUBLIC_AUTH_URL to the app origin (e.g.
// https://app.buildrhq.com) there. Apps that host their own /api/auth leave it
// unset and fall back to the current origin. Cross-subdomain session cookies
// (see packages/auth/src/auth.ts) make the shared session readable from web.
const authBaseURL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined);

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
    baseURL: authBaseURL,
});

export const {
    signIn,
    signOut,
    signUp,
    useSession,
    getSession,
} = authClient;