# Next.js テンプレートプロジェクト

Next.js をベースにした Web アプリケーション開発用のテンプレートプロジェクトです。

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | [Next.js](https://nextjs.org/) 16.1.6 (App Router) |
| UI ライブラリ | [React](https://react.dev/) 19.2.3 |
| 言語 | [TypeScript](https://www.typescriptlang.org/) 5 |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) v4 |
| UI コンポーネント | [shadcn/ui](https://ui.shadcn.com/) (new-york スタイル) |
| アイコン | [Lucide React](https://lucide.dev/) |
| プリミティブ | [Radix UI](https://www.radix-ui.com/) |
| フォント | [Geist](https://vercel.com/font) (Sans / Mono) |
| リンター | [ESLint](https://eslint.org/) 9 |
| フォーマッター | [Prettier](https://prettier.io/) |

## ディレクトリ構成

```
src/
├── app/            # App Router のページ・レイアウト
│   ├── layout.tsx  # ルートレイアウト
│   ├── page.tsx    # トップページ
│   └── globals.css # グローバルスタイル
├── components/     # コンポーネント
│   └── ui/         # shadcn/ui コンポーネント
├── hooks/          # カスタムフック
└── lib/            # ユーティリティ関数
    └── utils.ts    # cn() などの汎用ヘルパー
```

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと確認できます。

## スクリプト一覧

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | プロダクションビルドを作成 |
| `npm run start` | ビルド済みアプリを起動 |
| `npm run lint` | ESLint によるコード検査 |
| `npm run format` | Prettier でコードをフォーマット |
| `npm run format:check` | フォーマットの差分チェック |

## shadcn/ui コンポーネントの追加

```bash
npx shadcn add <component>
```

例:

```bash
npx shadcn add button
npx shadcn add dialog
```

追加されたコンポーネントは `src/components/ui/` に配置されます。

## パスエイリアス

`tsconfig.json` で `@/*` が `./src/*` にマッピングされています。

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```
