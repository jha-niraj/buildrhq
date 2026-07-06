'use server'

import { getSession } from '@repo/auth'
import { headers } from 'next/headers'
import { db, socialConnections } from '@repo/db'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Social account connections (Twitter / LinkedIn) shown on Settings → Integrations.
// (Split out of the removed achievements module; only the connection management
// functions are kept.)

export async function getSocialConnections() {
    try {
        const session = await getSession(headers())
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const connections = await db.query.socialConnections.findMany({
            where: eq(socialConnections.userId, session.user.id),
            columns: {
                id: true,
                provider: true,
                accountName: true,
                accountHandle: true,
                accountImage: true,
                isActive: true,
                connectedAt: true,
            },
        })

        return { success: true, connections }
    } catch (error) {
        console.error('Error fetching social connections:', error)
        return { success: false, error: 'Failed to fetch connections' }
    }
}

export async function disconnectSocialAccount(provider: 'TWITTER' | 'LINKEDIN') {
    try {
        const session = await getSession(headers())
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        await db.delete(socialConnections)
            .where(and(
                eq(socialConnections.userId, session.user.id),
                eq(socialConnections.provider, provider)
            ))

        revalidatePath('/settings/integrations')
        return { success: true }
    } catch (error) {
        console.error('Error disconnecting social account:', error)
        return { success: false, error: 'Failed to disconnect account' }
    }
}
