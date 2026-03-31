# 実装ルール

## 関数の書き方

- **コンポーネント** → `function` 宣言
- **それ以外**（`lib/api/`, `hooks/`, `store/` など）→ arrow function

```ts
// ✅ コンポーネントは function 宣言
export function UserProfile({ username }: { username: string }) {
  return <div>...</div>
}

// ✅ それ以外は arrow function
export const getUser = (username: string): Promise<User> =>
  apiGet(API_ENDPOINTS.USER(username))
```

---

## 型

- `any` 型は使用禁止。型が不明な場合は `unknown` を使い、型ガードで絞り込む

```ts
// ❌ 禁止
const data: any = await fetchSomething()

// ✅ unknown + 型ガード
const data: unknown = await fetchSomething()
```

---

## 非同期処理

- `async/await` に統一する
- `.then()` チェーンは使わない

```ts
// ❌ 禁止
getUser(username).then((user) => setUser(user))

// ✅ async/await
const user = await getUser(username)
setUser(user)
```

---

## if文のネスト

- 早期リターン（ガード節）を使い、ネストは1段までに抑える
- どうしても2段になる場合はユーザーに確認を取る

```ts
// ❌ 深いネスト
const handleLogin = async () => {
  if (token) {
    if (result === 'ok') {
      router.push('/feed')
    } else {
      router.push('/signup')
    }
  }
}

// ✅ 早期リターン
const handleLogin = async () => {
  if (!token) return
  if (result !== 'ok') {
    router.push('/signup')
    return
  }
  router.push('/feed')
}
```

---

## コンポーネントのロジック分離

コンポーネントファイルにはロジックを書かない。JSXと子コンポーネントへのイベントバインドのみに留める。

### カスタムフックに切り出す基準

以下に該当する場合は必ずカスタムフックに切り出す：

- `useState` / `useEffect` を使うロジック
- APIの呼び出しを伴うハンドラ（`handleSubmit` など）
- 2箇所以上で使うロジック

### コンポーネントに書いてよいもの

- JSXの返却
- propsの受け取りと子コンポーネントへの受け渡し
- CSSクラスの適用

```tsx
// ✅ 理想のコンポーネント
export function FollowButton({ username }: { username: string }) {
  const { isFollowing, handleFollow } = useFollow(username)
  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'フォロー中' : 'フォロー'}
    </button>
  )
}
```

---

## catchブロック

- `catch (e)` は使わない。`catch` のみで記述する
- catchブロックでは必ず**ロガー＋トーストの両方**を呼ぶ
- エラーメッセージは `MESSAGES` 定数から参照する（直書き禁止）

```ts
// ✅ 正しいcatchブロック
try {
  await createBook(data)
  toast.success(MESSAGES.BOOK.CREATE_SUCCESS)
} catch {
  logger.error('本の投稿失敗', { endpoint: API_ENDPOINTS.BOOKS })
  toast.error(MESSAGES.BOOK.CREATE_ERROR)
}

// ❌ eを使わない
} catch (e) {
  toast.error(e.message)  // エラー詳細をそのまま表示しない
}
```
