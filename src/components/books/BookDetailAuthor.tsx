import Link from "next/link";
import type { BookPostAuthor } from "@/types/book";
import { BookPostMenu } from "./BookPostMenu";
import styles from "./styles/BookDetailAuthor.module.css";

type Props = {
  author: BookPostAuthor;
  createdAt: string;
  bookTitle: string;
  isbn: string;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function BookDetailAuthor({
  author,
  createdAt,
  bookTitle,
  isbn,
}: Props) {
  const initial = author.nickname.charAt(0) || "?";
  return (
    <section className={styles.container}>
      <Link href={`/users/${author.username}`} className={styles.left}>
        {author.avatar_url ? (
          // next/image は remotePatterns 設定が必要なため、BookCard 同様に img で表示する
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatar_url}
            alt={author.nickname}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder} aria-hidden="true">
            {initial}
          </div>
        )}
        <div className={styles.names}>
          <span className={styles.nickname}>{author.nickname}</span>
          <span className={styles.sub}>
            <span>@{author.username}</span>
            <span className={styles.dot}>・</span>
            <span>{formatDate(createdAt)}</span>
          </span>
        </div>
      </Link>
      <BookPostMenu
        authorUsername={author.username}
        bookTitle={bookTitle}
        isbn={isbn}
      />
    </section>
  );
}
