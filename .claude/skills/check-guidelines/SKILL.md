---
name: check-guidelines
description: Shelfieプロジェクトの実装がガイドラインに沿っているかを調査して報告するスキル。「ガイドラインに沿っているか確認して」「実装規約に違反している箇所を調べて」「コードがルールに従っているか調査して」「ガイドライン違反がないか見て」などと言われたときは必ずこのスキルを使う。rules/配下のドキュメントを参照し、src/配下のコードを検査して違反箇所を報告する。
---

# check-guidelines スキル

Shelfieプロジェクトのソースコードが実装ガイドラインに沿っているかを調査し、違反箇所を報告する。

## 調査対象のルール

調査対象は以下のルールファイルに定義されている規約。

- `.claude/rules/CONVENTIONS.md` — 命名規則・コンポーネント規約
- `.claude/rules/STRUCTURE.md` — ディレクトリ配置
- `.claude/rules/CSS_MODULES.md` — スタイリング規約
- `.claude/rules/DATA_FETCHING.md` — データフェッチ・SWR・Zustand
- `.claude/rules/API_CLIENT.md` — APIクライアント実装
- `.claude/rules/AUTH.md` — 認証実装
- `.claude/rules/TOAST.md` — トースト通知
- `.claude/rules/FORMS.md` — フォーム実装
- `.claude/rules/CONSTANTS.md` — 定数管理

## フロー

### ステップ1: 調査スコープの確認

ユーザーから調査対象のスコープを確認する。

- **指定なし**: `src/` 配下全体を調査
- **特定ディレクトリ指定**: そのディレクトリのみ調査
- **特定ルール指定**: そのルールのみチェック

### ステップ2: ソースファイルの収集

`src/` 配下の `.tsx` / `.ts` / `.module.css` ファイルを収集する（`__tests__/` は除外）。

### ステップ3: 各ルールのチェック

以下の項目を順番にチェックする。

---

#### 3-1. 命名規則チェック（CONVENTIONS.md）

**コンポーネントファイル名**
- `src/components/` 配下のファイルが PascalCase になっているか
- `page.tsx` / `layout.tsx` 以外の `app/` 配下ファイルに `export default` が使われていないか

**型定義**
- `interface` が使われていないか（`type` に統一）

**export形式**
- `components/` 配下で `export default function` が使われていないか（named export に統一）
- ただし `app/` 配下の `page.tsx` / `layout.tsx` は除外

---

#### 3-2. スタイリングチェック（CSS_MODULES.md / CONVENTIONS.md）

**Tailwindクラスの使用禁止**
- `className` にTailwindクラス（`flex`, `p-4`, `text-sm`, `bg-` etc.）が直書きされていないか

**ハードコードされた値の禁止**
- CSS Modulesファイル内でカラーコード（`#`始まり）が直書きされていないか
- `px` / `rem` の数値がデザイントークンを使わずにハードコードされていないか
- ただし `globals.css` でのトークン定義は除外

**CSSクラス命名**
- CSS Modulesファイルのクラス名がケバブケース（`user-card`）やPascalCase（`UserCard`）になっていないか（camelCase に統一）

---

#### 3-3. 定数チェック（CONSTANTS.md）

**エンドポイント文字列の直書き禁止**
- `fetch(` や `axios.` の呼び出しで `/v1/` から始まる文字列リテラルが直書きされていないか
- `useSWR(` のキーに文字列リテラルが使われていないか（`API_ENDPOINTS` を使うべき）

**メッセージ文字列の直書き禁止**
- `toast.error(` / `toast.success(` / `toast(` の引数に文字列リテラルが直書きされていないか（`MESSAGES` を使うべき）

**enumの使用禁止**
- `enum ` キーワードが使われていないか（`as const` オブジェクトを使うべき）

---

#### 3-4. データフェッチチェック（DATA_FETCHING.md）

**SWRキー**
- `useSWR(` の第1引数に文字列リテラルが使われていないか

**lib/api/ の責務**
- `lib/api/` 配下のファイルに `try/catch` が書かれていないか（エラー処理は呼び出し元で行う）

**楽観的更新の禁止**
- SWRの `optimisticData` オプションが使われていないか

---

#### 3-5. コンポーネント配置チェック（STRUCTURE.md）

**app/ にはページファイルのみ**
- `app/` 配下に `page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` / `not-found.tsx` 以外の `.tsx` ファイルがないか

**shadcn/ui の使用禁止**
- `@/components/ui/` からのインポートに shadcn コンポーネントが含まれていないか
- `import { Button } from '@radix-ui'` など Radix UI を直接インポートしていないか（独自実装を使うべき）

---

#### 3-6. フォームチェック（FORMS.md）

**isSubmitting の disabled 制御**
- `handleSubmit` を使うフォームで、`submit` ボタンに `disabled={isSubmitting}` が付いているか

**Zodスキーマの配置**
- スキーマが `src/schemas/` に配置されているか（コンポーネントファイル内に直書きされていないか）

---

### ステップ4: 結果の報告

チェック結果を以下の形式で報告する。

#### 違反なしの場合

```
✅ ガイドライン違反は検出されませんでした

調査ファイル数: X件
チェック項目: X項目
```

#### 違反ありの場合

```
⚠️ ガイドライン違反が検出されました

## サマリー
- 違反ファイル数: X件
- 違反件数: X件

## 違反一覧

### [CONVENTIONS] export default の使用
**ファイル**: `src/components/users/UserProfile.tsx`
**行**: 5行目
**内容**: `export default function UserProfile()` → `export function UserProfile()` に変更してください

### [CONSTANTS] エンドポイント文字列の直書き
**ファイル**: `src/hooks/useUser.ts`
**行**: 8行目
**内容**: `useSWR('/v1/users/${username}', ...)` → `useSWR(API_ENDPOINTS.USER(username), ...)` に変更してください

...（以降、違反ごとに記載）
```

違反が多い場合はカテゴリごとにまとめて表示し、優先度の高いもの（セキュリティ・機能に影響するもの）を先に報告する。
