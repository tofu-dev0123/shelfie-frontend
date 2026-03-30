# フォーム 実装ガイド

## 使用ライブラリ

- **React Hook Form** — フォーム状態管理
- **Zod** — バリデーションスキーマ定義

## ファイル配置

### Zodスキーマ

`src/schemas/` にドメインごとに集約する。

```
schemas/
├── book.ts
├── user.ts
└── auth.ts
```

### フォームコンポーネント

対応するドメインの `components/` 配下に置く。

```
components/books/
├── BookForm.tsx
└── styles/
    └── BookForm.module.css
```

---

## スキーマの書き方

```ts
// schemas/book.ts
import { z } from 'zod'

export const bookSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200),
  author: z.string().min(1, '著者名は必須です'),
  status: z.enum(['reading', 'done'], { message: 'ステータスを選択してください' }),
  comment: z.string().max(1000).optional(),
})

export type BookFormData = z.infer<typeof bookSchema>
```

- `z.infer<typeof schema>` でフォームの型を自動生成する
- エラーメッセージは日本語で記述する

---

## フォームコンポーネントの書き方

```tsx
// components/books/BookForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookSchema, type BookFormData } from '@/schemas/book'
import { toast } from 'sonner'
import { MESSAGES } from '@/constants/messages'
import styles from './styles/BookForm.module.css'

export function BookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  })

  const onSubmit = async (data: BookFormData) => {
    try {
      await createBook(data)
      toast.success(MESSAGES.BOOK.CREATE_SUCCESS)
    } catch {
      toast.error(MESSAGES.BOOK.CREATE_ERROR)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title">タイトル</label>
        <input id="title" {...register('title')} />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  )
}
```

---

## エラーメッセージの表示

- `errors.<field>.message` をフィールドの直下に表示する
- CSSクラスは `styles.error` で統一する

```css
/* styles/BookForm.module.css */
.error {
  color: var(--color-error);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}
```

---

## 送信中の制御

- `isSubmitting` が `true` の間はボタンを `disabled` にする
- 連打防止のためこの制御は必ず行う

```tsx
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? '送信中...' : '送信する'}
</button>
```
