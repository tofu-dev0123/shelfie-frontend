---
name: sync-swagger
description: Shelfieのバックエンドリポジトリ（../shelfie-backend）からswagger.yamlを本リポジトリへ同期するスキル。「swaggerを同期して」「swaggerを最新化して」「バックエンドのswaggerを取り込んで」「OpenAPIを更新して」「APIスキーマを更新して」などと言われたときは必ずこのスキルを使う。developを最新化してfeature/swaggerブランチに切り替え、ファイルをコピーして差分があればコミット＋developへのPR作成までを自動で行う。
---

# sync-swagger スキル

バックエンドリポジトリで更新された `swagger.yaml` を本リポジトリに取り込み、`develop` への PR を作成する。

## 前提パス

| | パス |
|---|---|
| コピー元 | `../shelfie-backend/swagger/v1/swagger.yaml` |
| コピー先 | `swagger/v1/swagger.yaml` |
| 作業ブランチ | `feature/swagger` |
| PR のベース | `develop` |

## フロー

### ステップ0: 事前チェック

以下のいずれかに該当する場合は中断してユーザーに確認する。

- 作業ツリーがクリーンでない（`git status --porcelain` が空でない）
  - 未コミットの変更を失う恐れがあるため、ユーザーにどうするか確認する
- コピー元ファイル `../shelfie-backend/swagger/v1/swagger.yaml` が存在しない
  - バックエンドリポジトリが別パスにある可能性があるのでユーザーに場所を確認する

### ステップ1: developを最新化

```bash
git fetch origin
git checkout develop
git pull origin develop
```

### ステップ2: feature/swaggerブランチへ切り替え

`feature/swagger` がローカルまたはリモートに存在するかを確認する。

```bash
git rev-parse --verify feature/swagger 2>/dev/null \
  || git rev-parse --verify origin/feature/swagger 2>/dev/null
```

- **存在する場合**: 既存ブランチに切り替えて develop をマージする

  ```bash
  git checkout feature/swagger  # ローカルになければ origin/feature/swagger から自動で作成される
  git merge develop
  ```

  コンフリクトが発生したら中断してユーザーに伝える（自動解消はしない）。

- **存在しない場合**: developから新規作成

  ```bash
  git checkout -b feature/swagger
  ```

### ステップ3: swaggerファイルをコピー

```bash
cp ../shelfie-backend/swagger/v1/swagger.yaml swagger/v1/swagger.yaml
```

### ステップ4: 差分チェック

```bash
git status --porcelain swagger/v1/swagger.yaml
```

出力が空の場合は**差分なし**として以下を実行し、スキルを終了する。

- ユーザーに「swaggerに変更はありませんでした。コミット・PRはスキップします」と伝える
- コミット・PR作成は行わない

### ステップ5: コミット

差分がある場合はステージしてコミットする。コミットメッセージは日本語。

```bash
git add swagger/v1/swagger.yaml
git commit -m "chore: swagger.yamlをバックエンドから同期"
```

### ステップ6: リモートへpush

```bash
git push -u origin feature/swagger
```

### ステップ7: PRの作成 or 更新

既存のオープンPR（ベース `develop`、ヘッド `feature/swagger`）があるか確認する。

```bash
gh pr list --base develop --head feature/swagger --state open --json number,url
```

- **既存PRあり**: 新規作成せず、既存PRのURLをユーザーに伝える（pushによりPRは自動で最新化されている）
- **既存PRなし**: 新規作成する

  ```bash
  gh pr create --base develop --head feature/swagger \
    --title "chore: swagger.yamlをバックエンドから同期" \
    --body "$(cat <<'EOF'
  ## 概要
  バックエンドリポジトリ（shelfie-backend）の `swagger/v1/swagger.yaml` を本リポジトリに取り込みました。

  ## 変更内容
  - `swagger/v1/swagger.yaml` をバックエンド最新版に更新

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  EOF
  )"
  ```

### ステップ8: 結果報告

以下を1メッセージでユーザーに報告する。

- 実行したブランチ操作（新規作成 or 既存ブランチにマージ）
- 差分の有無
- コミットハッシュ（差分があった場合）
- PRのURL（新規作成 or 既存）

## 注意事項

- コミットメッセージ・PRタイトル・PR本文はすべて日本語（プロジェクト規約）
- フック（`--no-verify`）は使わない。pre-commit / pre-push が失敗したら原因を調べてユーザーに報告する
- developへのpush・マージは行わない（PR経由のみ）
