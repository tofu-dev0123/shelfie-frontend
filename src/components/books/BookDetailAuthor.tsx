import Link from "next/link";
import type { BookPostAuthor } from "@/types/book";
import { initialOf } from "@/lib/initial";
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
  return (
    <section className={styles.container}>
      <Link href={`/users/${author.username}`} className={styles.left}>
        <div className={styles.avatarPlaceholder} aria-hidden="true">
          {initialOf(author.nickname)}
        </div>
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
