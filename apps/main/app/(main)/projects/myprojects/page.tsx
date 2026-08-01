import type { Metadata } from 'next'
import MyProjectsClient from './_components/MyProjectsClient'

export const metadata: Metadata = {
  title: 'My Projects | ShiprHQ',
  description: 'Track your ongoing and completed ShiprHQ projects.',
}

export default function MyProjectsPage() {
  return <MyProjectsClient />
}
