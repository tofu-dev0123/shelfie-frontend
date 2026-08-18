# コーディング規約・命名規則

## ファイル・ディレクトリ命名

- コンポーネントファイル: PascalCase（例: `UserProfile.tsx`）
- それ以外（フック・型・定数・ユーティリティ）: camelCase（例: `useUser.ts`, `book.ts`）
- Next.js 固定ファイル（`page.tsx`, `layout.tsx` など）はそのまま lowercase

## コンポーネント

- named export に統一する
- `page.tsx` / `layout.tsx` は Next.js の仕様上 `export default` を使う

```tsx
// ✅ 正しい
export function UserProfile() { ... }

// ❌ 避ける
export default function UserProfile() { ... }
```

## 型定義

- `type` に統一する（`interface` は使わない）

```ts
// ✅ 正しい
type User = {
  id: number
  username: string
}

// ❌ 避ける
interface User {
  id: number
  username: string
}
```

## スタイリング

- CSS Modules に完全統一（Tailwind CSS は使用しない）
- スタイルファイルはコンポーネントと同ディレクトリの `styles/` サブディレクトリに置く
- 1コンポーネント1CSSファイル

```
components/users/
├── UserProfile.tsx
└── styles/
    └── UserProfile.module.css
```

- デザインシステム（カラー・タイポグラフィ・スペーシング）の詳細は `DESIGN.md` を参照
- CSS Modules の具体的な実装方法（トークン参照・レスポンシブ・クラス命名）は `CSS_MODULES.md` を参照

## import順序

ESLintの設定に従う。

## コメント・コミットメッセージ

コードのコメント、コミットメッセージ、PRタイトル・説明文はすべて日本語で記述する。
