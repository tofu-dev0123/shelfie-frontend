---
name: run-tests
description: Shelfieプロジェクトのテストを実行して結果を報告するスキル。「テストを実行して」「テスト結果を確認して」「テストを走らせて」「テストが通るか確認して」などと言われたときは必ずこのスキルを使う。Vitestでテストを実行し、結果（成功・失敗・スキップ数、失敗の詳細）をユーザーに報告する。
---

# run-tests スキル

Shelfieプロジェクトのテストを実行し、結果を報告する。

## フロー

### ステップ1: テストファイルの確認

`src/` 配下の `__tests__/` ディレクトリを検索し、テストファイルが存在するか確認する。

```bash
find src -path "*/__tests__/*.test.ts" -o -path "*/__tests__/*.test.tsx"
```

テストファイルが0件の場合は「テストファイルが見つかりませんでした。`src/` 配下に `__tests__/*.test.ts` ファイルを作成してください」と伝えて終了する。

### ステップ2: Vitestのセットアップ確認

`package.json` の `scripts` に `test:run` があるか確認する。

- ある場合: `npm run test:run` を使用
- ない場合: `npx vitest run` を使用

### ステップ3: テストの実行

```bash
npm run test:run 2>&1
```

または

```bash
npx vitest run 2>&1
```

### ステップ4: 結果の報告

実行結果を以下の形式でユーザーに報告する。

#### 全テスト成功の場合

```
✅ 全テスト成功

テストスイート: X件
テストケース: X件
実行時間: X.Xs
```

#### 失敗がある場合

```
❌ テスト失敗あり

テストスイート: X件 (失敗: X件)
テストケース: X件 (失敗: X件)

## 失敗したテスト

### <ファイルパス>
- <テスト名>
  期待値: <expected>
  実際の値: <received>
  エラー: <エラーメッセージ>
```

#### Vitestが未インストールの場合

```
Vitestがインストールされていません。以下のコマンドを実行してください：

npm install -D vitest @vitest/coverage-v8
```

そして `package.json` の `scripts` に以下の追加も案内する：

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```
