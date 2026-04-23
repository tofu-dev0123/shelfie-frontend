# 認証 実装ガイド

## 基本方針

認証状態のSource of Truthはバックエンド（Rails）発行のアクセストークンに一元化する。Clerkは **OAuthプロバイダへの委譲と Clerk JWT の発行にのみ** 使用し、認証状態の判定・参照には使わない。

- 認証状態の参照は `@/hooks/auth/useAuth` を必ず経由する
- `@clerk/nextjs` からの `useAuth` / `useClerk` / `useUser` / `SignedIn` / `SignedOut` の import は原則禁止
- Clerk 依存を許可する範囲は `CLERK_OAUTH.md` の冒頭ファイル一覧を参照

---

## フロー概要

### ログイン（既存ユーザー）

```
1. ユーザーが Clerk で GitHub/Google ログイン
2. Clerk JWT を取得
3. Rails POST /v1/auth/login に Clerk JWT を送信
4. Rails がアクセストークン（レスポンスボディ）とリフレッシュトークン（HttpOnly Cookie）を返す
5. authStore にアクセストークンを保存（status は "authenticated" に遷移）
6. フィード画面へリダイレクト
```

### サインアップ（新規ユーザー）

```
1. ユーザーが Clerk で GitHub/Google ログイン
2. Clerk JWT を取得
3. Rails POST /v1/auth/login → 404（Railsにユーザーが存在しない）
4. /signup/continue へリダイレクト
5. ユーザーがユーザー名などの追加情報を入力
6. Rails POST /v1/users に Clerk JWT + 入力データを送信
7. Rails がユーザーを作成し、アクセストークンとリフレッシュトークンを返す
8. authStore にアクセストークンを保存（status は "authenticated" に遷移）
9. フィード画面へリダイレクト
```

---

## 認証状態モデル（authStore の status）

```
type AuthStatus = "idle" | "initializing" | "authenticated" | "unauthenticated";
```

| status | 意味 |
|---|---|
| `idle` | 起動直後。リフレッシュ試行前 |
| `initializing` | リフレッシュ試行中 |
| `authenticated` | ログイン中。accessToken あり |
| `unauthenticated` | 未ログイン、または期限切れ |

### 遷移

```
 idle ──(useAuthInitializer)──▶ initializing
                                  │
                                  ├─ refresh 成功 ─▶ authenticated
                                  └─ refresh 失敗 ─▶ unauthenticated

 authenticated ──(logout)──▶ unauthenticated
 unauthenticated ──(login/signup)──▶ authenticated
```

`setAccessToken` / `clearAccessToken` は status も同時更新するため、`accessToken !== null` と `status === "authenticated"` は常に一致する。

---

## 認証状態の参照：`useAuth` フック

```ts
import { useAuth } from "@/hooks/auth/useAuth";

export function Header() {
  const { isSignedIn, isInitializing } = useAuth();

  if (isInitializing) return null; // ちらつき防止
  return isSignedIn ? <UserMenu /> : <LoginButton />;
}
```

- `isSignedIn`: Rails 認証済みかどうか（`status === "authenticated"`）
- `isInitializing`: リフレッシュ試行が未完了かどうか（`status === "idle" || "initializing"`）

### Clerk の `useAuth` との違い

Clerk の `{ isLoaded, isSignedIn }` とは意味が異なる。Clerk セッションの有無ではなく **Rails トークンの有無** を示す。Clerk セッションが残っていても Rails 側でログアウト済みなら `isSignedIn === false` となる。

---

## リロード時のトークン復元

`useAuthInitializer` が起動時に 1 回だけ `/v1/auth/refresh` を叩く。未ログインユーザーは 401 が必ず 1 回発生するが、リロード時のみで SPA 内遷移では発火しないため許容する。

```ts
export const useAuthInitializer = () => {
  const status = useAuthStore((s) => s.status);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    if (status !== "idle") return;
    setStatus("initializing");
    (async () => {
      const ok = await refreshAccessToken();
      if (!ok) setStatus("unauthenticated");
    })();
  }, [status, setStatus]);
};
```

---

## Clerk JWT の取得

Clerk JWT が必要なのは `login()` / `signup()` を呼ぶ認証エントリポイントのみ。該当ファイルでのみ `@clerk/nextjs` の `useAuth().getToken()` を使用する。

```ts
// hooks/signup/useSignupForm.ts 等、認証エントリポイント専用
import { useAuth as useClerkAuth } from "@clerk/nextjs";

const { getToken } = useClerkAuth();
const clerkToken = await getToken();
await signup(clerkToken, data);
```

自作 `useAuth` と名前が衝突するので、必要に応じて `useClerkAuth` などで別名 import する。

---

## ログアウト

ログアウトは必ず `useLogout` フックを経由する。lib 層から `useClerk` を呼ぶことは Hook Rules 違反のため禁止。

```ts
import { useLogout } from "@/hooks/auth/useLogout";

export function LogoutButton() {
  const handleLogout = useLogout();
  return <button onClick={handleLogout}>ログアウト</button>;
}
```

`useLogout` の内部では以下を順に実行する：

1. Rails logout（`/v1/auth/logout`）— リフレッシュトークン Cookie を削除し `authStore` の status を `"unauthenticated"` に
2. Clerk `signOut()` — Clerk セッション Cookie を削除
3. `/`（ホーム画面）へリダイレクト

Clerk セッションを残したままにすると、次回ログイン時に `/sso-callback` の `signIn.status === "complete"` 分岐が誤動作するため、`signOut()` は必ず呼ぶこと。

---

## middleware.ts

Clerk middleware を UX 上の粗いガードとして使用する。実際の認可は Rails API の Bearer トークン検証に委ねる。

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/me(.*)",
  "/settings(.*)",
  "/books/new(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

Next.js middleware は Rails ドメインの HttpOnly Cookie を読めないため、Rails トークンでのミドルウェア保護は不可能。Clerk セッションがあるユーザーのみを通過させ、Rails API 側で最終的な認可判定を行う設計とする。

---

## lib/api/auth.ts の実装

認証エンドポイントは Clerk トークンを使うため、`serverPost` / `apiDelete` を使用する。

```ts
// lib/api/auth.ts
export const login = async (
  clerkToken: string,
): Promise<"ok" | "not_found"> => {
  try {
    const data = await serverPost<{ access_token: string }>(
      API_ENDPOINTS.AUTH_LOGIN,
      clerkToken,
    );
    useAuthStore.getState().setAccessToken(data.access_token);
    return "ok";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return "not_found";
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await apiDelete(API_ENDPOINTS.AUTH_LOGOUT);
  useAuthStore.getState().clearAccessToken();
};
```

`setAccessToken` / `clearAccessToken` は status を同時更新するため、`lib/api/auth.ts` 側で `setStatus` を明示的に呼ぶ必要はない。
