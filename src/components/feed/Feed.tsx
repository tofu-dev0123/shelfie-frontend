"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useFeed } from "@/hooks/useFeed";
import { FeedPostCard } from "./FeedPostCard";
import styles from "./styles/Feed.module.css";

export function Feed() {
  const { isSignedIn, isInitializing } = useAuth();
  const { items, hasMore, isEmpty, isLoading, loadMore } = useFeed(isSignedIn);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>フィード</h1>
        <p className={styles.lead}>
          {isSignedIn
            ? "フォロー中のユーザーと自分の投稿を、投稿日時順で表示しています。"
            : "みんなの読了した本を、投稿日時順で表示しています。"}
        </p>
      </header>

      {isInitializing || isLoading ? (
        <p className={styles.placeholder}>読み込み中...</p>
      ) : isEmpty ? (
        <p className={styles.placeholder}>
          {isSignedIn
            ? "まだ投稿がありません。ユーザーをフォローするとここに表示されます。"
            : "まだ投稿がありません。"}
        </p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <FeedPostCard item={item} />
            </li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <button type="button" className={styles.loadMore} onClick={loadMore}>
          さらに読み込む
        </button>
      ) : null}
    </div>
  );
}
