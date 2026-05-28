"use client";

import { usePostSearch } from "@/hooks/usePostSearch";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import styles from "./styles/SearchContent.module.css";
import postStyles from "./styles/PostSearchResults.module.css";

type Props = {
  mode: "q" | "tag";
  q: string;
};

export function PostSearchResults({ mode, q }: Props) {
  const { items, isEmpty, isLoading, sentinelRef } = usePostSearch(mode, q);

  const hasSearched = q !== "";
  const isFirstLoading = isLoading && items.length === 0;

  if (!hasSearched) {
    const message =
      mode === "tag"
        ? "タグ名を入力して検索してください"
        : "キーワードを入力して投稿を検索してください";
    return (
      <div className={styles.emptyState}>
        <i className={`fa-solid fa-magnifying-glass ${styles.emptyIcon}`} />
        <p className={styles.emptyText}>{message}</p>
      </div>
    );
  }

  if (isFirstLoading) {
    return (
      <div className={styles.loading}>
        <i className="fa-solid fa-spinner fa-spin" />
      </div>
    );
  }

  if (isEmpty) {
    const message =
      mode === "tag"
        ? `タグ「${q}」が付いた投稿が見つかりませんでした`
        : `「${q}」を含む投稿が見つかりませんでした`;
    return (
      <div className={styles.emptyState}>
        <i className={`fa-solid fa-box-open ${styles.emptyIcon}`} />
        <p className={styles.emptyText}>{message}</p>
      </div>
    );
  }

  return (
    <>
      <ul className={postStyles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <FeedPostCard item={item} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className={styles.sentinel} />
      {isLoading && items.length > 0 && (
        <div className={styles.loading}>
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
      )}
    </>
  );
}
