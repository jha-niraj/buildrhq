import type { Metadata } from 'next'
import PurchaseSuccessClient from './_components/PurchaseSuccessClient'

export const metadata: Metadata = {
  title: 'Payment Successful | ShiprHQ',
  description: 'Your ShiprHQ credit purchase was successful.',
}

export default function PaymentSuccessPage() {
  return <PurchaseSuccessClient />
}
