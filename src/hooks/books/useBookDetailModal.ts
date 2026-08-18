"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * 本棚から開いた投稿詳細モーダルの開閉を扱うフック。
 * Intercepting Routes でモーダルを開いているため、履歴を1つ戻すことが「閉じる」に相当する。
 * @returns close - モーダルを閉じるハンドラー
 */
export const useBookDetailModal = () => {
  const router = useRouter();

  const close = useCallback(() => router.back(), [router]);

  return { close };
};
