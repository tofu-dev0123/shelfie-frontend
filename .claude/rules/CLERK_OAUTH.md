# Clerk v7 Custom UI OAuthフロー 実装ガイド

## v7での最重要変更点

v7では旧APIと新APIが並存している。**必ず新APIを使うこと。**

| | 旧API（非推奨） | 新API（推奨） |
|---|---|---|
| OAuthトリガー | `signUp.authenticateWithRedirect()` | `signUp.sso()` |
| パラメータ名 | `redirectUrlComplete` | `redirectCallbackUrl` |
| コールバック処理 | `<AuthenticateWithRedirectCallback />` | 手動の `/sso-callback` ページ |
| セッション確定 | `setActive({ session: createdSessionId })` | `signUp.finalize()` / `signIn.finalize()` |
| フック戻り値 | `{ isLoaded, signUp, setActive }` | `{ signUp, errors, fetchStatus }` |

---

## 1. OAuthトリガー（`signUp.sso()`）

```tsx
'use client'
import { useSignUp } from '@clerk/nextjs'
import { OAuthStrategy } from '@clerk/shared/types'

export default function SignUpPage() {
  const { signUp, errors } = useSignUp()

  const signUpWith = async (strategy: OAuthStrategy) => {
    const { error } = await signUp.sso({
      strategy,
      redirectUrl: '/feed',                // 全要件揃っていれば直接ここへ
      redirectCallbackUrl: '/sso-callback', // 追加処理が必要な場合はここへ
    })
    if (error) console.error(error)
  }

  return (
    <button onClick={() => signUpWith('oauth_google')}>Googleでサインアップ</button>
  )
}
```

### `sso()` の主要パラメータ

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `strategy` | `OAuthStrategy` | 必須 | `'oauth_google'` / `'oauth_github'` など |
| `redirectUrl` | `string` | 必須 | 要件がすべて揃っている場合のリダイレクト先 |
| `redirectCallbackUrl` | `string` | 必須 | 追加処理が必要な場合のリダイレクト先 |
| `firstName` | `string` | 任意 | インスタンス設定で有効な場合のみ |
| `lastName` | `string` | 任意 | インスタンス設定で有効な場合のみ |
| `unsafeMetadata` | `SignUpUnsafeMetadata` | 任意 | フロントエンドで読み書きできるカスタムメタデータ |

**注意：** `signIn.sso()` と `signUp.sso()` は同じ `/sso-callback` を使い回す。

**注意：** `sso()` を呼ぶコンポーネントには `<div id="clerk-captcha" />` を配置すること。Clerkのボット対策（Smart CAPTCHA）に使用される。ない場合はInvisible CAPTCHAにフォールバックする。

---

## 2. `/sso-callback` ページ

OAuthプロバイダからのリダイレクト後に実行されるページ。`signIn` / `signUp` 両方のケースをここで処理する。

```tsx
'use client'
import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function SSOCallbackPage() {
  const clerk = useClerk()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const router = useRouter()
  const hasRun = useRef(false) // 二重実行防止

  useEffect(() => {
    ;(async () => {
      if (!clerk.loaded || hasRun.current) return
      hasRun.current = true

      // ケース1: サインインが完了している
      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: async ({ decorateUrl }) => { router.push(decorateUrl('/feed')) },
        })
        return
      }

      // ケース2: サインアップ側 → 既存アカウントあり（signInに転送）
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true })
        if (signIn.status === 'complete') {
          await signIn.finalize({
            navigate: async ({ decorateUrl }) => { router.push(decorateUrl('/feed')) },
          })
          return
        }
        router.push('/login')
        return
      }

      // ケース3: サインイン側 → 新規ユーザー（signUpに転送）
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true })
      }

      // ケース4: サインアップ完了
      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: async ({ decorateUrl }) => { router.push(decorateUrl('/feed')) },
        })
        return
      }

      // ケース5: 追加情報が必要（usernameなど）
      if (signUp.status === 'missing_requirements') {
        router.push('/signup/continue')
        return
      }

      // ケース6: 既存セッションが存在する
      const sessionId = signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId
      if (sessionId) {
        await clerk.setActive({
          session: sessionId,
          navigate: async ({ decorateUrl }) => { router.push(decorateUrl('/feed')) },
        })
        return
      }
    })()
  }, [clerk, signIn, signUp, router])

  // id="clerk-captcha" の div は必須（Clerkのボット対策に使用）
  return <div><div id="clerk-captcha" /></div>
}
```

---

## 3. ステータス管理

### `signUp.status` の取りうる値

| 値 | 意味 |
|---|---|
| `'missing_requirements'` | 必須フィールドが未入力、または未検証のフィールドがある |
| `'complete'` | サインアップ完了（`finalize()` 可能） |
| `'abandoned'` | サインアップが放棄された |

### 関連プロパティ

| プロパティ | 型 | 説明 |
|---|---|---|
| `missingFields` | `SignUpField[]` | 値がまだ提供されていない必須フィールドの配列 |
| `requiredFields` | `SignUpField[]` | 必須フィールドの全一覧 |
| `unverifiedFields` | `SignUpIdentificationField[]` | 値は提供済みだが追加検証が必要なフィールドの配列 |
| `isTransferable` | `boolean` | signIn側にトークンを転送してサインインできるか |
| `existingSession` | `{ sessionId: string } \| undefined` | 既存セッション情報 |

---

## 4. 追加情報収集（`/signup/continue`）

GoogleアカウントではusernameをOAuth経由で取得できないため、`missingFields`に`'username'`が含まれる場合はこのページに誘導する。

```tsx
'use client'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignUpContinuePage() {
  const { signUp, errors } = useSignUp()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const username = new FormData(e.currentTarget).get('username') as string

    // update() で不足フィールドを補完
    const { error } = await signUp.update({ username })
    if (error) return

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: async ({ decorateUrl }) => { router.push(decorateUrl('/feed')) },
      })
    } else if (signUp.status === 'missing_requirements') {
      // まだ不足あり（メール認証等）→ 追加ステップへ
      console.log('Still missing:', signUp.missingFields)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">ユーザー名</label>
      <input type="text" name="username" id="username" required />
      <button type="submit">続ける</button>
    </form>
  )
}
```

### `signUp.update()` の主要パラメータ

| フィールド | 型 | 説明 |
|---|---|---|
| `username` | `string` | ユーザー名（Clerkインスタンスでusernameを有効化している必要あり） |
| `firstName` | `string` | 名 |
| `lastName` | `string` | 姓 |
| `unsafeMetadata` | `SignUpUnsafeMetadata` | カスタムメタデータ（サインアップ完了時にユーザーに自動コピー） |

**注意：** `update()` で設定できるフィールドはClerkダッシュボードのインスタンス設定に依存する。

---

## 5. このプロジェクトへの適用チェックリスト

既存実装を見直す際の確認ポイント：

- [ ] `authenticateWithRedirect()` を `sso()` に変更した
- [ ] `redirectUrlComplete` を `redirectCallbackUrl` に変更した
- [ ] `<AuthenticateWithRedirectCallback />` を削除し、手動の `/sso-callback` ページを実装した
- [ ] `setActive({ session: createdSessionId })` を `finalize()` に変更した
- [ ] `isLoaded` を `fetchStatus` に変更した
- [ ] `/sso-callback` ページに `id="clerk-captcha"` の div を配置した
- [ ] `username` の `missingFields` 対応（`/signup/continue` ページ）を実装した
