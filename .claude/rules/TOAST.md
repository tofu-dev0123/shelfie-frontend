# トースト通知 実装ガイド

## ライブラリ

[sonner](https://sonner.emilkowal.ski/) を使用する。

```bash
npm install sonner
```

---

## セットアップ

ルートレイアウトに `<Toaster />` を1つだけ配置する。

```tsx
// src/app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
```

---

## 使用方針

- **エラー時は必ずトースト**を表示する
- **成功時はケースバイケース**（各画面の設計に従う）

---

## 使い方

メッセージ文字列は `constants/messages.ts` から参照する。直書きしない。

```ts
import { toast } from 'sonner'
import { MESSAGES } from '@/constants/messages'

// エラー
toast.error(MESSAGES.COMMON.ERROR)

// 成功
toast.success(MESSAGES.USER.FOLLOW_SUCCESS)

// 情報
toast(MESSAGES.COMMON.SAVE_SUCCESS)
```

---

## エラートーストのパターン

操作失敗時は `catch` ブロックで呼ぶ。

```ts
import { MESSAGES } from '@/constants/messages'
import { API_ENDPOINTS } from '@/constants/api'

const follow = async () => {
  try {
    await followUser(username)
    mutate(API_ENDPOINTS.USER(username))
  } catch {
    toast.error(MESSAGES.USER.FOLLOW_ERROR)
  }
}
```

APIエラーの種類によってメッセージを変える必要はない（MVPでは一律のメッセージで十分）。

---

## やってはいけないこと

```ts
// ❌ エラーの詳細をそのまま表示しない
toast.error(error.message)

// ❌ 連打されうるボタンに対してトーストを連発しない
//    → ボタンの disabled 制御と組み合わせる
```
