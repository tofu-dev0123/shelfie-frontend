import { useState, useEffect, useRef } from "react";
import { useUserBooks } from "./useUserBooks";

/**
 * 本棚のタブ状態と無限スクロールを管理するフック。
 * @param username - ユーザー名
 * @returns activeTab, setActiveTab, sentinelRef, books, hasMore, isEmpty, isLoading
 */
export const useBookShelf = (username: string) => {
  const [activeTab, setActiveTab] = useState<"done" | "want">("done");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { books, hasMore, isEmpty, isLoading, loadMore } = useUserBooks(
    username,
    activeTab,
  );

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
    books,
    hasMore,
    isEmpty,
    isLoading,
  };
};
