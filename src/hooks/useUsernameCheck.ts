import { useState, useEffect } from 'react'
import axios from 'axios'
import { checkUsername } from '@/lib/api/users'

export type UsernameCheckStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

/**
 * ユーザー名の重複チェックを行うフック。入力変更から400msのdebounceを設ける。
 * 3文字未満または形式不正の場合はAPIを呼ばずidleに戻す（Zodバリデーションに委ねる）。
 * @param username - チェックするユーザー名（RHFのwatch値）
 * @returns status - チェック状態
 */
export const useUsernameCheck = (username: string) => {
  const [status, setStatus] = useState<UsernameCheckStatus>('idle')

  useEffect(() => {
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setStatus('idle')
      return
    }

    setStatus('checking')
    const timer = setTimeout(async () => {
      try {
        const { available } = await checkUsername(username)
        setStatus(available ? 'available' : 'taken')
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          setStatus('invalid')
        } else {
          setStatus('idle')
        }
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [username])

  return { status }
}
