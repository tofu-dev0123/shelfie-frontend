"use client";

import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useFeed } from "@/hooks/useFeed";
import { FeedPostCard } from "./FeedPostCard";
import { FeedSkeleton } from "./FeedSkeleton";
import styles from "./styles/Feed.module.css";

export function Feed() {
  const { isSignedIn, isInitializing } = useAuth();
  const { items, isEmpty, isLoading, sentinelRef } = useFeed(isSignedIn);

  const isInitialLoading = isLoading && items.length === 0;
  const isLoadingMore = isLoading && items.length > 0;

  if (isInitializing || isInitialLoading) {
    return (
      <div className={styles.container}>
        <FeedSkeleton />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.container}>
        <p className={styles.placeholder}>
          {isSignedIn
            ? "まだ投稿がありません。ユーザーをフォローするとここに表示されます。"
            : "まだ投稿がありません。"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          <Spinner />
        </div>
      ) : null}
    </div>
  );
}
