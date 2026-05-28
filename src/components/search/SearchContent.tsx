"use client";

import { useSearchForm } from "@/hooks/useSearchForm";
import { SearchTabs } from "./SearchTabs";
import { BookSearchResults } from "./BookSearchResults";
import { PostSearchResults } from "./PostSearchResults";
import styles from "./styles/SearchContent.module.css";

const PLACEHOLDERS = {
  books: "本を検索",
  posts: "投稿を検索",
  tags: "タグを検索",
} as const;

export function SearchContent() {
  const { type, keyword, setKeyword, handleSubmit, switchType, q } =
    useSearchForm();

  return (
    <div className={styles.container}>
      <SearchTabs current={type} onChange={switchType} />

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={PLACEHOLDERS[type]}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          検索
        </button>
      </form>

      {type === "books" && <BookSearchResults q={q} />}
      {type === "posts" && <PostSearchResults mode="q" q={q} />}
      {type === "tags" && <PostSearchResults mode="tag" q={q} />}
    </div>
  );
}
