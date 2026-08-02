import type { Metadata } from 'next'
import PurchaseSuccessClient from './_components/PurchaseSuccessClient'

export const metadata: Metadata = {
  title: 'Payment Successful | ShipItHQ',
  description: 'Your ShipItHQ credit purchase was successful.',
}

export default function PaymentSuccessPage() {
  return <PurchaseSuccessClient />
}
