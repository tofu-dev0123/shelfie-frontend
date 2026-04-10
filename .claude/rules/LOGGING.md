# ログ設計ガイド

## ロガーの実装

`lib/logger.ts` に共通ロガーを実装する。

```ts
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = {
  userId?: number
  endpoint?: string
  status?: number
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const MIN_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL]
}

function format(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`
  if (!context || Object.keys(context).length === 0) return base
  return `${base} ${JSON.stringify(context)}`
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (shouldLog('debug')) console.debug(format('debug', message, context))
  },
  info: (message: string, context?: LogContext) => {
    if (shouldLog('info')) console.info(format('info', message, context))
  },
  warn: (message: string, context?: LogContext) => {
    if (shouldLog('warn')) console.warn(format('warn', message, context))
  },
  error: (message: string, context?: LogContext) => {
    if (shouldLog('error')) console.error(format('error', message, context))
  },
}
```

---

## 環境ごとの出力レベル

| 環境 | 出力レベル |
|---|---|
| local / development | `debug` 以上すべて出力 |
| production | `warn` 以上のみ出力（`debug` / `info` は出力しない） |

`NODE_ENV` で判定する。

---

## ログフォーマット

```
[2026-03-31T10:00:00.000Z] [INFO] メッセージ
[2026-03-31T10:00:00.000Z] [ERROR] APIリクエスト失敗 {"endpoint":"/v1/users/123","status":500}
```

---

## コンテキスト情報のルール

### 渡してOK
- `userId`: 内部ID（数値）
- `endpoint`: エンドポイントパス（例: `/v1/users/123`）
- `status`: HTTPステータスコード

### 渡してはいけない
- ユーザー名・メールアドレスなどの識別情報
- アクセストークン・リフレッシュトークン・パスワード

---

## ログを差し込む箇所

`logger` はアプリ全体のどこでも使用してよい（`lib/api/`, `hooks/`, `store/` など）。
コンポーネントではトースト通知を優先し、ログは補助的に使う。

### `lib/api/client.ts`（例）

```ts
import { logger } from '@/lib/logger'

// リクエスト送信時
logger.info('APIリクエスト送信', { endpoint: config.url })

// レスポンス受信時
logger.info('APIレスポンス受信', { endpoint: response.config.url, status: response.status })

// 401 → サイレントリフレッシュ試行
logger.warn('アクセストークン期限切れ。リフレッシュを試みます', { endpoint: original.url })

// リフレッシュ失敗 → ログイン画面リダイレクト
logger.error('トークンリフレッシュ失敗。ログイン画面へリダイレクト')

// その他エラー
logger.error('APIリクエスト失敗', { endpoint: error.config?.url, status: error.response?.status })
```

### `hooks/`（例）

エラー時は `logger.error` を呼びつつトースト通知も行う。

```ts
const handleLogout = async () => {
  try {
    await logout()
    await signOut()
  } catch {
    logger.error('ログアウト失敗')
    toast.error(MESSAGES.AUTH.LOGOUT_ERROR)
  }
}
```

---

## やってはいけないこと

```ts
// ❌ console を直接使わない
console.log('ログイン成功')
console.error(error)

// ❌ 個人情報をコンテキストに含めない
logger.info('ログイン成功', { username: 'foo', email: 'foo@example.com' })

// ❌ トークンをログに出力しない
logger.debug('トークン取得', { token: accessToken })
```
