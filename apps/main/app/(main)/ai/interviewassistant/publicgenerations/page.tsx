import type { Metadata } from 'next'
import PublicGenerationsClient from './_components/PublicGenerationsClient'

export const metadata: Metadata = {
  title: 'Community Interview Generations | ShiprHQ',
  description: 'Browse publicly shared AI interview preparation sessions from the ShiprHQ community.',
}

export default function PublicGenerationsPage() {
  return <PublicGenerationsClient />
}
