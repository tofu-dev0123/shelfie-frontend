import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { getUserBooks } from "@/lib/api/books";
import type { UserBooksResponse } from "@/types/book";

type BookKey = {
  type: "user-books";
  username: string;
  status: "done" | "want";
  page: number;
};

/**
 * ユーザーの本棚を無限スクロールで取得するSWRフック。
 * statusが変わると自動的にページ1からリセットする。
 * @param username - ユーザー名
 * @param status - 本のステータス（done: 読了 / want: 読みたい）
 * @returns books, hasMore, isEmpty, isLoading, loadMore
 */
export const useUserBooks = (username: string, status: "done" | "want") => {
  const getKey = (
    pageIndex: number,
    previousPageData: UserBooksResponse | null,
  ): BookKey | null => {
    if (previousPageData && !previousPageData.has_next) return null;
    return { type: "user-books", username, status, page: pageIndex + 1 };
  };

  const { data, size, setSize, isLoading } = useSWRInfinite<UserBooksResponse>(
    getKey,
    ({ username, status, page }: BookKey) =>
      getUserBooks(username, status, page),
  );

  // statusが変わったらページをリセット
  useEffect(() => {
    setSize(1);
  }, [status, setSize]);

  const books = data ? data.flatMap((d) => d.books) : [];
  const hasMore = data ? (data[data.length - 1]?.has_next ?? false) : false;
  const isEmpty = data?.[0]?.books.length === 0;

  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  return { books, hasMore, isEmpty, isLoading, size, loadMore };
};
