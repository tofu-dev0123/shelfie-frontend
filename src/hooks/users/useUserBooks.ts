import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { toast } from "sonner";
import { getUserBooks } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { BookPostsResponse } from "@/types/book";

type BookKey = {
  type: "user-books";
  username: string;
  cursor: string | null;
};

/**
 * ユーザーの本棚（読了した本の投稿一覧）を無限スクロールで取得するSWRフック。
 * @param username - ユーザー名
 * @param fallbackFirstPage - Server Componentsで取得した1ページ目。渡すと初回フェッチを省略する
 * @returns books, hasMore, isEmpty, isLoading, loadMore
 */
export const useUserBooks = (
  username: string,
  fallbackFirstPage?: BookPostsResponse,
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: BookPostsResponse | null,
  ): BookKey | null => {
    if (previousPageData && !previousPageData.pagination.has_next) return null;
    const cursor =
      pageIndex === 0
        ? null
        : (previousPageData?.pagination.next_cursor ?? null);
    return { type: "user-books", username, cursor };
  };

  const { data, setSize, isLoading } = useSWRInfinite<BookPostsResponse>(
    getKey,
    ({ username, cursor }: BookKey) => getUserBooks(username, cursor),
    {
      ...(fallbackFirstPage ? { fallbackData: [fallbackFirstPage] } : {}),
      onError: () => {
        logger.error("本棚取得失敗", {
          endpoint: API_ENDPOINTS.USER_BOOKS(username),
        });
        toast.error(MESSAGES.BOOK.SHELF_FETCH_ERROR);
      },
      shouldRetryOnError: false,
    },
  );

  const books = data ? data.flatMap((d) => d?.items ?? []) : [];
  const hasMore = data
    ? (data[data.length - 1]?.pagination.has_next ?? false)
    : false;
  const isEmpty = !isLoading && data !== undefined && books.length === 0;

  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  return { books, hasMore, isEmpty, isLoading, loadMore };
};
