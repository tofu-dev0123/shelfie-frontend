import Link from "next/link";
import type { User } from "@/types/user";
import { initialOf } from "@/lib/initial";
import styles from "./styles/ShelfHeader.module.css";

type Props = {
  user: User;
  isMe: boolean;
};

export function ShelfHeader({ user, isMe }: Props) {
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
        </div>
      </div>
    </div>
  );
}

function UserIdentity({ user }: { user: User }) {
  return (
    <>
      <div className={styles.avatar} aria-hidden="true">
        {initialOf(user.nickname)}
      </div>

      <div className={styles.nameRow}>
        <span className={styles.nickname}>{user.nickname}</span>
        <span className={styles.username}>@{user.username}</span>
      </div>
    </>
  );
}
