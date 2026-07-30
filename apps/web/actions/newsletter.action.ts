'use server'

import { db, newsletters } from '@repo/db'
import { eq } from 'drizzle-orm'

// One of only two reasons the marketing site touches the database: capturing a lead.
// (The other is the read-only landing stats.) No auth, no user records, no session.

export interface SubscribeResult {
    success: boolean
    message: string
}

// Deliberately conservative: catches the shapes a real signup form produces without
// trying to be an RFC 5322 parser.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribeToNewsletter(rawEmail: string): Promise<SubscribeResult> {
    const email = rawEmail.trim().toLowerCase()

    if (!EMAIL_RE.test(email) || email.length > 254) {
        return { success: false, message: 'Please enter a valid email address.' }
    }

    try {
        const [existing] = await db
            .select({ id: newsletters.id, isActive: newsletters.isActive })
            .from(newsletters)
            .where(eq(newsletters.email, email))
            .limit(1)

        if (existing) {
            // Re-subscribing after an unsubscribe should quietly reactivate rather than
            // fail on the unique index.
            if (!existing.isActive) {
                await db
                    .update(newsletters)
                    .set({ isActive: true, subscribedAt: new Date() })
                    .where(eq(newsletters.id, existing.id))
            }
            return { success: true, message: "You're on the list." }
        }

        await db.insert(newsletters).values({ email })
        return { success: true, message: 'Thanks for subscribing.' }
    } catch (error) {
        console.error('newsletter subscribe failed:', error)
        return { success: false, message: 'Something went wrong. Please try again.' }
    }
}
