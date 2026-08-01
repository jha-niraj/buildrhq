import type { Metadata } from 'next'
import ResetPasswordClient from './_components/ResetPasswordClient'

export const metadata: Metadata = {
  title: 'Set New Password | ShiprHQ',
  description: 'Set a new password for your ShiprHQ account.',
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
