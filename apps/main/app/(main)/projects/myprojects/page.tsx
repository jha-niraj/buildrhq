import type { Metadata } from 'next'
import MyProjectsClient from './_components/MyProjectsClient'

export const metadata: Metadata = {
  title: 'My Projects | ShipItHQ',
  description: 'Track your ongoing and completed ShipItHQ projects.',
}

export default function MyProjectsPage() {
  return <MyProjectsClient />
}
