import type { Metadata } from 'next'
import AllProjectsClient from './_components/AllProjectsClient'

export const metadata: Metadata = {
  title: 'All Projects | ShipItHQ',
  description: 'Browse all available projects on ShipItHQ.',
}

export default function AllProjectsPage() {
  return <AllProjectsClient />
}
