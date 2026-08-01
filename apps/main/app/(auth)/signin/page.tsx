import type { Metadata } from 'next'
import SignInClient from './_components/SignInClient'

export const metadata: Metadata = {
  title: 'Sign In | ShiprHQ',
  description: 'Sign in to your ShiprHQ account to continue your developer journey.',
}

export default function SignInPage() {
  return <SignInClient />
}
