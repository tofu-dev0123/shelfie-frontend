import Link from "next/link";
import type { Book } from "@/types/book";
import styles from "./styles/BookCard.module.css";

type Props = {
  book: Book;
  username: string;
};

export function BookCard({ book, username }: Props) {
  return (
    <Link
      href={`/users/${username}/books/${book.isbn}`}
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
      {book.authors.length > 0 && (
        <p className={styles.author}>{book.authors.join(", ")}</p>
      )}
    </Link>
  );
}
