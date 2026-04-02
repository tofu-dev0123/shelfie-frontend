'use client'

import { useSignupPage } from '@/hooks/useSignupPage'
import { SignupOAuth } from '@/components/signup/SignupOAuth'
import { SignupForm } from '@/components/signup/SignupForm'

export default function SignupPage() {
  const { view } = useSignupPage()

  if (view === 'loading') return null
  if (view === 'form') return <SignupForm />
  return <SignupOAuth />
}
