"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUserBooks } from "@/hooks/useUserBooks";
import { BookCard } from "./BookCard";
import styles from "./styles/BookShelf.module.css";

type Props = {
  username: string;
  isMe: boolean;
};

const TABS = [
  { key: "done" as const, label: "読了" },
  { key: "want" as const, label: "読みたい" },
];

export function BookShelf({ username, isMe }: Props) {
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

  const visibleTabs = isMe ? TABS : TABS.filter((t) => t.key === "done");

  return (
    <div className={styles.shelfSection}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isEmpty && !isLoading ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              {activeTab === "done"
                ? "まだ読了した本がありません"
                : "まだ読みたい本がありません"}
            </p>
            {isMe && activeTab === "done" && (
              <Link href="/books/new" className={styles.postButton}>
                本を投稿する
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {books.map((book) => (
                <BookCard
                  key={book.google_books_id}
                  book={book}
                  username={username}
                />
              ))}
            </div>

            {/* 無限スクロールのセンチネル */}
            <div ref={sentinelRef} className={styles.sentinel} />

            {isLoading && (
              <div className={styles.loading}>
                <i className="fa-solid fa-spinner fa-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
