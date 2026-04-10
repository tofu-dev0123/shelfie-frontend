import Link from "next/link";
import type { UserBook } from "@/types/book";
import styles from "./styles/BookCard.module.css";

type Props = {
  book: UserBook;
  username: string;
};

export function BookCard({ book, username }: Props) {
  return (
    <Link
      href={`/users/${username}/books/${book.google_books_id}`}
      className={styles.card}
    >
      <div className={styles.cover}>
        {book.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.thumbnail_url}
            alt={book.title}
            className={styles.coverImage}
          />
        ) : null}
      </div>
      <p className={styles.title}>{book.title}</p>
      <p className={styles.author}>{book.author}</p>
    </Link>
  );
}
