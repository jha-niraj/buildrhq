import { createAuthClient } from "better-auth/react";
import {
    emailOTPClient,
    magicLinkClient,
    inferAdditionalFields,
} from "better-auth/client/plugins";

// The marketing site (web) has no auth API of its own — its auth client must talk
// to the app deploy. Set NEXT_PUBLIC_AUTH_URL to the app origin (e.g.
// https://app.buildrhq.com) there. Apps that host their own /api/auth leave it
// unset and fall back to the current origin. Cross-subdomain session cookies
// (see packages/auth/src/auth.ts) make the shared session readable from web.
const authBaseURL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined);

// No explicit return-type annotation: annotating this erases the plugin and
// additionalFields inference, which is what types `authClient.emailOtp.*`,
// `signIn.magicLink` and `session.user.onboardingCompleted`.
export const authClient = createAuthClient({
    baseURL: authBaseURL,
    plugins: [
        emailOTPClient(),
        magicLinkClient(),
        // Mirrors `user.additionalFields` on the server so the client session is
        // typed with our custom columns. Keep in sync with packages/auth/src/auth.ts.
        inferAdditionalFields({
            user: {
                role: { type: "string", required: false },
                onboardingStep: { type: "number", required: false },
                onboardingCompleted: { type: "boolean", required: false },
                username: { type: "string", required: false },
                referralCode: { type: "string", required: false },
                totalCredits: { type: "number", required: false },
                totalXp: { type: "number", required: false },
                currentLevel: { type: "number", required: false },
                bio: { type: "string", required: false },
                headline: { type: "string", required: false },
                location: { type: "string", required: false },
                githubUrl: { type: "string", required: false },
                linkedinUrl: { type: "string", required: false },
                twitterUrl: { type: "string", required: false },
                websiteUrl: { type: "string", required: false },
            },
        }),
    ],
});

export const {
    signIn,
    signOut,
    signUp,
    useSession,
    getSession,
    emailOtp,
    forgetPassword,
    resetPassword,
} = authClient;
