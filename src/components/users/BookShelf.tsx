"use client";

import Link from "next/link";
import { useBookShelf } from "@/hooks/users/useBookShelf";
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
  const { activeTab, setActiveTab, sentinelRef, books, isEmpty, isLoading } =
    useBookShelf(username);

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
              {books.map((post) => (
                <BookCard
                  key={post.id}
                  book={post.book}
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
