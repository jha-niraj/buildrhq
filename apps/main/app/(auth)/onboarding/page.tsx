import type { Metadata } from 'next'
import OnboardingClient from './_components/OnboardingClient'

export const metadata: Metadata = {
  title: 'Complete Your Profile | ShiprHQ',
  description: 'Set up your ShiprHQ developer profile to get personalized recommendations.',
}

export default function OnboardingPage() {
  return <OnboardingClient />
}
