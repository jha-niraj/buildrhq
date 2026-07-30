'use server'

import { db, contactMessages } from '@repo/db'

// The marketing site's second and last database touchpoint (the other is the read-only
// landing stats). No auth, no user records, no session - just capturing an inbound lead.

export interface ContactInput {
    name: string
    email: string
    subject: string
    message: string
}

export interface ContactResult {
    success: boolean
    message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Column limits kept generous but bounded - an unbounded text column reachable from a
// public form is a free disk-fill for anyone who notices.
const LIMITS = { name: 120, email: 254, subject: 200, message: 5000 } as const

export async function submitContactMessage(input: ContactInput): Promise<ContactResult> {
    const name = input.name?.trim() ?? ''
    const email = input.email?.trim().toLowerCase() ?? ''
    const subject = input.subject?.trim() ?? ''
    const message = input.message?.trim() ?? ''

    if (!name || !email || !subject || !message) {
        return { success: false, message: 'Please fill in every field.' }
    }
    if (!EMAIL_RE.test(email)) {
        return { success: false, message: 'Please enter a valid email address.' }
    }
    if (
        name.length > LIMITS.name ||
        email.length > LIMITS.email ||
        subject.length > LIMITS.subject ||
        message.length > LIMITS.message
    ) {
        return { success: false, message: 'One of those fields is too long. Please shorten it.' }
    }

    try {
        await db.insert(contactMessages).values({ name, email, subject, message })
        return { success: true, message: "Thanks - we'll get back to you within two working days." }
    } catch (error) {
        console.error('contact submission failed:', error)
        return { success: false, message: 'Something went wrong. Please email us directly instead.' }
    }
}
