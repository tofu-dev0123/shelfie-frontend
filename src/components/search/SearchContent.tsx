"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import { useBookSearch } from "@/hooks/useBookSearch";
import { useSearchForm } from "@/hooks/useSearchForm";
import { SearchBookCard } from "./SearchBookCard";
import styles from "./styles/SearchContent.module.css";

export function SearchContent() {
  const { isSignedIn, isInitializing } = useAuth();

  const { keyword, setKeyword, handleSubmit, q } = useSearchForm();
  const { books, isEmpty, isLoading, sentinelRef } = useBookSearch(
    q,
    isSignedIn,
  );

  const hasSearched = q !== "";
  // 追加ロード中はスピナーのみ表示し、ボタンは「検索中...」にしない
  const isFirstLoading = isLoading && books.length === 0;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="本を検索"
          className={styles.searchInput}
        />
        <button
          type="submit"
          disabled={isFirstLoading}
          className={styles.searchButton}
        >
          {isFirstLoading ? "検索中..." : "検索"}
        </button>
      </form>

      {/* 未検索 */}
      {!hasSearched && (
        <div className={styles.emptyState}>
          <i className={`fa-solid fa-magnifying-glass ${styles.emptyIcon}`} />
          <p className={styles.emptyText}>
            キーワードを入力して検索してください
          </p>
        </div>
      )}

      {/* qパラメータあり・未ログイン（初期化完了後のみ表示してフラッシュを防ぐ） */}
      {hasSearched && !isInitializing && !isSignedIn && (
        <div className={styles.loginRequired}>
          <i className={`fa-solid fa-lock ${styles.loginRequiredIcon}`} />
          <p className={styles.loginRequiredText}>
            書籍の検索にはログインが必要です
          </p>
          <Link href="/login" className={styles.loginLink}>
            ログインする
          </Link>
        </div>
      )}

      {/* 0件 */}
      {hasSearched && isSignedIn && isEmpty && (
        <div className={styles.emptyState}>
          <i className={`fa-solid fa-box-open ${styles.emptyIcon}`} />
          <p className={styles.emptyText}>
            「{q}」に一致する本が見つかりませんでした
          </p>
        </div>
      )}

      {/* 検索結果 — isAuthenticated は SWR キー側で保証済みのため描画条件には含めない */}
      {hasSearched && books.length > 0 && (
        <>
          <div className={styles.resultGrid}>
            {books.map((book) => (
              <SearchBookCard key={book.isbn} book={book} />
            ))}
          </div>
          <div ref={sentinelRef} className={styles.sentinel} />
          {isLoading && (
            <div className={styles.loading}>
              <i className="fa-solid fa-spinner fa-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
