# ディレクトリ構成

## src/ 配下の構成

```
src/
├── app/                        # Next.js ルーティング（App Router）
│   ├── (public)/               # 認証不要ページ
│   │   ├── page.tsx            # ホーム・フィード
│   │   ├── login/
│   │   ├── users/
│   │   └── books/
│   ├── (protected)/            # 認証必須ページ（レイアウトでガード）
│   │   ├── feed/
│   │   ├── me/
│   │   └── settings/
│   └── signup/                 # Clerk認証済みだが特殊なので独立
├── components/                 # UIコンポーネント
│   ├── ui/                     # 汎用プリミティブ（Button, Input, Avatar など）
│   ├── layout/                 # Header, Footer, Nav など
│   ├── books/                  # 本・本棚関連コンポーネント
│   ├── users/                  # ユーザー・フォロー関連コンポーネント
│   └── feed/                   # フィード関連コンポーネント
├── lib/
│   └── api/                    # fetch関数（Server Components・SWR両方から呼ぶ）
├── constants/                  # 定数（APIエンドポイント、ステータス値など）
├── hooks/                      # SWRをラップしたカスタムフック
├── store/                      # Zustandストア（アクセストークンなど）
├── types/                      # TypeScript型定義（Railsレスポンス型など）
└── middleware.ts               # Clerk認証ガード
```

## 各ディレクトリの役割

### `app/`
ルーティングのみ担当。ページファイル（`page.tsx`）とレイアウトファイル（`layout.tsx`）を置く。
- `(public)/`: 誰でもアクセス可能。認証状態による表示分岐はコンポーネント内で行う
- `(protected)/`: 未認証の場合はミドルウェアでリダイレクト

### `components/`
- `ui/`: 完全に汎用のプリミティブのみ。shadcn/ui は使わず独自実装
- ドメインフォルダ（`books/`, `users/`, `feed/`）: 機能に関連するコンポーネントを配置

### `constants/`
アプリ全体で使い回す定数を集約。特定のコンポーネント内でしか使わない定数（タブ名など）はコンポーネントそばに置く。

```
constants/
├── api.ts      # APIベースURL、エンドポイント
├── book.ts     # 読了ステータスなどbook関連
└── app.ts      # ページサイズなどアプリ全般
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

### `types/`
Railsレスポンスの型など、プロジェクト全体で使い回す型定義を集約。

## データフェッチの使い分け

| ケース | 方法 |
|---|---|
| 初期表示のデータ取得 | Server Components から `lib/api/` を直接呼ぶ |
| ユーザー操作後に再取得が必要 | `hooks/` の SWR フックを使う |
