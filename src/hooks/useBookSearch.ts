import { useCallback, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { toast } from "sonner";
import { searchBooks } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { SearchBooksResponse } from "@/types/book";

type SearchKey = {
  type: "book-search";
  q: string;
  cursor: string | null;
};

/**
 * 書籍検索SWRフック（無限スクロール対応）。
 * キーワードが空または未認証の場合はフェッチしない。
 * @param q - 検索キーワード（空文字の場合はフェッチしない）
 * @param isAuthenticated - Railsトークンが存在するか（falseの場合はフェッチしない）
 * @returns books, hasMore, isEmpty, isLoading, sentinelRef
 */
export const useBookSearch = (q: string, isAuthenticated: boolean) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const getKey = (
    pageIndex: number,
    previousPageData: SearchBooksResponse | null,
  ): SearchKey | null => {
    if (!q || !isAuthenticated) return null;
    if (previousPageData && !previousPageData.pagination.has_next) return null;
    const cursor =
      pageIndex === 0
        ? null
        : (previousPageData?.pagination.next_cursor ?? null);
    return { type: "book-search", q, cursor };
  };

  const { data, size, setSize, isLoading } =
    useSWRInfinite<SearchBooksResponse>(
      getKey,
      ({ q, cursor }: SearchKey) => searchBooks(q, cursor),
      {
        onError: () => {
          logger.error("書籍検索失敗", {
            endpoint: API_ENDPOINTS.BOOKS_SEARCH,
          });
          toast.error(MESSAGES.BOOK.SEARCH_ERROR);
        },
        shouldRetryOnError: false,
      },
    );

  // qが変わったら先頭からリセット
  useEffect(() => {
    setSize(1);
  }, [q, setSize]);

  const books = data ? data.flatMap((d) => d?.items ?? []) : [];
  const hasMore = data
    ? (data[data.length - 1]?.pagination.has_next ?? false)
    : false;
  const isEmpty = !isLoading && data !== undefined && books.length === 0;
  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  // スクロールが末尾に達したら次ページを自動取得
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

  return { books, hasMore, isEmpty, isLoading, size, sentinelRef };
};
