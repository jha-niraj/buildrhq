import type { Metadata } from 'next'
import MockHubClient from './_components/MockHubClient'

export const metadata: Metadata = {
  title: 'Mock Interviews | ShiprHQ',
  description: 'Practice technical interviews with a real-time AI voice interviewer and get instant, detailed feedback.',
}

export default function MockInterviewLandingPage() {
  return <MockHubClient />
}
