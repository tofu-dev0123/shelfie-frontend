import Link from "next/link";
import type { SearchBook } from "@/types/book";
import styles from "./styles/SearchBookCard.module.css";

type Props = {
  book: SearchBook;
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
        <p className={styles.author}>{book.author}</p>
        {book.published_year && (
          <p className={styles.year}>{book.published_year}年</p>
        )}
      </div>
    </Link>
  );
}
