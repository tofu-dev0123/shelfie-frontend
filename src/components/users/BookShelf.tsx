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

export function BookShelf({ username, isMe }: Props) {
  const { sentinelRef, items, isEmpty, isLoading } = useBookShelf(username);

  const isInitialLoading = isLoading && items.length === 0;
  const isLoadingMore = isLoading && items.length > 0;

  return (
    <div className={styles.shelfSection}>
      <div className={styles.container}>
        {isInitialLoading ? (
          <BookShelfSkeleton />
        ) : isEmpty ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>まだ読了した本がありません</p>
            {isMe && (
              <Link href="/books/new" className={styles.postButton}>
                本を投稿する
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {items.map((item) => (
                <BookCard key={item.key} book={item.book} username={username} />
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
