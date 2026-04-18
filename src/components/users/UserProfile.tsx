"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/useMe";
import { useUser } from "@/hooks/users/useUser";
import type { User } from "@/types/user";
import styles from "./styles/UserProfile.module.css";

type Props = {
  username: string;
  fallbackUser: User;
};

export function UserProfile({ username, fallbackUser }: Props) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isSignedIn = !!accessToken;
  const { data: user } = useUser(username, fallbackUser);
  const { data: me } = useMe(isSignedIn);

  // useMe解決後にusernameを比較してis_meを判定する
  const isMe = !!me && me.username === username;

  if (!user) return null;

  return (
    <div className={styles.page}>
      <Link href={`/users/${username}`} className={styles.backLink}>
        <i className="fa-solid fa-chevron-left" />
        本棚に戻る
      </Link>

      <aside className={styles.sidebar}>
        <div className={styles.avatar}>
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.nickname}
              className={styles.avatarImage}
            />
          ) : (
            <i className={`fa-solid fa-user ${styles.avatarIcon}`} />
          )}
        </div>

        <div className={styles.nickname}>{user.nickname}</div>
        <div className={styles.username}>@{user.username}</div>

        {isMe && (
          <Link href="/settings/profile" className={styles.editButton}>
            <i className="fa-solid fa-pen" />
            プロフィールを編集
          </Link>
        )}

        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        <div className={styles.metaList}>
          <div className={styles.metaItem}>
            <i className={`fa-solid fa-book-open ${styles.metaIcon}`} />
            <span>
              <strong>{user.books_count}</strong> 冊投稿
            </span>
          </div>
          <div className={styles.metaItem}>
            <i className={`fa-solid fa-users ${styles.metaIcon}`} />
            <span>
              <Link
                href={`/users/${username}/followers`}
                className={styles.metaLink}
              >
                <strong>{user.followers_count}</strong> フォロワー
              </Link>
              {" · "}
              <Link
                href={`/users/${username}/following`}
                className={styles.metaLink}
              >
                <strong>{user.following_count}</strong> フォロー中
              </Link>
            </span>
          </div>
        </div>
      </aside>

      <section className={styles.mainContent}>
        <div className={styles.mainEmpty}>
          <i className={`fa-solid fa-book ${styles.mainEmptyIcon}`} />
          <p className={styles.mainEmptyText}>
            {isMe
              ? "あなたの本棚を確認できます"
              : "このユーザーの本棚を見てみましょう"}
          </p>
          <Link href={`/users/${username}`} className={styles.mainEmptyLink}>
            本棚を見る <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </section>
    </div>
  );
}
