# コメント規定

## 基本方針

- **Why（なぜそうしたか）は書く** — 設計上の判断・制約・意図を残す
- **How（どう動くか）は書かない** — コードを読めば分かることは書かない
- **複雑なロジックには処理の説明を書く** — 一読では理解しづらい処理には補足する
- **言語は日本語**

```ts
// ✅ Why を書く
// リフレッシュトークンはHttpOnly CookieでブラウザがRailsに自動送信するため、
// credentialsをincludeにする必要がある
const res = await axios.post(url, {}, { withCredentials: true })

// ✅ 複雑なロジックへの補足
// 401かつ未リトライの場合のみサイレントリフレッシュを試みる。
// _retry フラグでリフレッシュ後の再リクエストが無限ループしないよう制御している
if (error.response?.status === 401 && !original._retry) { ... }

// ❌ How を書かない（コードを読めば分かる）
// ユーザー情報を取得する
const user = await getUser(username)
```

---

## JSDoc

### 対象

| 対象 | JSDoc |
|---|---|
| `lib/api/*.ts` の関数 | 必須 |
| `hooks/*.ts` のカスタムフック | 必須 |
| `lib/` のサービスロジック（`logger.ts` など） | 必須 |
| `components/` のコンポーネント | 不要 |
| `types/` の型定義 | 不要 |

### 使用タグ

| タグ | 記載条件 |
|---|---|
| `@param` | 常に記載 |
| `@returns` | 常に記載 |
| `@throws` | エラーが起きうる場合のみ |

### 書き方の例

```ts
// lib/api/users.ts

/**
 * ユーザー情報を取得する。
 * @param username - ユーザー名
 * @returns ユーザー情報
 * @throws ユーザーが存在しない場合は404エラー
 */
export const getUser = (username: string): Promise<User> =>
  apiGet(API_ENDPOINTS.USER(username))
```

```ts
// hooks/useUser.ts

/**
 * ユーザー情報を取得するSWRフック。
 * @param username - ユーザー名
 * @returns SWRのレスポンス（data, error, isLoading）
 */
export function useUser(username: string) {
  return useSWR(API_ENDPOINTS.USER(username), () => getUser(username))
}
```

```ts
// lib/logger.ts

/**
 * infoレベルのログを出力する。
 * productionでは出力されない。
 * @param message - ログメッセージ
 * @param context - 追加コンテキスト（userId, endpoint, statusなど）
 */
info: (message: string, context?: LogContext) => { ... }
```
