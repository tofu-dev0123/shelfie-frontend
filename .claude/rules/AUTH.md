# 認証 実装ガイド

## 基本方針

**認証フローの当事者は Rails である。** OAuth のプロバイダ連携・state 検証・トークン交換・新規/既存の判定はすべて Rails 側にあり、フロントは次の3つしかしない。

1. `<a href="{API}/auth/{provider}">` を置く
2. Cookie で認証される API を叩く（`authGet` / `authPost`）
3. アクセストークンをメモリ（Zustand）に保持する

認証状態の Source of Truth は Rails 発行のアクセストークン。参照は必ず `@/hooks/auth/useAuth` を経由する。

**OAuth SDK やクライアントライブラリを新規に導入しないこと。** フロントは `client_secret` も署名鍵も持たない。

---

## フロー概要

### ログイン（既存ユーザー）

```
1. /login で <a href="{API}/auth/google"> を踏む
2. ブラウザが Rails → Google → Rails と遷移する（フロントは一切関与しない）
3. Rails が user_identities を引いて既存ユーザーと判定
4. refresh_token Cookie をセットして / へリダイレクト
5. 起動時の useAuthInitializer が refreshAccessToken() を呼ぶ
6. アクセストークンを authStore に保存（status は "authenticated" に遷移）
```

### サインアップ（新規ユーザー）

```
1. /login で <a href="{API}/auth/github"> を踏む（ログインと同一の導線）
2. Rails が新規ユーザーと判定 → signup_token Cookie をセットして /signup へリダイレクト
3. GET /v1/auth/signup_context（Cookie）→ { email, nickname_suggestion }
     ├─ 200 → nickname 欄にプリフィルしてフォーム表示
     └─ 401 → セッション切れ。入力させる前に /login へ戻す
4. username 入力のたびに GET /v1/users/username/check（デバウンス）
5. POST /v1/users { nickname, username }（Cookie のみ。トークンは渡さない）
6. 201 { access_token } → authStore に保存 → / へ
```

**ログインとサインアップで画面を分けない。** 新規/既存を判定するのは Rails のコールバックなので、フロントの導線は `/login` に一本化する。`/signup` は Rails が `signup_token` 付きで送り込む先であり、プロフィール入力専用のページ。

### OAuth 失敗時

Rails は `/login?error=<code>` へリダイレクトする。コードと文言の対応は `constants/messages.ts` の `OAUTH_ERROR_MESSAGES` にあり、キーはバックエンドの `Oauth::CallbackService` の定数と一致させる。

| `error` | 意味 |
|---|---|
| `cancelled` | 同意画面でキャンセルされた |
| `invalid_state` | state 検証に失敗（CSRF 疑い・セッション切れ） |
| `provider_error` | プロバイダ起因、または想定外の例外 |
| `email_unavailable` | GitHub のメールアドレスが未認証 |
| `email_already_registered` | 同一メールが別プロバイダで登録済み |

`?error=` は誰でも書き換えられるため、**辞書に無いコードは表示しない**。任意の文言を Shelfie の画面として出せてしまうため。

---

## トークン

| トークン | 保存場所 | 有効期限 | 用途 |
|---|---|---|---|
| アクセストークン | Zustandストア（メモリ） | 60分 | `Authorization: Bearer` |
| リフレッシュトークン | HttpOnly Cookie | 30日 | `POST /v1/auth/refresh` |
| サインアップトークン | HttpOnly Cookie | 10分 | `GET /v1/auth/signup_context` / `POST /v1/users` |

Cookie はいずれも HttpOnly なので **JS からは読めない**。ブラウザが自動送信するだけで、フロントがトークンを保持して再送する処理は存在しない。

アクセストークンは localStorage に保存しない（XSS対策）。

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
 unauthenticated ──(signup)──▶ authenticated
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

---

## リロード時のトークン復元

`useAuthInitializer` が起動時に 1 回だけ `/v1/auth/refresh` を叩く。未ログインユーザーは 401 が必ず 1 回発生するが、リロード時のみで SPA 内遷移では発火しないため許容する。

---

## ログアウト

`useLogout` フックを経由する。

```ts
import { useLogout } from "@/hooks/auth/useLogout";

export function LogoutButton() {
  const handleLogout = useLogout();
  return <button onClick={handleLogout}>ログアウト</button>;
}
```

内部では Rails の `DELETE /v1/auth/logout` を叩いてリフレッシュトークン Cookie を削除し、`authStore` を `"unauthenticated"` にしてホームへ遷移する。

---

## middleware.ts

`refresh_token` Cookie の**存在**だけを見る UX 上のガード。実際の認可は Rails API の Bearer トークン検証に委ねる。

```ts
const hasRefreshToken = req.cookies.has("refresh_token");
```

- 保護ページに Cookie 無しで来たら `/login` へ
- `/signup` に Cookie ありで来たら `/` へ（サインアップ済みユーザーのリロード対策）

**Cookie の存在は有効性を意味しない。** 失効済みトークンでも Cookie は残りうるので、無効だった場合は API の 401 に委ねる。

### COOKIE_DOMAIN への依存

Rails の Cookie が Next.js 側から読めるのは、バックエンドの `COOKIE_DOMAIN` が親ドメイン（`.shelfie.jp` など）に設定されているからである。**空だと Cookie が API ドメイン限定になり、API 通信は動くまま Next.js 側の判定だけが静かに死ぬ**（middleware のガードと `(main)/page.tsx` の SSR リダイレクトが機能しなくなる）。

ローカルでは Cookie がポートを区別しないため、`localhost:8080` が発行した Cookie が `localhost:3000` にも送られる。

---

## `_authClient` を使う理由

認証系のエンドポイントは Cookie で認証し、アクセストークンを持たない。`_client` のインターセプターは 401 を「アクセストークンの期限切れ」と解釈してサイレントリフレッシュ後に `/login` へ飛ばすため、これらを乗せてはいけない。詳細は `API_CLIENT.md` を参照。
