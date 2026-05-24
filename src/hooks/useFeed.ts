import { useCallback, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { getFeed } from "@/lib/api/feed";
import type { FeedResponse } from "@/types/feed";

type FeedKey = {
  type: "feed";
  cursor: string | null;
  signedIn: boolean;
};

/**
 * フィードを無限スクロールで取得するSWRフック。
 * バックエンドは認証ヘッダの有無でレスポンスが変わるため、signedIn をキーに含めて
 * ログイン状態が変わったらキャッシュを分離する。
 * 末尾のセンチネル要素が表示領域に入ると次ページを自動取得する。
 * @param signedIn - ログイン状態
 * @returns items, hasMore, isEmpty, isLoading, sentinelRef
 */
export const useFeed = (signedIn: boolean) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const getKey = (
    pageIndex: number,
    previousPageData: FeedResponse | null,
  ): FeedKey | null => {
    if (previousPageData && !previousPageData.pagination.has_next) return null;
    const cursor =
      pageIndex === 0
        ? null
        : (previousPageData?.pagination.next_cursor ?? null);
    return { type: "feed", cursor, signedIn };
  };

  const { data, setSize, isLoading } = useSWRInfinite<FeedResponse>(
    getKey,
    ({ cursor }: FeedKey) => getFeed(cursor),
  );

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
