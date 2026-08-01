import type { Metadata } from 'next'
import AllProjectsClient from './_components/AllProjectsClient'

export const metadata: Metadata = {
  title: 'All Projects | ShiprHQ',
  description: 'Browse all available projects on ShiprHQ.',
}

export default function AllProjectsPage() {
  return <AllProjectsClient />
}
