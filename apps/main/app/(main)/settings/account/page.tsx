import { getSession } from '@repo/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AccountSettingsContent } from './_components/account-settings-content'
import { db, users, accounts } from '@repo/db'
import { eq } from 'drizzle-orm'

export const metadata = {
    title: 'Account Settings | ShipItHQ',
    description: 'Manage your account information and security',
}

export default async function AccountSettingsPage() {
    const session = await getSession(headers())

    if (!session?.user?.id) {
        redirect('/signin')
    }

    const [user] = await db
        .select({ id: users.id, name: users.name, email: users.email, image: users.image, emailVerified: users.emailVerified, createdAt: users.createdAt })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)

    if (!user) redirect('/signin')

    const linkedAccounts = await db
        .select({ providerId: accounts.providerId })
        .from(accounts)
        .where(eq(accounts.userId, session.user.id))

    const linkedProviders = linkedAccounts.map((a) => a.providerId)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground">Account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Update your account information and password
                </p>
            </div>
            <AccountSettingsContent
                user={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    emailVerified: user.emailVerified ?? false,
                    // Derived from the linked providers, not `users.hashedPassword`.
                    // better-auth keeps credential passwords on the `account` row,
                    // so that column is null for every account it created - this
                    // read always returned false and permanently hid the
                    // change-password form behind the "you have no password" branch.
                    hasPassword: linkedProviders.includes('credential'),
                    createdAt: user.createdAt,
                }}
                linkedProviders={linkedProviders}
            />
        </div>
    )
}
