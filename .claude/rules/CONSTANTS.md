# 定数管理ガイド

## 配置の判断基準

| 条件 | 配置場所 |
|---|---|
| 複数のファイルから参照される | `src/constants/` |
| 特定のコンポーネント内でしか使わない | コンポーネントと同ファイル内 |

```ts
// ✅ constants/ に置く（複数箇所で使う）
export const BOOK_STATUS = { ... }

// ✅ コンポーネント内に置く（そのコンポーネントだけで使う）
const TABS = ['本棚', 'いいね'] as const
export function ProfileTabs() { ... }
```

---

## constants/ のファイル構成

```
constants/
├── api.ts        # APIベースURL・エンドポイントパス
├── messages.ts   # ユーザー向けメッセージ文字列
├── book.ts       # 本・読書ステータス関連
└── app.ts        # ページサイズなどアプリ全般
```

### api.ts

```ts
// constants/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export const API_ENDPOINTS = {
  // 認証
  AUTH_LOGOUT: '/v1/auth/logout',
  AUTH_REFRESH: '/v1/auth/refresh',
  AUTH_SIGNUP_CONTEXT: '/v1/auth/signup_context',

  // ユーザー
  USERS: '/v1/users',
  USER: (username: string) => `/v1/users/${username}`,
  USER_FOLLOW: (username: string) => `/v1/users/${username}/follow`,

  // 本
  BOOKS: '/v1/books',
  BOOK: (id: number) => `/v1/books/${id}`,
} as const
```

### messages.ts

ユーザー向けに表示するメッセージ文字列を一元管理する。トースト通知・バリデーションエラー以外の UI メッセージはここに定義する。

```ts
// constants/messages.ts
export const MESSAGES = {
  AUTH: {
    LOGIN_ERROR: 'ログインに失敗しました',
    SIGNUP_ERROR: 'サインアップに失敗しました',
    LOGOUT_ERROR: 'ログアウトに失敗しました',
  },
  USER: {
    FOLLOW_SUCCESS: 'フォローしました',
    FOLLOW_ERROR: 'フォローに失敗しました',
    UNFOLLOW_SUCCESS: 'フォローを外しました',
    UNFOLLOW_ERROR: 'フォローを外すのに失敗しました',
    UPDATE_SUCCESS: 'プロフィールを更新しました',
    UPDATE_ERROR: 'プロフィールの更新に失敗しました',
  },
  BOOK: {
    CREATE_SUCCESS: '投稿しました',
    CREATE_ERROR: '投稿に失敗しました',
    UPDATE_SUCCESS: '更新しました',
    UPDATE_ERROR: '更新に失敗しました',
    DELETE_SUCCESS: '削除しました',
    DELETE_ERROR: '削除に失敗しました',
  },
  COMMON: {
    ERROR: '操作に失敗しました',
    SAVE_SUCCESS: '保存しました',
  },
} as const
```

Zodスキーマのバリデーションメッセージはフィールド固有のため、スキーマファイルに直書きする。

### book.ts

```ts
// constants/book.ts
export const BOOK_STATUS = {
  READING: 'reading',
  DONE: 'done',
  WANT: 'want',
} as const

export type BookStatus = typeof BOOK_STATUS[keyof typeof BOOK_STATUS]

export const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  reading: '読書中',
  done: '読了',
  want: '読みたい',
}
```

### app.ts

```ts
// constants/app.ts
export const PAGE_SIZE = 20
```

---

## 書き方のルール

- `enum` は使わない。`as const` オブジェクトで代替する

```ts
// ✅ 正しい
export const BOOK_STATUS = {
  READING: 'reading',
  DONE: 'done',
} as const

// ❌ 避ける
enum BookStatus {
  READING = 'reading',
  DONE = 'done',
}
```

- 文字列リテラルはすべて定数化する（APIエンドポイント・ステータス値）
- ラベル文字列（表示用テキスト）は `_LABEL` サフィックスをつける
