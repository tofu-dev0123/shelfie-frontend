# CSS Modules 実装ガイド

## globals.css の役割

`src/app/globals.css` にはデザイントークンのみを定義する。コンポーネントスタイルは書かない。

```css
/* ✅ globals.css に書くもの */
:root {
  /* カラー（DESIGN.md の定義に従う） */
  --color-primary-50: #EEF3F9;
  --color-primary-100: #D6E4F0;
  --color-primary-200: #AECCE3;
  --color-primary-600: #1E3A5F;
  --color-primary-700: #172D4A;
  --color-primary-900: #0D1B2E;

  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;

  /* タイポグラフィ */
  --font-sans: 'Inter', sans-serif;
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-2xl: 32px;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  --leading-tight: 1.4;
  --leading-normal: 1.6;
  --leading-relaxed: 1.7;

  /* スペーシング */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* 角丸 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* シャドウ */
  --shadow-none: none;
  --shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* ベーススタイル */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-gray-700);
  background-color: var(--color-gray-50);
  line-height: var(--leading-normal);
}
```

---

## CSS Modules でのトークン参照

`var()` でグローバルトークンを参照する。値をハードコードしない。

```css
/* ✅ 正しい */
.button {
  background-color: var(--color-primary-600);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

/* ❌ 避ける（値をハードコードしない） */
.button {
  background-color: #1E3A5F;
  padding: 8px 16px;
  border-radius: 6px;
}
```

---

## レスポンシブデザイン

モバイルファーストで記述する。ブレークポイントは `DESIGN.md` の定義に従う。

```css
.container {
  /* モバイル（デフォルト） */
  padding: var(--space-4);
}

@media (min-width: 768px) {
  /* タブレット以上 */
  .container {
    padding: var(--space-10);
  }
}

@media (min-width: 1024px) {
  /* PC以上 */
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## ホバー・フォーカス状態

```css
.card {
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-hover);
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}
```

---

## クラス命名

- camelCase を使用する（CSS Modules はスコープが閉じているため衝突しない）
- 状態は modifier として末尾に付ける

```css
/* ✅ 正しい */
.userCard { }
.userCard.isActive { }
.submitButton { }
.errorMessage { }

/* ❌ 避ける */
.user-card { }          /* ケバブケースは使わない */
.UserCard { }           /* PascalCaseは使わない */
```

---

## コンポーネントでの import

```tsx
import styles from './styles/UserProfile.module.css'

export function UserProfile() {
  return <div className={styles.container}>...</div>
}
```

複数クラスを組み合わせる場合はテンプレートリテラルを使う。

```tsx
<div className={`${styles.card} ${isActive ? styles.isActive : ''}`}>
```
