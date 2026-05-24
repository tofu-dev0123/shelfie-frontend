import Link from "next/link";
import type { User } from "@/types/user";
import { FollowButton } from "./FollowButton";
import styles from "./styles/ShelfHeader.module.css";

type Props = {
  user: User;
  isMe: boolean;
  isLoggedIn: boolean;
};

export function ShelfHeader({ user, isMe, isLoggedIn }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          {isMe ? (
            <Link href="/profile" className={styles.profileLink}>
              <UserIdentity user={user} />
            </Link>
          ) : (
            <div className={styles.profileBlock}>
              <UserIdentity user={user} />
            </div>
          )}

          {!isMe && isLoggedIn && <FollowButton username={user.username} />}
        </div>
      </div>
    </div>
  );
}

function UserIdentity({ user }: { user: User }) {
  return (
    <>
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

      <div className={styles.nameRow}>
        <span className={styles.nickname}>{user.nickname}</span>
        <span className={styles.username}>@{user.username}</span>
      </div>
    </>
  );
}
