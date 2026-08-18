"use client";

import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useBookSearch } from "@/hooks/useBookSearch";
import { BookSearchSkeleton } from "./BookSearchSkeleton";
import { SearchBookCard } from "./SearchBookCard";
import styles from "./styles/SearchContent.module.css";

type Props = {
  q: string;
};

export function BookSearchResults({ q }: Props) {
  const { isSignedIn, isInitializing } = useAuth();
  const { books, isEmpty, isLoading, sentinelRef } = useBookSearch(
    q,
    isSignedIn,
  );

  const hasSearched = q !== "";
  const isFirstLoading = isLoading && books.length === 0;

  if (!hasSearched) {
    return (
      <div className={styles.emptyState}>
        <i className={`fa-solid fa-magnifying-glass ${styles.emptyIcon}`} />
        <p className={styles.emptyText}>キーワードを入力して検索してください</p>
      </div>
    );
  }

  if (!isInitializing && !isSignedIn) {
    return (
      <div className={styles.loginRequired}>
        <i className={`fa-solid fa-lock ${styles.loginRequiredIcon}`} />
        <p className={styles.loginRequiredText}>
          書籍の検索にはログインが必要です
        </p>
        <Link href="/login" className={styles.loginLink}>
          ログインする
        </Link>
      </div>
    );
  }

  if (isFirstLoading) {
    return <BookSearchSkeleton />;
  }

  if (isSignedIn && isEmpty) {
    return (
      <div className={styles.emptyState}>
        <i className={`fa-solid fa-box-open ${styles.emptyIcon}`} />
        <p className={styles.emptyText}>
          「{q}」に一致する本が見つかりませんでした
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.resultGrid}>
        {books.map((book) => (
          <SearchBookCard key={book.isbn} book={book} />
        ))}
      </div>
      <div ref={sentinelRef} className={styles.sentinel} />
      {isLoading && books.length > 0 && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </>
  );
}
