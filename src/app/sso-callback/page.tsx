'use client'

import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function SSOCallbackPage() {
  const clerk = useClerk()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const router = useRouter()
  const hasRun = useRef(false)

  useEffect(() => {
    ;(async () => {
      if (!clerk.loaded || !signIn || !signUp || hasRun.current) return
      hasRun.current = true

      const toSignupContinue = async ({ decorateUrl }: { decorateUrl: (url: string) => string }) => {
        router.push(decorateUrl('/signup/continue'))
      }

      // ケース1: signUpフロー → 既存Clerkアカウントあり（signInに転送してfinalize）
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true })
        await signIn.finalize({ navigate: toSignupContinue })
        return
      }

      // ケース2: signInフロー → 新規ユーザー（signUpに転送）
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true })
      }

      // ケース3: サインアップ完了
      if (signUp.status === 'complete') {
        await signUp.finalize({ navigate: toSignupContinue })
        return
      }

      // ケース4: 追加要件あり（Clerkがusernameを必須とする場合など）
      if (signUp.status === 'missing_requirements') {
        router.push('/signup/continue')
        return
      }
    })()
  }, [clerk, signIn, signUp, router])

  return (
    <div>
      <div id="clerk-captcha" />
    </div>
  )
}
