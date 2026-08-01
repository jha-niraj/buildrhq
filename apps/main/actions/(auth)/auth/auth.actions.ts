"use server"

import { db, users } from "@repo/db"
import { auth, getSession } from "@repo/auth"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"

interface AuthResponse {
    success: boolean
    message?: string
    error?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Passwords are owned by better-auth, not by this file.
//
// Email VERIFICATION moved out first: better-auth's `emailOTP` plugin sends and
// checks the sign-up code (see packages/auth/src/auth.ts), and the register /
// sign-in pages drive it inline via `authClient.emailOtp.*`, which is also what
// mints the session on success.
//
// The password RESET flow used to live here too, and it was silently broken.
// `sendPasswordResetOTP` wrote a code onto `users.resetOTP` and
// `resetPasswordWithOTP` bcrypt-hashed the new password into
// `users.hashedPassword` -- but better-auth stores credential passwords on the
// `account` row (providerId "credential"), and never reads either column. So the
// whole flow reported "Password reset successfully" while the user's old
// password kept working and the new one was rejected at sign-in.
//
// Both are gone. /forgotpassword and /resetpassword now call
// `emailOtp.requestPasswordReset` and `emailOtp.resetPassword`, which write
// where better-auth actually looks. `users.hashedPassword`, `resetOTP`,
// `resetOTPExpiry`, `resetToken` and `restTokenExpiry` are dead columns kept
// only until the schema cleanup drops them.
// ─────────────────────────────────────────────────────────────────────────────

export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<AuthResponse> {
    try {
        const session = await getSession(headers())
        if (!session?.user?.id) {
            return { success: false, error: "Not authenticated" }
        }

        if (newPassword.length < 8) {
            return { success: false, error: "New password must be at least 8 characters" }
        }

        // Delegated to better-auth so the comparison runs against the stored
        // credential and the rewrite lands on the same record. The old version
        // compared against `users.hashedPassword`, which is null for every
        // account better-auth created -- meaning it answered "you signed up with
        // a social account" to password users and could never succeed.
        await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
                // A password change should not leave other machines signed in.
                revokeOtherSessions: true,
            },
            headers: await headers(),
        })

        // App-side flag, not something better-auth knows about: admins can force
        // a reset by setting it, and a completed change clears it.
        await db.update(users)
            .set({ mustChangePassword: false })
            .where(eq(users.id, session.user.id))

        return { success: true, message: "Password updated successfully" }
    } catch (error: unknown) {
        // better-auth signals failure by throwing an APIError carrying a code,
        // rather than by returning a result object.
        const code =
            typeof error === "object" && error !== null && "body" in error
                ? (error as { body?: { code?: string; message?: string } }).body
                : undefined

        if (code?.code === "INVALID_PASSWORD") {
            return { success: false, error: "Current password is incorrect" }
        }
        if (code?.code === "CREDENTIAL_ACCOUNT_NOT_FOUND") {
            return {
                success: false,
                error: "You signed up with a social account. Use that provider to sign in, or reset your password to set one.",
            }
        }

        console.error("Change password error:", error)
        return { success: false, error: code?.message ?? "Failed to update password" }
    }
}
