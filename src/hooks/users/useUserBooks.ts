import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { getUserBooks } from "@/lib/api/books";
import type { BookPostsResponse } from "@/types/book";

type BookKey = {
  type: "user-books";
  username: string;
  cursor: string | null;
};

/**
 * ユーザーの本棚（読了した本の投稿一覧）を無限スクロールで取得するSWRフック。
 * @param username - ユーザー名
 * @returns books, hasMore, isEmpty, isLoading, loadMore
 */
export const useUserBooks = (username: string) => {
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
  );

  const books = data ? data.flatMap((d) => d?.items ?? []) : [];
  const hasMore = data
    ? (data[data.length - 1]?.pagination.has_next ?? false)
    : false;
  const isEmpty = !isLoading && data !== undefined && books.length === 0;

  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  return { books, hasMore, isEmpty, isLoading, loadMore };
};
