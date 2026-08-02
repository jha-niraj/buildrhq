import type { Metadata } from 'next'
import TransactionsClient from './_components/TransactionsClient'

export const metadata: Metadata = {
  title: 'Transaction History | ShipItHQ',
  description: 'View your ShipItHQ credit purchase and usage history.',
}

export default function TransactionsPage() {
  return <TransactionsClient />
}
