import { useState, useEffect, useRef } from "react";
import { useUserBooks } from "./useUserBooks";
import { useMyWantToReads } from "./useMyWantToReads";
import type { Book } from "@/types/book";

export type ShelfItem = {
  key: string;
  book: Book;
};

/**
 * 本棚のタブ状態と無限スクロールを管理するフック。
 * activeTab に応じて「読了（/v1/users/:username/books）」と
 * 「読みたい（/v1/me/want_to_reads）」を切り替える。
 * 「読みたい」は自分自身の本棚画面でしか使わないため、isMe が false のときはフェッチをスキップする。
 * @param username - ユーザー名
 * @param isMe - 表示中の本棚が自分のものかどうか
 * @returns activeTab, setActiveTab, sentinelRef, items, hasMore, isEmpty, isLoading
 */
export const useBookShelf = (username: string, isMe: boolean) => {
  const [activeTab, setActiveTab] = useState<"done" | "want">("done");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const done = useUserBooks(username);
  const want = useMyWantToReads(isMe);

  // アクティブタブに応じて使用するフックの状態を切り替える。
  // 非アクティブ側の SWR はフェッチ済みデータがあればキャッシュから返すだけ。
  const isActiveDone = activeTab === "done";
  const items: ShelfItem[] = isActiveDone
    ? done.books.map((post) => ({ key: String(post.id), book: post.book }))
    : want.books.map((book) => ({ key: book.isbn, book }));
  const hasMore = isActiveDone ? done.hasMore : want.hasMore;
  const isEmpty = isActiveDone ? done.isEmpty : want.isEmpty;
  const isLoading = isActiveDone ? done.isLoading : want.isLoading;
  const loadMore = isActiveDone ? done.loadMore : want.loadMore;

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
    activeTab,
    setActiveTab,
    sentinelRef,
    items,
    hasMore,
    isEmpty,
    isLoading,
  };
};
