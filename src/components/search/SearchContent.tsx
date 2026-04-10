"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/store/authStore";
import { useBookSearch } from "@/hooks/useBookSearch";
import { useSearchForm } from "@/hooks/useSearchForm";
import { SearchBookCard } from "./SearchBookCard";
import styles from "./styles/SearchContent.module.css";

export function SearchContent() {
  const { isSignedIn } = useAuth();
  const accessToken = useAuthStore((s) => s.accessToken);

  // RailsトークンまたはClerkセッションのどちらかがあれば認証済みとみなす
  // （ページリロード直後はZustandが空でもClerkセッションがあればサイレントリフレッシュで対応できる）
  const isAuthenticated = !!accessToken || !!isSignedIn;

  const { keyword, setKeyword, handleSubmit, q } = useSearchForm();
  const { data, isLoading } = useBookSearch(q, isAuthenticated);

  const books = data?.books;
  const hasSearched = q !== "";

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
          disabled={isLoading}
          className={styles.searchButton}
        >
          {isLoading ? "検索中..." : "検索"}
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

      {/* qパラメータあり・未認証（直接URLアクセスなど） */}
      {hasSearched && !isAuthenticated && (
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
      {hasSearched && isAuthenticated && !isLoading && books?.length === 0 && (
        <div className={styles.emptyState}>
          <i className={`fa-solid fa-box-open ${styles.emptyIcon}`} />
          <p className={styles.emptyText}>
            「{q}」に一致する本が見つかりませんでした
          </p>
        </div>
      )}

      {/* 検索結果 */}
      {hasSearched && isAuthenticated && books && books.length > 0 && (
        <ul className={styles.resultList}>
          {books.map((book) => (
            <li key={book.google_books_id}>
              <SearchBookCard book={book} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
