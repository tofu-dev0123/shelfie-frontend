"use client";

import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { useBookShelf } from "@/hooks/users/useBookShelf";
import { BookCard } from "./BookCard";
import { BookShelfSkeleton } from "./BookShelfSkeleton";
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
  const { activeTab, setActiveTab, sentinelRef, items, isEmpty, isLoading } =
    useBookShelf(username);

  const visibleTabs = isMe ? TABS : TABS.filter((t) => t.key === "done");
  const isInitialLoading = isLoading && items.length === 0;
  const isLoadingMore = isLoading && items.length > 0;

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

        {isInitialLoading ? (
          <BookShelfSkeleton />
        ) : isEmpty ? (
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
              {items.map((item) => (
                <BookCard
                  key={item.key}
                  book={item.book}
                  username={username}
                  linkTo={activeTab === "want" ? "postNew" : "detail"}
                />
              ))}
            </div>

            {/* 無限スクロールのセンチネル */}
            <div ref={sentinelRef} className={styles.sentinel} />

            {isLoadingMore && (
              <div className={styles.loading}>
                <Spinner />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
