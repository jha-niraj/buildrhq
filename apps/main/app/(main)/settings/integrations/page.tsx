import { getSession } from '@repo/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSocialConnections } from '@/actions/(main)/social/social-connections.action'
import { IntegrationsContent } from './_components/integrations-content'

export const metadata = {
    title: 'Integrations | Settings | ShiprHQ',
    description: 'Connect GitHub and social accounts',
}

export default async function IntegrationsPage() {
    const session = await getSession(headers())

    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getSocialConnections()

    return (
        <IntegrationsContent
            socialConnections={result.success ? result.connections || [] : []}
        />
    )
}
