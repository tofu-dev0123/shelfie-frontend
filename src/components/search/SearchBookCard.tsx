import Link from "next/link";
import type { Book } from "@/types/book";
import styles from "./styles/SearchBookCard.module.css";

type Props = {
  book: Book;
};

export function SearchBookCard({ book }: Props) {
  return (
    <Link
      href={`/books/${book.google_books_id}`}
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
      <div className={styles.info}>
        <p className={styles.title}>{book.title}</p>
        {book.authors.length > 0 && (
          <p className={styles.author}>{book.authors.join(", ")}</p>
        )}
      </div>
    </Link>
  );
}
