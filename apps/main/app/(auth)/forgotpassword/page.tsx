import type { Metadata } from 'next'
import ForgotPasswordClient from './_components/ForgotPasswordClient'

export const metadata: Metadata = {
  title: 'Reset Password | ShiprHQ',
  description: 'Reset your ShiprHQ account password.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />
}
