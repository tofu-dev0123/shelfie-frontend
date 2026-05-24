"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useFeed } from "@/hooks/useFeed";
import { FeedPostCard } from "./FeedPostCard";
import styles from "./styles/Feed.module.css";

export function Feed() {
  const { isSignedIn, isInitializing } = useAuth();
  const { items, isEmpty, isLoading, sentinelRef } = useFeed(isSignedIn);

  const isInitialLoading = isLoading && items.length === 0;
  const isLoadingMore = isLoading && items.length > 0;

  return (
    <div className={styles.container}>
      {isInitializing || isInitialLoading ? (
        <p className={styles.placeholder}>読み込み中...</p>
      ) : isEmpty ? (
        <p className={styles.placeholder}>
          {isSignedIn
            ? "まだ投稿がありません。ユーザーをフォローするとここに表示されます。"
            : "まだ投稿がありません。"}
        </p>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <FeedPostCard item={item} />
              </li>
            ))}
          </ul>

          <div ref={sentinelRef} className={styles.sentinel} />

          {isLoadingMore ? (
            <div className={styles.loading}>
              <i className="fa-solid fa-spinner fa-spin" />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
