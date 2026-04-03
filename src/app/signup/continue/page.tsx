'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSignupPage } from '@/hooks/useSignupPage'
import { SignupForm } from '@/components/signup/SignupForm'

export default function SignupContinuePage() {
  const { view } = useSignupPage()
  const router = useRouter()

  useEffect(() => {
    if (view === 'oauth') router.push('/signup')
  }, [view, router])

  if (view === 'loading' || view === 'oauth') return null
  return <SignupForm />
}
