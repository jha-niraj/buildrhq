import type { Metadata } from 'next'
import AIHubClient from './_components/AIHubClient'

export const metadata: Metadata = {
  title: 'AI Tools | ShiprHQ',
  description: 'Supercharge your job search with AI-powered resume builder, cover letter generator, and mock interview tools.',
}

export default function AiToolsPage() {
  return <AIHubClient />
}
