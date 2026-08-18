# API クライアント 実装ガイド

## ライブラリ

axios を使用する。

```bash
npm install axios
```

## ファイル構成

```
lib/api/
├── client.ts      # axios インスタンス・メソッドハンドラ
├── auth.ts        # サインアップ・ログアウト・トークンリフレッシュ
├── serverAuth.ts  # Server Components 専用（Cookie を明示的に転送する）
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
// 認証系用 axios インスタンス
// signup_token / refresh_token Cookie で認証するエンドポイント専用
// ----------------------------------------------------------------
const _authClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ログのみ。401 のサイレントリフレッシュは付けない
_authClient.interceptors.request.use((config) => { ... })
_authClient.interceptors.response.use((res) => { ... }, (error) => { ... })

export const authGet = async <T>(path: string): Promise<T> => {
  const r = await _authClient.get<T>(path)
  return r.data
}

export const authPost = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _authClient.post<T>(path, data)
  return r.data
}
```

### なぜ認証系だけインスタンスを分けるのか

`_client` のレスポンスインターセプターは **401 = アクセストークンの期限切れ** という前提で書かれている。

一方 `GET /v1/auth/signup_context` と `POST /v1/users` は `signup_token` Cookie で認証し、`POST /v1/auth/refresh` は `refresh_token` Cookie で認証する。これらが返す 401 は「アクセストークンが切れた」ではない。`_client` に乗せると無意味なリフレッシュが走り、失敗して `window.location.href = '/login'` でページごと吹き飛ぶため、呼び出し元がエラーを処理できなくなる。

同じ 401 に別の意味が乗るので、経路を分ける。

| ハンドラ | 認証方法 | 401 の扱い |
|---|---|---|
| `apiGet` / `apiPost` / `apiPut` / `apiPatch` / `apiDelete` | `Authorization: Bearer <access_token>` | サイレントリフレッシュ → 失敗なら `/login` |
| `authGet` / `authPost` | Cookie（`signup_token` / `refresh_token`） | そのまま reject（呼び出し元が判断する） |

---

## lib/api/*.ts の書き方

```ts
// lib/api/users.ts
import { apiGet, apiPatch } from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User } from '@/types/user'

export const getUser = (username: string): Promise<User> =>
  apiGet(API_ENDPOINTS.USER(username))

export const updateUser = (data: UpdateUserInput): Promise<User> =>
  apiPatch(API_ENDPOINTS.ME, data)
```

認証系のみ `authGet` / `authPost` を使う。

```ts
// lib/api/auth.ts
export const getSignupContext = (): Promise<SignupContext> =>
  authGet(API_ENDPOINTS.AUTH_SIGNUP_CONTEXT)

// トークンは渡さない。signup_token Cookie がブラウザから自動送信される
export const signup = async (data: SignupFormData): Promise<void> => {
  const res = await authPost<{ access_token: string }>(API_ENDPOINTS.USERS, data)
  useAuthStore.getState().setAccessToken(res.access_token)
}
```

---

## エラーハンドリングの責務分担

| レイヤー | 役割 |
|---|---|
| `client.ts` | `_client` は401のサイレントリフレッシュ、それ以外はreject。`_authClient` は常にreject |
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

公開エンドポイントは `lib/api/` の関数をそのまま呼ぶ。取得結果は SWR の `fallbackData` として渡し、クライアント側の初回フェッチを省略する。

```ts
// app/(main)/users/[username]/page.tsx
import { getUser } from '@/lib/api/users'

export default async function UserPage({ params }: Props) {
  const { username } = await params
  const user = await getUser(username)
  return <UserShelf username={username} fallbackUser={user} />
}
```

認証が必要な情報を Server Components で取得する場合は、Cookie を明示的に転送する専用実装を置く（`lib/api/serverAuth.ts` の `resolveUsernameByRefreshToken` が該当）。Zustand ストアはサーバー側では空なので、`apiGet` に認証を期待してはいけない。

---

## 環境変数

```
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

`/auth/*`（OAuth の入口）もこの直下にある。末尾に `/v1` を含めないこと。
