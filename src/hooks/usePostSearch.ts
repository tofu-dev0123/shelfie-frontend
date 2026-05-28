import { useCallback, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { toast } from "sonner";
import { searchPosts } from "@/lib/api/posts";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { PostSearchResponse } from "@/types/post";

type PostSearchMode = "q" | "tag";

type SearchKey = {
  type: "post-search";
  mode: PostSearchMode;
  query: string;
  cursor: string | null;
};

/**
 * 投稿検索SWRフック（無限スクロール対応）。本文検索とタグ検索を mode で切り替える。
 * クエリが空の場合はフェッチしない。
 * @param mode - "q"（本文部分一致）または "tag"（タグ完全一致）
 * @param query - 検索クエリ（空文字の場合はフェッチしない）
 * @returns items, hasMore, isEmpty, isLoading, sentinelRef
 */
export const usePostSearch = (mode: PostSearchMode, query: string) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const getKey = (
    pageIndex: number,
    previousPageData: PostSearchResponse | null,
  ): SearchKey | null => {
    if (!query) return null;
    if (previousPageData && !previousPageData.pagination.has_next) return null;
    const cursor =
      pageIndex === 0
        ? null
        : (previousPageData?.pagination.next_cursor ?? null);
    return { type: "post-search", mode, query, cursor };
  };

  const { data, setSize, isLoading } = useSWRInfinite<PostSearchResponse>(
    getKey,
    ({ mode, query, cursor }: SearchKey) =>
      mode === "q"
        ? searchPosts({ q: query, cursor })
        : searchPosts({ tag: query, cursor }),
    {
      onError: () => {
        logger.error("投稿検索失敗", {
          endpoint: API_ENDPOINTS.POSTS_SEARCH,
        });
        toast.error(MESSAGES.BOOK.POST_SEARCH_ERROR);
      },
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    setSize(1);
  }, [mode, query, setSize]);

  const items = data ? data.flatMap((d) => d?.items ?? []) : [];
  const hasMore = data
    ? (data[data.length - 1]?.pagination.has_next ?? false)
    : false;
  const isEmpty = !isLoading && data !== undefined && items.length === 0;
  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return { items, hasMore, isEmpty, isLoading, sentinelRef };
};
