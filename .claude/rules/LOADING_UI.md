# ローディングUI 実装ガイド

## 基本方針

- **コンテンツのレイアウトが見えるべき場面 → スケルトン**
- **追加読み込み（無限スクロールの2ページ目以降） → `Spinner`**
- **コンテンツ自体が確定していない／フロー待ち → `Loading`（ロゴアニメ）**

`fa-spinner fa-spin` の直書きと「読み込み中...」のテキスト直書きは禁止。必ず以下のプリミティブを使う。

---

## 使用するコンポーネント

### `Skeleton` プリミティブ（`@/components/ui/Skeleton`）

スケルトンUIの構成要素。 `width / height / radius / className / style` を受け取り、shimmer アニメーションする矩形を描画する。

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

<Skeleton width={120} height={20} radius="md" />
<Skeleton width="80%" height={14} />
<Skeleton width={40} height={40} radius="full" />
```

- `radius`: `"sm" | "md" | "lg" | "xl" | "full"`（デフォルト `md`）
- 複雑な形は `className` で `Skeleton.module.css` 側のクラスを上書きする
- `aria-hidden="true"` が自動付与される

### `Spinner` プリミティブ（`@/components/ui/Spinner`）

無限スクロールの追加読み込み中などに表示する小さなスピナー。

```tsx
import { Spinner } from "@/components/ui/Spinner";

<Spinner />          // size="md" がデフォルト
<Spinner size="sm" /> // インライン用（必要なら）
```

- 内部実装は `fa-solid fa-spinner fa-spin` を `aria-label="読み込み中"` ＋ `role="status"` でラップ
- 色は `--color-gray-400`

### `Loading` コンポーネント（`@/components/ui/Loading`）

アプリ全体を覆うフルスクリーン待機画面。ロゴアニメ付き。

**使用箇所は以下の3つに限定する：**

- `src/app/loading.tsx`（ルートのフォールバック）
- `src/app/signup/continue/page.tsx`（サインアップフロー中の待機）
- `src/components/auth/SSOCallback.tsx`（OAuth コールバック処理中）

各画面の途中状態（SWR の `isLoading` など）には使わない。

---

## 使い分けマトリクス

| 場面 | 採用UI |
|---|---|
| Server Components のフェッチ待ち（ルート遷移） | `loading.tsx` + 画面別スケルトン |
| Client Components の初回フェッチ | 画面別スケルトン |
| 無限スクロールの追加読み込み | `Spinner` |
| 認証ブート（`isInitializing`）と初回フェッチが混在 | 画面別スケルトン（`isInitializing || isInitialLoading` でまとめる） |
| OAuth コールバック・サインアップフロー待機 | `Loading` |

---

## 画面別スケルトンの作り方

`Skeleton` プリミティブを組み合わせて、その画面の骨格を再現する。
1ファイル1コンポーネントで、対応する画面コンポーネントと同じディレクトリに配置する。

```
components/
├── users/
│   ├── BookShelf.tsx
│   ├── BookShelfSkeleton.tsx
│   ├── UserShelf.tsx
│   └── UserShelfSkeleton.tsx
├── search/
│   ├── BookSearchResults.tsx
│   └── BookSearchSkeleton.tsx
├── books/
│   ├── BookDetail.tsx
│   ├── BookDetailSkeleton.tsx
│   ├── BookPostContent.tsx
│   ├── BookEditContent.tsx
│   └── BookFormSkeleton.tsx
└── profile/
    ├── ProfileEditor.tsx
    └── ProfileSkeleton.tsx
```

### 命名規則

`<対象コンポーネント名>Skeleton.tsx`

### 実装パターン

```tsx
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/BookShelfSkeleton.module.css";

type Props = {
  count?: number;  // 表示する件数を呼び出し側から調整できるようにする
};

export function BookShelfSkeleton({ count = 12 }: Props) {
  return (
    <div className={styles.grid} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton className={styles.cover} radius="md" />
          {/* ... */}
        </div>
      ))}
    </div>
  );
}
```

- ルートに `aria-busy="true"` ＋ `aria-live="polite"` を付与する
- 件数は `Props.count` で調整可能にする（デフォルト値を持たせる）

---

## `loading.tsx` の配置ルール

### 配置する画面

Server Components で初期データを fetch する画面のみ `loading.tsx` を置く。

| 画面 | 配置 |
|---|---|
| `/` ルート | `src/app/loading.tsx`（既存・`Loading` コンポーネント） |
| `/users/[username]` | `src/app/(main)/users/[username]/loading.tsx`（`UserShelfSkeleton`） |
| `/users/[username]/books/[isbn]` | `src/app/(main)/users/[username]/books/[isbn]/loading.tsx`（`BookDetailSkeleton`） |

### 配置しない画面

Client Components 主体の画面では `loading.tsx` を置かず、コンポーネント側のスケルトン分岐に任せる。

- `/search`, `/profile`, `/books/new`, `/books/[isbn]/edit` など

理由: `loading.tsx` 表示直後にコンポーネントマウントされて再びスケルトンが描画されるため二重ローディングになる。

---

## Client Components 内の分岐パターン

### 単純な初回フェッチ

```tsx
const { data, isLoading } = useSomething();

if (isLoading || !data) return <FooSkeleton />;
return <FooView data={data} />;
```

### 認証ブート＋初回フェッチが混在する画面

```tsx
const { isSignedIn, isInitializing } = useAuth();
const { items, isLoading, ... } = useSomething(isSignedIn);

const isInitialLoading = isLoading && items.length === 0;

if (isInitializing || isInitialLoading) return <FooSkeleton />;
```

### 無限スクロール（初回・追加読み込みの両対応）

```tsx
const isInitialLoading = isLoading && items.length === 0;
const isLoadingMore = isLoading && items.length > 0;

if (isInitialLoading) return <BookShelfSkeleton />;

return (
  <>
    <ul>{...}</ul>
    <div ref={sentinelRef} />
    {isLoadingMore && (
      <div className={styles.loading}>
        <Spinner />
      </div>
    )}
  </>
);
```

---

## やってはいけないこと

```tsx
// ❌ fa-spinner の直書き
<i className="fa-solid fa-spinner fa-spin" />

// ❌ 「読み込み中...」テキストの直書き
<p>読み込み中...</p>

// ❌ ローディング中に return null（無表示でちらつき・レイアウトジャンプを起こす）
if (isLoading) return null;

// ❌ Loading コンポーネントを画面の途中状態で使う
if (isLoading) return <Loading />;
```

正しいのはいずれも対応するスケルトンに置き換える。
