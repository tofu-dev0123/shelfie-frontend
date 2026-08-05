# API クライアント 実装ガイド

## ライブラリ

axios を使用する。

```bash
npm install axios
```

## ファイル構成

```
lib/api/
├── client.ts     # axios インスタンス・メソッドハンドラ
├── auth.ts
├── users.ts
├── books.ts
└── me.ts
```

---

## client.ts の実装

```ts
// lib/api/client.ts
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { redirect } from 'next/navigation'
import { API_ENDPOINTS } from '@/constants/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ----------------------------------------------------------------
// クライアントサイド用 axios インスタンス
// ----------------------------------------------------------------
const _client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// リクエストインターセプター: アクセストークンを自動付与
_client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// レスポンスインターセプター: 401時にサイレントリフレッシュ
_client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshed = await tryRefresh()
      if (!refreshed) {
        useAuthStore.getState().clearAccessToken()
        redirect('/login')
      }
      original.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`
      return _client(original)
    }
    return Promise.reject(error)
  }
)

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`,
      {},
      { withCredentials: true }
    )
    useAuthStore.getState().setAccessToken(res.data.access_token)
    return true
  } catch {
    return false
  }
}

// ----------------------------------------------------------------
// クライアントサイド用メソッドハンドラ
// ----------------------------------------------------------------
export const apiGet = async <T>(path: string): Promise<T> => {
  const r = await _client.get<T>(path)
  return r.data
}

export const apiPost = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _client.post<T>(path, data)
  return r.data
}

export const apiPatch = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _client.patch<T>(path, data)
  return r.data
}

export const apiDelete = async <T>(path: string): Promise<T> => {
  const r = await _client.delete<T>(path)
  return r.data
}

// ----------------------------------------------------------------
// サーバーサイド用メソッドハンドラ（Server Components から使用）
// Clerk トークンを引数で受け取る
// ----------------------------------------------------------------
const serverHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const serverGet = async <T>(path: string, token: string): Promise<T> => {
  const r = await axios.get<T>(`${BASE_URL}${path}`, { headers: serverHeaders(token), withCredentials: true })
  return r.data
}

export const serverPost = async <T>(path: string, token: string, data?: unknown): Promise<T> => {
  const r = await axios.post<T>(`${BASE_URL}${path}`, data, { headers: serverHeaders(token), withCredentials: true })
  return r.data
}

export const serverPatch = async <T>(path: string, token: string, data?: unknown): Promise<T> => {
  const r = await axios.patch<T>(`${BASE_URL}${path}`, data, { headers: serverHeaders(token), withCredentials: true })
  return r.data
}

export const serverDelete = async <T>(path: string, token: string): Promise<T> => {
  const r = await axios.delete<T>(`${BASE_URL}${path}`, { headers: serverHeaders(token), withCredentials: true })
  return r.data
}
```

---

## lib/api/*.ts の書き方

各関数は `token` を受け取ったらサーバー用、なければクライアント用ハンドラを使う。

```ts
// lib/api/users.ts
import { apiGet, apiPatch, serverGet } from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User } from '@/types/user'

export const getUser = (username: string, token?: string): Promise<User> =>
  token
    ? serverGet(API_ENDPOINTS.USER(username), token)
    : apiGet(API_ENDPOINTS.USER(username))

export const updateUser = (data: UpdateUserInput): Promise<User> =>
  apiPatch(API_ENDPOINTS.ME, data)
```

---

## エラーハンドリングの責務分担

| レイヤー | 役割 |
|---|---|
| `client.ts` | 401のサイレントリフレッシュ、それ以外はreject |
| `lib/api/*.ts` | エラー処理は行わない（rejectをそのまま伝播） |
| コンポーネント / フック | `try/catch` でキャッチしてトースト通知 |

```ts
// ✅ lib/api/follows.ts（エラー処理しない）
import { API_ENDPOINTS } from '@/constants/api'

export const followUser = (username: string): Promise<void> =>
  apiPost(API_ENDPOINTS.USER_FOLLOW(username))

// ✅ コンポーネント側でハンドリング
import { MESSAGES } from '@/constants/messages'

const follow = async () => {
  try {
    await followUser(username)
    mutate(API_ENDPOINTS.USER(username))
  } catch {
    toast.error(MESSAGES.USER.FOLLOW_ERROR)
  }
}
```

---

## Server Components からの呼び出し

```ts
// app/(public)/users/[username]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/api/users'

export default async function UserPage({ params }: { params: { username: string } }) {
  const { getToken } = auth()
  const token = await getToken()

  const user = await getUser(params.username, token ?? undefined)
  return <UserProfile user={user} />
}
```

---

## 環境変数

```
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```
