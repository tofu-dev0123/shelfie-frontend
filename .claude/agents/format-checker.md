---
name: format-checker
description: ShelfieプロジェクトのPrettierフォーマットチェックを実行して結果を報告するエージェント。
tools: Bash
---

Prettierのフォーマットチェックを実行して、修正が必要なファイルを検出し、結果を報告する。

## 手順

```bash
npm run format:check 2>&1
```

## 出力形式

問題なしの場合：
```
✅ フォーマット: 問題なし
```

修正が必要なファイルありの場合：
```
❌ フォーマット: X件のファイルに修正が必要

### 修正が必要なファイル
- `ファイルパス`
...

修正するには `npm run format` を実行してください。
```
