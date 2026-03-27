# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

Shelfie。読了した本を投稿して本棚を作成・公開できる読書管理アプリケーション。フロントエンドのリポジトリで、別リポジトリの Rails バックエンドと REST API で通信する。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **認証**: Clerk（GitHub / Google ログイン、JWT + リフレッシュトークン）
- **バックエンド**: Rails（別リポジトリ）、REST API 通信
- **データベース**: PostgreSQL（バックエンド側）

## 作業上の注意

- UIコンポーネントは shadcn/ui を使用しない。すべて独自に新規作成する
- `src/components/ui/` 配下の既存 shadcn コンポーネントがあっても、新規追加は行わない

## 規約

- コードのコメント、コミットメッセージ、PR タイトル・説明文はすべて日本語で記述する

## 詳細ドキュメント

詳細は以下を参照（必要に応じて記入してください）：

- `.claude/CONVENTIONS.md` — コーディング規約・命名規則
- `.claude/STRUCTURE.md` — ディレクトリ構成と各ディレクトリの役割
- `.claude/ARCHITECTURE.md` — アーキテクチャ・設計方針
