import type { Metadata } from 'next'
import TransactionsClient from './_components/TransactionsClient'

export const metadata: Metadata = {
  title: 'Transaction History | ShiprHQ',
  description: 'View your ShiprHQ credit purchase and usage history.',
}

export default function TransactionsPage() {
  return <TransactionsClient />
}
