# データフェッチ・状態管理 実装ガイド

## 基本方針

- 楽観的更新は使わない。APIレスポンスを受けてからUIを更新する
- ローディングUIのパターンは `LOADING_UI.md` を参照
- リロード時のトークン再取得は行わない。サイレントリフレッシュ（ARCHITECTURE.md参照）に委ねる

---

## SWR フックの実装パターン

### 基本形

```ts
// hooks/useUser.ts
import useSWR from 'swr'
import { getUser } from '@/lib/api/users'
import { API_ENDPOINTS } from '@/constants/api'

export function useUser(username: string) {
  return useSWR(API_ENDPOINTS.USER(username), () => getUser(username))
}
```

コンポーネントでの使用：

```tsx
export function UserProfile({ username }: { username: string }) {
  const { data, error, isLoading } = useUser(username)

  if (isLoading) return <div>/* ローディングUI */</div>
  if (error) return <div>/* エラー表示 */</div>

  return <div>{data.nickname}</div>
}
```

### ミューテーション（更新後の再取得）

操作が成功したあと `mutate` でキャッシュを無効化し再取得する。

```ts
// hooks/useFollow.ts
import { useSWRConfig } from 'swr'
import { followUser, unfollowUser } from '@/lib/api/follows'
import { API_ENDPOINTS } from '@/constants/api'
import { MESSAGES } from '@/constants/messages'

export function useFollow(username: string) {
  const { mutate } = useSWRConfig()

  const follow = async () => {
    try {
      await followUser(username)
      mutate(API_ENDPOINTS.USER(username))
    } catch {
      toast.error(MESSAGES.USER.FOLLOW_ERROR)
    }
  }

  const unfollow = async () => {
    try {
      await unfollowUser(username)
      mutate(API_ENDPOINTS.USER(username))
    } catch {
      toast.error(MESSAGES.USER.UNFOLLOW_ERROR)
    }
  }

  return { follow, unfollow }
}
```

### SWRキーの命名規則

SWRキーは `API_ENDPOINTS` の定数を使う。文字列を直書きしない。

```ts
// ✅ 正しい
useSWR(API_ENDPOINTS.USER(username), ...)
useSWR(API_ENDPOINTS.BOOK(bookId), ...)
useSWR(API_ENDPOINTS.ME, ...)

// ❌ 避ける（文字列リテラルの直書き）
useSWR(`/users/${username}`, ...)
useSWR(`/books/${bookId}`, ...)
```

---

## lib/api/ の実装パターン

### ファイル構成

```
lib/api/
├── client.ts     # axios インスタンス・メソッドハンドラ（API_CLIENT.md参照）
├── auth.ts
├── users.ts
├── books.ts
└── me.ts
```

### fetch関数の書き方

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

- 1関数1エンドポイント
- エンドポイントパスは必ず `API_ENDPOINTS` から参照する
- 戻り値に型を付ける

### エラー処理

`lib/api/*.ts` ではエラー処理を行わない。呼び出し元（フック・コンポーネント）でハンドリングする。

**例外**: HTTPエラーコードを業務ロジックの戻り値に変換する必要がある場合は `try/catch` を許容する。`auth.ts` の `login()` で404を `'not_found'` として返すケースが該当する。エラーを握りつぶさず、業務上の戻り値に変換するか `throw` し直すこと。

```ts
// ✅ lib/api/follows.ts（エラー処理しない）
import { apiPost } from './client'
import { API_ENDPOINTS } from '@/constants/api'

export const followUser = (username: string): Promise<void> =>
  apiPost(API_ENDPOINTS.USER_FOLLOW(username))

// ✅ 呼び出し元でtry/catch
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

## Zustand ストアの実装パターン

### authStore

アクセストークンのみ管理する。

```ts
// store/authStore.ts
import { create } from 'zustand'

type AuthStore = {
  accessToken: string | null
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
}))
```

### Zustand の用途を限定する

| 状態 | 管理方法 |
|---|---|
| アクセストークン | Zustand（`store/authStore.ts`） |
| モーダルの開閉など | `useState` |
| サーバーデータのキャッシュ | SWR |
| フォームの入力値 | React Hook Form |

### SWRとZustandの連携

Zustandからのトークン取得は `lib/api/client.ts` のインターセプター内で行う。コンポーネントやフックから直接 `useAuthStore` を呼んでAPIリクエストに使わない（API_CLIENT.md参照）。
