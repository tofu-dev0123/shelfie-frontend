# テスト 実装ガイド

## 方針

- ユニットテストのみ実施する（コンポーネントテスト・E2Eテストは対象外）
- フレームワーク: [Vitest](https://vitest.dev/)

## テスト対象

| 対象 | 理由 |
|---|---|
| `lib/api/*.ts` の fetch関数 | APIパス・メソッド・引数の変換が正しいか確認 |
| `hooks/*.ts` の カスタムフック | SWRのキー・fetcher の設定が正しいか確認 |
| Zod スキーマ | バリデーションルールが意図通りか確認 |
| ユーティリティ関数 | 純粋関数の入出力を確認 |

コンポーネントのテストは書かない。

## ファイル配置

ソースファイルと同じディレクトリに `__tests__/` を切る。

```
lib/api/
├── users.ts
└── __tests__/
    └── users.test.ts

hooks/
├── useUser.ts
└── __tests__/
    └── useUser.test.ts
```

## ファイル命名

`<対象ファイル名>.test.ts` に統一する（`.spec.ts` は使わない）。

## セットアップ

```bash
npm install -D vitest @vitest/coverage-v8
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

## テストの書き方

### lib/api/ のテスト例

`fetch` をモックして、正しいエンドポイント・メソッドで呼ばれているか確認する。

```ts
// lib/api/__tests__/users.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUser } from '../users'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('getUser', () => {
  it('正しいエンドポイントにGETリクエストを送る', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ id: 1, username: 'testuser' })),
    })

    await getUser('testuser')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/users/testuser'),
      expect.objectContaining({ method: undefined }) // GETはmethodを省略
    )
  })
})
```

### Zod スキーマのテスト例

```ts
// components/books/__tests__/bookSchema.test.ts
import { describe, it, expect } from 'vitest'
import { bookSchema } from '../bookSchema'

describe('bookSchema', () => {
  it('正常なデータを通過させる', () => {
    const result = bookSchema.safeParse({ title: '吾輩は猫である', status: 'done' })
    expect(result.success).toBe(true)
  })

  it('タイトルが空の場合はエラー', () => {
    const result = bookSchema.safeParse({ title: '', status: 'done' })
    expect(result.success).toBe(false)
  })
})
```
