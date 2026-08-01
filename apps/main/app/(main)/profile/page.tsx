import type { Metadata } from 'next'
import ProfileClient from './_components/ProfileClient'

export const metadata: Metadata = {
  title: 'My Profile | ShiprHQ',
  description: 'Manage your ShiprHQ developer profile, skills, projects, and work experience.',
}

export default function ProfilePage() {
  return <ProfileClient />
}
