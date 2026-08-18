"use client";

import { useSearchForm } from "@/hooks/useSearchForm";
import { BookSearchResults } from "./BookSearchResults";
import styles from "./styles/SearchContent.module.css";

export function SearchContent() {
  const { keyword, setKeyword, handleSubmit, q } = useSearchForm();

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
        <button type="submit" className={styles.searchButton}>
          検索
        </button>
      </form>

      <BookSearchResults q={q} />
    </div>
  );
}
