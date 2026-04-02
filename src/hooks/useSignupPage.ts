import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { login } from '@/lib/api/auth'
import { MESSAGES } from '@/constants/messages'

export type SignupView = 'oauth' | 'form' | 'loading'

/**
 * サインアップページの表示状態を管理するフック。
 * Clerk の認証状態に応じて OAuth 画面・プロフィール設定フォームを切り替える。
 * @returns view - 現在表示すべき画面の種別
 */
export const useSignupPage = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const router = useRouter()
  const [view, setView] = useState<SignupView>('loading')
  // ページ滞在中に login() を複数回呼ばないためのフラグ
  const loginAttempted = useRef(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setView('oauth')
      return
    }
    if (loginAttempted.current) return
    loginAttempted.current = true

    const tryLogin = async () => {
      try {
        const token = await getToken()
        if (!token) {
          toast.error(MESSAGES.AUTH.SIGNUP_ERROR)
          setView('oauth')
          return
        }
        const result = await login(token)
        if (result === 'ok') {
          router.push('/')
        } else {
          setView('form')
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error(MESSAGES.AUTH.LOGIN_AUTH_ERROR)
        } else {
          toast.error(MESSAGES.AUTH.LOGIN_ERROR)
        }
        setView('oauth')
      }
    }

    tryLogin()
  }, [isSignedIn, isLoaded, getToken, router])

  return { view }
}
