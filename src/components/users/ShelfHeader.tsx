import Link from "next/link";
import type { User } from "@/types/user";
import { initialOf } from "@/lib/initial";
import styles from "./styles/ShelfHeader.module.css";

type Props = {
  user: User;
  isMe: boolean;
  /** ヒーロー背景にぼかして敷く書影URL。空配列なら単色背景になる */
  coverUrls: string[];
};

export function ShelfHeader({ user, isMe, coverUrls }: Props) {
  return (
    <div className={styles.hero}>
      {coverUrls.length > 0 && (
        <div className={styles.coverLayer} aria-hidden="true">
          {coverUrls.map((url, i) => (
            // next/image は remotePatterns 設定が必要なため、BookCard 同様に img で表示する
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className={styles.coverImage} />
          ))}
        </div>
      )}
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.inner}>
        {isMe ? (
          <Link href="/profile" className={styles.identity}>
            <UserIdentity user={user} />
          </Link>
        ) : (
          <div className={styles.identity}>
            <UserIdentity user={user} />
          </div>
        )}
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

      <div className={styles.meta}>
        <h1 className={styles.nickname}>{user.nickname}</h1>
        <p className={styles.sub}>
          <span>@{user.username}</span>
          <span className={styles.dot}>・</span>
          <span>{user.books_count}冊</span>
        </p>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
      </div>
    </>
  );
}
