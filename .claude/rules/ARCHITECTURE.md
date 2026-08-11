# アーキテクチャ・設計方針

## 認証フロー

バックエンドの詳細は `shelfie-backend/docs/architecture/auth.md` を参照。

### 概要

1. ユーザーが `<a href="{API}/auth/{provider}">` を踏む（ブラウザのトップレベル遷移）
2. Rails が OAuth を完遂し、新規/既存を判定する（フロントは一切関与しない）
3. 既存ユーザーならリフレッシュトークン（HttpOnly Cookie）を発行して `/` へ、新規ユーザーならサインアップトークンを発行して `/signup` へリダイレクト
4. フロントは起動時の `refreshAccessToken()` でアクセストークンを取得する
5. 以降のAPIリクエストは `Authorization: Bearer <access_token>` ヘッダーで認証

**フロントに認証ロジックは無い。** OAuth のコールバック処理・トークン交換・プロバイダ SDK の初期化はすべて Rails 側にある。

### トークン管理

| トークン | 保存場所 | 有効期限 |
|---|---|---|
| アクセストークン | Zustandストア（メモリ） | 60分 |
| リフレッシュトークン | HttpOnly Cookie（ブラウザが自動送信） | 30日 |
| サインアップトークン | HttpOnly Cookie（ブラウザが自動送信） | 10分 |

アクセストークンはlocalStorageに保存しない（XSS対策）。

### サイレントリフレッシュ

アクセストークンが期限切れ（401）の場合、fetchラッパーが自動で処理する。

```
APIリクエスト → 401
  → /v1/auth/refresh にリクエスト（HttpOnly CookieをブラウザがRailsに自動送信）
  → 新しいアクセストークンを取得 → Zustandストアを更新
  → 元のリクエストをリトライ
  → リフレッシュも失敗（401） → ログイン画面へリダイレクト
```

リフレッシュリクエストには `credentials: 'include'` を付与してCookieを送信する。

---

## API通信

### 構成

BFFは使用しない。クライアントからRails APIを直接呼ぶ。

```
lib/api/     # fetch関数（エンドポイントごとに定義）
hooks/       # useSWRをラップしたカスタムフック
store/       # Zustandストア（アクセストークン管理）
```

### fetchラッパー

`lib/api/client.ts` にfetch共通ラッパーを実装する。

- `Authorization: Bearer <token>` ヘッダーを自動付与
- 401時のサイレントリフレッシュ
- その他エラー（403, 404, 500）はthrow

### データフェッチの使い分け

| ケース | 方法 |
|---|---|
| 初期表示のデータ取得 | Server Componentsから `lib/api/` を直接呼ぶ |
| ユーザー操作後に再取得が必要 | `hooks/` のSWRフックを使う |

---

## エラーハンドリング

| エラーケース | 対応 |
|---|---|
| ページ読み込み時の404 | `not-found.tsx` |
| ページ読み込み時の500 | `error.tsx` |
| 操作失敗（フォロー・投稿など） | トースト通知 |
| 401（リフレッシュ失敗） | ログイン画面へリダイレクト |

---

## Server Components / Client Components

デフォルトはServer Components。以下の条件に該当する場合のみ `'use client'` を付与する。

- インタラクションがある（クリック・入力イベント）
- ブラウザAPIを使う（`window`, `document`）
- Hooksを使う（`useState`, `useSWR`, `useAuthStore`）

ディレクトリや命名規則での分離はしない。`'use client'` ディレクティブで区別する。

**境界はできるだけ末端に押し下げる。**

```
page.tsx（Server Component）
  └── UserProfile（Server Component）  ← 初期データをfetchして渡す
        ├── UserInfo（Server Component）  ← 静的な表示
        └── FollowButton（Client Component）  ← 'use client'
```

---

## フォーム管理

React Hook Form + Zod を使用する。

- バリデーションルールはZodスキーマに集約する
- `z.infer<typeof schema>` でフォームの型を自動生成する
- `zodResolver` でReact Hook FormとZodを接続する

```ts
const schema = z.object({
  username: z.string().min(3, '3文字以上で入力してください').max(20),
  nickname: z.string().min(1, '必須項目です'),
})

type FormData = z.infer<typeof schema>
```

---

## 状態管理

ZustandはアクセストークンなどグローバルなUIと無関係の状態管理に使用する。
コンポーネントローカルな状態は `useState` で管理する。

| 状態 | 管理方法 |
|---|---|
| アクセストークン | Zustand（`store/authStore.ts`）|
| モーダルの開閉など | useState |
| サーバーデータのキャッシュ | SWR |
