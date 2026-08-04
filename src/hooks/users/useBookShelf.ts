import { useEffect, useRef } from "react";
import { useUserBooks } from "./useUserBooks";
import type { Book } from "@/types/book";

export type ShelfItem = {
  key: string;
  book: Book;
};

/**
 * 本棚（読了 = /v1/users/:username/books）の無限スクロールを管理するフック。
 * @param username - ユーザー名
 * @returns sentinelRef, items, hasMore, isEmpty, isLoading
 */
export const useBookShelf = (username: string) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { books, hasMore, isEmpty, isLoading, loadMore } =
    useUserBooks(username);

  const items: ShelfItem[] = books.map((post) => ({
    key: String(post.id),
    book: post.book,
  }));

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

  return {
    sentinelRef,
    items,
    hasMore,
    isEmpty,
    isLoading,
  };
};
