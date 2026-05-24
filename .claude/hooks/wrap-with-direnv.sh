#!/usr/bin/env bash
# Claude Code の Bash ツール実行時、cwd に .envrc があれば
# コマンドを `direnv exec <cwd> bash -c "<cmd>"` でラップして
# flake.nix の devShell 環境（nodejs_22 等）を有効化する。
#
# 背景:
#   Claude Code が起動する Bash は非対話シェルで ~/.zshrc の
#   `eval "$(direnv hook zsh)"` が読まれないため、自動では
#   direnv が発火せず flake で定義したランタイムが PATH に乗らない。

set -euo pipefail

input=$(cat)

tool_name=$(printf '%s' "$input" | jq -r '.tool_name // empty')
[ "$tool_name" = "Bash" ] || exit 0

cwd=$(printf '%s' "$input" | jq -r '.cwd // empty')
command=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')

[ -n "$cwd" ] && [ -n "$command" ] || exit 0

# direnv が無いか、cwd に .envrc が無ければスルー
command -v direnv >/dev/null 2>&1 || exit 0
[ -f "$cwd/.envrc" ] || exit 0

# 既に direnv exec ラップ済みなら無限再帰防止のためスルー
case "$command" in
  "direnv exec "*) exit 0 ;;
esac

# シェル構文（&& / | / リダイレクト等）を保持しつつ、UTF-8 マルチバイト
# 文字を壊さないため base64 経由で inner bash に渡す。
# (printf '%q' は非 ASCII を $'...' エスケープするが、シェル間の引き渡しで
#  バイトが破壊されることがあるため避ける)
b64=$(printf '%s' "$command" | base64 | tr -d '\n')
wrapped="direnv exec $cwd bash -c 'echo $b64 | base64 -d | bash'"

jq -n --arg cmd "$wrapped" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow",
    updatedInput: { command: $cmd }
  }
}'
