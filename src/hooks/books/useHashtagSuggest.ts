import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { getTags } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { logger } from "@/lib/logger";

type SuggestKey = { type: "tag-suggest"; endpoint: string; q: string };

/**
 * 本文入力中のハッシュタグサジェスト用 SWR フック。
 * クエリは 300ms デバウンスし、空文字の間はフェッチしない（バックエンドは q 必須）。
 * サジェストはキーストロークごとに発生し得るため、失敗時はログのみに留めトーストは出さない。
 * @param query - 検出されたハッシュタグトークン（先頭の # を除いた文字列）
 * @returns suggestions（タグ名の配列）と isLoading
 */
export const useHashtagSuggest = (query: string) => {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const key: SuggestKey | null = debounced
    ? { type: "tag-suggest", endpoint: API_ENDPOINTS.TAGS, q: debounced }
    : null;

  const { data, isLoading } = useSWR(key, ({ q }: SuggestKey) => getTags(q), {
    shouldRetryOnError: false,
    keepPreviousData: true,
    onError: () => {
      logger.error("タグサジェスト失敗", { endpoint: API_ENDPOINTS.TAGS });
    },
  });

  // data が変わらない限り同一参照を返す。呼び出し側で `suggestions !== prev` による
  // 差分検知（activeIndex リセット）に使うため、参照安定性が必要。
  const suggestions = useMemo(
    () => data?.tags.map((t) => t.name) ?? [],
    [data],
  );

  return { suggestions, isLoading };
};
