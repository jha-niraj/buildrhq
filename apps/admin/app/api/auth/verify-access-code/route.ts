import { NextRequest, NextResponse } from "next/server"
import { db, users, accounts, adminAccess, adminInvitations, adminAuditLogs } from "@repo/db"
import { eq, and } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    try {
        const { email, accessCode } = await request.json()

        if (!email || !accessCode) {
            return NextResponse.json(
                { success: false, message: "Email and access code are required" },
                { status: 400 }
            )
        }

        // Find the invitation
        const invitation = await db.query.adminInvitations.findFirst({
            where: and(
                eq(adminInvitations.email, email.toLowerCase()),
                eq(adminInvitations.code, accessCode.toUpperCase()),
                eq(adminInvitations.status, "PENDING")
            )
        })

        if (!invitation) {
            return NextResponse.json(
                { success: false, message: "Invalid access code or email" },
                { status: 401 }
            )
        }

        // Check if expired
        if (new Date() > invitation.expiresAt) {
            await db.update(adminInvitations)
                .set({ status: "EXPIRED" })
                .where(eq(adminInvitations.id, invitation.id))
            return NextResponse.json(
                { success: false, message: "Access code has expired" },
                { status: 401 }
            )
        }

        // Find or create user
        let user = await db.query.users.findFirst({
            where: eq(users.email, email.toLowerCase())
        })

        // The access code becomes this account's credential password so the client
        // can immediately sign in with it. It has to land on the `account` row:
        // better-auth verifies against that, and never reads
        // `users.hashedPassword` (which is what this route used to set, so the
        // sign-in that follows could never succeed).
        const hashedPassword = await bcrypt.hash(accessCode, 12)

        if (!user) {
            const newUsers = await db.insert(users).values({
                email: email.toLowerCase(),
                name: invitation.name || email.split("@")[0],
                emailVerified: true,
                role: "Admin"
            }).returning()
            user = newUsers[0]
        } else {
            await db.update(users)
                .set({ role: "Admin" })
                .where(eq(users.id, user.id))
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
        }

        // Upsert the credential account. `accountId` mirrors the user id, which is
        // what better-auth stores for the credential provider.
        const existingCredential = await db.query.accounts.findFirst({
            where: and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential")),
        })

        if (existingCredential) {
            await db.update(accounts)
                .set({ password: hashedPassword })
                .where(eq(accounts.id, existingCredential.id))
        } else {
            await db.insert(accounts).values({
                userId: user.id,
                accountId: user.id,
                providerId: "credential",
                password: hashedPassword,
            })
        }

        // Check if admin access already exists
        let adminAccessRecord = await db.query.adminAccess.findFirst({
            where: eq(adminAccess.userId, user.id)
        })

        if (!adminAccessRecord) {
            // Create admin access
            const newAdminAccesses = await db.insert(adminAccess).values({
                userId: user.id,
                adminRole: invitation.adminRole,
                permissions: invitation.permissions || {},
                status: "ACTIVE",
                inviteCode: accessCode
            }).returning()
            adminAccessRecord = newAdminAccesses[0]
        }

        if (!adminAccessRecord) {
            return NextResponse.json({ success: false, message: "Failed to create admin access" }, { status: 500 })
        }

        // Update invitation status
        await db.update(adminInvitations)
            .set({ status: "USED", usedBy: user.id, usedAt: new Date() })
            .where(eq(adminInvitations.id, invitation.id))

        // Create audit log
        await db.insert(adminAuditLogs).values({
            adminId: adminAccessRecord.id,
            action: "LOGIN",
            module: "admin_management",
            resourceType: "AdminAccess",
            resourceId: adminAccessRecord.id,
            description: `Admin ${email} logged in via access code`
        })

        return NextResponse.json({
            success: true,
            message: "Access code verified successfully",
            needsPasswordSetup: true
        })

    } catch (error) {
        console.error("Verify access code error:", error)
        return NextResponse.json(
            { success: false, message: "An error occurred" },
            { status: 500 }
        )
    }
}
