# 認証 実装ガイド

## フロー概要

### ログイン（既存ユーザー）

```
1. ユーザーが Clerk で GitHub/Google ログイン
2. Clerk JWT を取得
3. Rails POST /v1/auth/login に Clerk JWT を送信
4. Rails がアクセストークン（レスポンスボディ）とリフレッシュトークン（HttpOnly Cookie）を返す
5. アクセストークンを Zustand に保存
6. フィード画面へリダイレクト
```

### サインアップ（新規ユーザー）

```
1. ユーザーが Clerk で GitHub/Google ログイン
2. Clerk JWT を取得
3. Rails POST /v1/auth/login → 404（Railsにユーザーが存在しない）
4. /signup へリダイレクト
5. ユーザーがユーザー名などの追加情報を入力
6. Rails POST /v1/auth/signup に Clerk JWT + 入力データを送信
7. Rails がユーザーを作成し、アクセストークンとリフレッシュトークンを返す
8. アクセストークンを Zustand に保存
9. フィード画面へリダイレクト
```

---

## 実装

### Clerk JWT の取得

クライアントサイドでは `useAuth` フックから取得する。

```ts
'use client'
import { useAuth } from '@clerk/nextjs'

export function LoginButton() {
  const { getToken } = useAuth()

  const handleLogin = async () => {
    const clerkToken = await getToken()
    await login(clerkToken)
  }
}
```

### ログイン処理（lib/api/auth.ts）

認証エンドポイントは Clerk トークンを使うため、`serverPost` / `apiDelete` を使用する。

```ts
// lib/api/auth.ts
import axios from 'axios'
import { serverPost, apiDelete } from './client'
import { useAuthStore } from '@/store/authStore'
import { API_ENDPOINTS } from '@/constants/api'

export async function login(clerkToken: string): Promise<'ok' | 'not_found'> {
  try {
    const data = await serverPost<{ access_token: string }>(
      API_ENDPOINTS.AUTH_LOGIN,
      clerkToken
    )
    useAuthStore.getState().setAccessToken(data.access_token)
    return 'ok'
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // Railsにユーザーが存在しない → サインアップへ
      return 'not_found'
    }
    throw error
  }
}

export async function signup(clerkToken: string, data: SignupInput): Promise<void> {
  const res = await serverPost<{ access_token: string }>(
    API_ENDPOINTS.AUTH_SIGNUP,
    clerkToken,
    data
  )
  useAuthStore.getState().setAccessToken(res.access_token)
}
```

### ログイン後の画面遷移

```tsx
// app/(public)/login/page.tsx などのログイン後処理
'use client'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api/auth'
import { MESSAGES } from '@/constants/messages'

export function LoginHandler() {
  const { getToken } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const clerkToken = await getToken()
      const result = await login(clerkToken!)

      if (result === 'ok') {
        router.push('/feed')
      } else {
        router.push('/signup')
      }
    } catch {
      toast.error(MESSAGES.AUTH.LOGIN_ERROR)
    }
  }
}
```

---

## middleware.ts

Clerk の `clerkMiddleware` で `(protected)` 配下のルートを保護する。

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/feed(.*)',
  '/me(.*)',
  '/settings(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
```

ミドルウェアは Clerk のセッション（ブラウザ Cookie）を確認するだけ。Railsのアクセストークンは確認しない。

---

## ログアウト

```ts
// lib/api/auth.ts
export async function logout(): Promise<void> {
  await apiDelete(API_ENDPOINTS.AUTH_LOGOUT) // アクセストークンはインターセプターが自動付与
  useAuthStore.getState().clearAccessToken()
}
```

Clerk のサインアウト（`signOut()`）と Rails のログアウトを両方呼ぶ。

```ts
import { useClerk } from '@clerk/nextjs'
import { logout } from '@/lib/api/auth'

const { signOut } = useClerk()

const handleLogout = async () => {
  await logout()       // Rails: リフレッシュトークン削除
  await signOut()      // Clerk: セッション削除
}
```
