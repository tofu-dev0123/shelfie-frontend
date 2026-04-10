import Link from "next/link";
import type { User } from "@/types/user";
import { FollowButton } from "./FollowButton";
import styles from "./styles/ProfileHeader.module.css";

type Props = {
  user: User;
  isLoggedIn: boolean;
};

export function ProfileHeader({ user, isLoggedIn }: Props) {
  return (
    <div className={styles.profileSection}>
      <div className={styles.container}>
        <div className={styles.header}>
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

          <div className={styles.info}>
            <div className={styles.nameRow}>
              <span className={styles.nickname}>{user.nickname}</span>
              <span className={styles.username}>@{user.username}</span>
            </div>

            {user.bio && <p className={styles.bio}>{user.bio}</p>}

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{user.books_count}</span>
                <span className={styles.statLabel}>投稿</span>
              </div>
              <Link
                href={`/users/${user.username}/followers`}
                className={styles.statLink}
              >
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {user.followers_count}
                  </span>
                  <span className={styles.statLabel}>フォロワー</span>
                </div>
              </Link>
              <Link
                href={`/users/${user.username}/following`}
                className={styles.statLink}
              >
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {user.following_count}
                  </span>
                  <span className={styles.statLabel}>フォロー中</span>
                </div>
              </Link>
            </div>

            <div className={styles.actions}>
              {user.is_me && (
                <Link href="/settings/profile" className={styles.editButton}>
                  プロフィールを編集
                </Link>
              )}
              {!user.is_me && isLoggedIn && (
                <FollowButton
                  username={user.username}
                  initialIsFollowing={user.is_following}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
