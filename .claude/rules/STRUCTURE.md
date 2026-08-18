# ディレクトリ構成

## src/ 配下の構成

```
src/
├── app/                        # Next.js ルーティング（App Router）
│   ├── (public)/               # 認証不要・任意ページ
│   │   ├── page.tsx            # ホーム
│   │   ├── login/
│   │   ├── users/
│   │   └── books/
│   ├── (protected)/            # 認証必須ページ（レイアウトでガード）
│   │   ├── me/
│   │   └── settings/
│   └── signup/                 # Railsがsignup_token付きで送り込む先（プロフィール入力）
├── components/                 # UIコンポーネント
│   ├── ui/                     # 汎用プリミティブ（Button, Input, Avatar など）
│   ├── layout/                 # Header, Footer, Nav など
│   ├── books/                  # 本・本棚関連コンポーネント
│   └── users/                  # ユーザー・本棚関連コンポーネント
├── lib/
│   └── api/                    # fetch関数（Server Components・SWR両方から呼ぶ）
├── constants/                  # 定数（APIエンドポイント、ステータス値など）
├── hooks/                      # SWRをラップしたカスタムフック
├── schemas/                    # Zodスキーマ（フォームバリデーション）
├── store/                      # Zustandストア（アクセストークンなど）
├── types/                      # TypeScript型定義（Railsレスポンス型など）
└── middleware.ts               # Cookie存在チェックによるUXガード（認可はRails側）
```

## 各ディレクトリの役割

### `app/`
ルーティングのみ担当。ページファイル（`page.tsx`）とレイアウトファイル（`layout.tsx`）を置く。
- `(public)/`: 誰でもアクセス可能。認証状態による表示分岐はコンポーネント内で行う
- `(protected)/`: 未認証の場合はミドルウェアでリダイレクト

### `components/`
- `ui/`: 完全に汎用のプリミティブのみ。shadcn/ui は使わず独自実装
- ドメインフォルダ（`books/`, `users/`, `search/` など）: 機能に関連するコンポーネントを配置

### `constants/`
アプリ全体で使い回す定数を集約。特定のコンポーネント内でしか使わない定数（タブ名など）はコンポーネントそばに置く。

```
constants/
├── api.ts        # APIベースURL、エンドポイント
├── messages.ts   # ユーザー向けメッセージ文字列
├── book.ts       # 読了ステータスなどbook関連
└── app.ts        # ページサイズなどアプリ全般
```

### `lib/api/`
Railsバックエンドへのfetch関数を集約。Server ComponentsからもSWRのfetcherからも同じ関数を呼ぶ。

```ts
// lib/api/users.ts の例
export const getUser = (username: string) =>
  fetch(`${BASE_URL}/users/${username}`).then(res => res.json())
```

### `hooks/`
`useSWR` をラップしたカスタムフックを集約。Client Componentsからデータを取得・更新する際に使用。

```ts
// hooks/useUser.ts の例
export const useUser = (username: string) =>
  useSWR(`/users/${username}`, () => getUser(username))
```

### `schemas/`
React Hook Form + Zod のバリデーションスキーマを集約。ドメインごとにファイルを分割する。

```
schemas/
├── book.ts     # 本の投稿・編集フォーム
├── user.ts     # プロフィール編集フォーム
└── auth.ts     # サインアップフォームなど
```

### `types/`
Railsレスポンスの型など、プロジェクト全体で使い回す型定義を集約。

## データフェッチの使い分け

| ケース | 方法 |
|---|---|
| 初期表示のデータ取得 | Server Components から `lib/api/` を直接呼ぶ |
| ユーザー操作後に再取得が必要 | `hooks/` の SWR フックを使う |
