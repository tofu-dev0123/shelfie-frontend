import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { getUserBooks } from "@/lib/api/books";
import type { BookPostsResponse } from "@/types/book";

type BookKey = {
  type: "user-books";
  username: string;
  status: "done" | "want";
  cursor: string | null;
};

/**
 * ユーザーの本棚を無限スクロールで取得するSWRフック。
 * statusが変わると自動的に先頭からリセットする。
 * @param username - ユーザー名
 * @param status - 本のステータス（done: 読了 / want: 読みたい）
 * @returns books, hasMore, isEmpty, isLoading, loadMore
 */
export const useUserBooks = (username: string, status: "done" | "want") => {
  const getKey = (
    pageIndex: number,
    previousPageData: BookPostsResponse | null,
  ): BookKey | null => {
    if (previousPageData && !previousPageData.pagination.has_next) return null;
    const cursor =
      pageIndex === 0
        ? null
        : (previousPageData?.pagination.next_cursor ?? null);
    return { type: "user-books", username, status, cursor };
  };

  const { data, size, setSize, isLoading } =
    useSWRInfinite<BookPostsResponse>(
      getKey,
      ({ username, status, cursor }: BookKey) =>
        getUserBooks(username, status, cursor),
    );

  // statusが変わったらページをリセット
  useEffect(() => {
    setSize(1);
  }, [status, setSize]);

  const books = data ? data.flatMap((d) => d?.items ?? []) : [];
  const hasMore = data
    ? (data[data.length - 1]?.pagination.has_next ?? false)
    : false;
  const isEmpty = !isLoading && data !== undefined && books.length === 0;

  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  return { books, hasMore, isEmpty, isLoading, size, loadMore };
};
