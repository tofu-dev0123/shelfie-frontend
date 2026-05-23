import Link from "next/link";
import type { FeedItem } from "@/types/feed";
import { WantToReadButton } from "./WantToReadButton";
import styles from "./styles/FeedPostCard.module.css";

type Props = {
  item: FeedItem;
};

export function FeedPostCard({ item }: Props) {
  const postedAt = formatRelativeTime(item.created_at);
  return (
    <article className={styles.post}>
      <header className={styles.postHead}>
        <Link href={`/users/${item.user.username}`} className={styles.user}>
          <span className={styles.avatar} aria-hidden="true">
            {item.user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.user.avatar_url} alt="" />
            ) : (
              initialOf(item.user.nickname)
            )}
          </span>
          <span className={styles.userMeta}>
            <span className={styles.nickname}>{item.user.nickname}</span>
            <span className={styles.username}>@{item.user.username}</span>
          </span>
        </Link>
        <time className={styles.postedAt} dateTime={item.created_at}>
          {postedAt}
        </time>
      </header>

      <div className={styles.bookBlock}>
        <Link
          href={`/users/${item.user.username}/books/${item.book.isbn}`}
          className={styles.cover}
          aria-label={item.book.title}
        >
          {item.book.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.book.thumbnail_url}
              alt={item.book.title}
              className={styles.coverImage}
            />
          ) : null}
        </Link>
        <div className={styles.bookInfo}>
          <Link
            href={`/users/${item.user.username}/books/${item.book.isbn}`}
            className={styles.bookTitle}
          >
            {item.book.title}
          </Link>
          <p className={styles.bookAuthor}>{item.book.authors.join("、")}</p>
          {item.tags.length > 0 ? (
            <ul className={styles.tags}>
              {item.tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {item.content ? <p className={styles.comment}>{item.content}</p> : null}

      <footer className={styles.postFooter}>
        <WantToReadButton isbn={item.book.isbn} />
      </footer>
    </article>
  );
}

const initialOf = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.slice(0, 1).toUpperCase();
};

const formatRelativeTime = (iso: string): string => {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "";
  const diff = Date.now() - target;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "たった今";
  if (diff < hour) return `${Math.floor(diff / minute)}分前`;
  if (diff < day) return `${Math.floor(diff / hour)}時間前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}日前`;

  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  return `${y}/${m}/${dd}`;
};
