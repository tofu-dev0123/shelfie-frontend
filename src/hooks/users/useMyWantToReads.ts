import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import { getMyWantToReads } from "@/lib/api/books";
import type { WantToReadsResponse } from "@/types/book";

type WantKey = {
  type: "my-want-to-reads";
  cursor: string | null;
};

/**
 * 自分の読みたいリストを無限スクロールで取得するSWRフック。
 * Bearer 認証必須のため、ログイン済みのコンポーネントからのみ呼び出す。
 * @returns books, hasMore, isEmpty, isLoading, loadMore
 */
export const useMyWantToReads = () => {
  const getKey = (
    pageIndex: number,
    previousPageData: WantToReadsResponse | null,
  ): WantKey | null => {
    if (previousPageData && !previousPageData.pagination.has_next) return null;
    const cursor =
      pageIndex === 0
        ? null
        : (previousPageData?.pagination.next_cursor ?? null);
    return { type: "my-want-to-reads", cursor };
  };

  const { data, setSize, isLoading } = useSWRInfinite<WantToReadsResponse>(
    getKey,
    ({ cursor }: WantKey) => getMyWantToReads(cursor),
  );

  const books = data ? data.flatMap((d) => d?.items ?? []) : [];
  const hasMore = data
    ? (data[data.length - 1]?.pagination.has_next ?? false)
    : false;
  const isEmpty = !isLoading && data !== undefined && books.length === 0;

  const loadMore = useCallback(() => setSize((prev) => prev + 1), [setSize]);

  return { books, hasMore, isEmpty, isLoading, loadMore };
};
