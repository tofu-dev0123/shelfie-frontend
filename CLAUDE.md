# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

Shelfie。読了した本を投稿して本棚を作成・公開できる読書管理アプリケーション。フロントエンドのリポジトリで、別リポジトリの Rails バックエンドと REST API で通信する。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: CSS Modules
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

- `.claude/rules/CONVENTIONS.md` — コーディング規約・命名規則
- `.claude/rules/STRUCTURE.md` — ディレクトリ構成と各ディレクトリの役割
- `.claude/rules/ARCHITECTURE.md` — アーキテクチャ・設計方針
- `.claude/rules/DESIGN.md` — デザインシステム（カラー・タイポグラフィ・スペーシングなど）
- `.claude/rules/CSS_MODULES.md` — CSS Modules 実装ガイド（トークン参照・レスポンシブ・globals.css構成）
- `.claude/rules/DATA_FETCHING.md` — データフェッチ・状態管理 実装ガイド（SWR・Zustand・lib/api/）
- `.claude/rules/TOAST.md` — トースト通知 実装ガイド（sonner・エラー必須・成功は都度判断）
- `.claude/rules/API_CLIENT.md` — APIクライアント実装ガイド（fetchラッパー・サイレントリフレッシュ・エラー処理）
- `.claude/rules/TESTING.md` — テスト実装ガイド（Vitest・UTのみ・ファイル配置）
- `.claude/rules/FORMS.md` — フォーム実装ガイド（RHF+Zod・スキーマ配置・エラー表示）
- `.claude/rules/AUTH.md` — 認証実装ガイド（Clerk JWT → Rails・サインアップフロー・middleware）
- `.claude/rules/CONSTANTS.md` — 定数管理ガイド（配置基準・as const・ファイル構成）
- `.claude/rules/LOGGING.md` — ログ設計ガイド（共通ロガー・環境別出力レベル・差し込み箇所）
- `.claude/rules/COMMENTS.md` — コメント規定（Why重視・JSDoc対象と記載タグ）
- `.claude/rules/IMPLEMENTATION.md` — 実装ルール（関数の書き方・any禁止・ネスト制限・catchブロック）
