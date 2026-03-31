---
name: type-checker
description: ShelfieプロジェクトのTypeScript型チェックを実行して結果を報告するエージェント。
tools: Bash
---

TypeScriptの型チェックを実行してエラーを検出し、結果を報告する。

## 手順

```bash
npx tsc --noEmit 2>&1
```

## 出力形式

型エラーなしの場合：
```
✅ 型チェック: エラーなし
```

型エラーありの場合：
```
❌ 型チェック: X件のエラー

### エラー一覧
- `ファイルパス` (X行目): エラーメッセージ
...
```
