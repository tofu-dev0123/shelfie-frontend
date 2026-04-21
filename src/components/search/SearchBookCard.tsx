"use client";

import Link from "next/link";
import type { Book } from "@/types/book";
import { useAddWantToRead } from "@/hooks/books/useAddWantToRead";
import styles from "./styles/SearchBookCard.module.css";

type Props = {
  book: Book;
};

export function SearchBookCard({ book }: Props) {
  const { isPending, handleAdd } = useAddWantToRead(book.isbn);

  return (
    <div className={styles.card}>
      <Link href={`/books/${book.isbn}`} className={styles.cardLink}>
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
        <div className={styles.body}>
          <p className={styles.title}>{book.title}</p>
          {book.authors.length > 0 && (
            <p className={styles.author}>{book.authors.join(", ")}</p>
          )}
        </div>
      </Link>
      <div className={styles.footer}>
        <button type="button" className={styles.addButton}>
          + 本棚に追加
        </button>
        <button
          type="button"
          className={styles.wantButton}
          onClick={handleAdd}
          disabled={isPending}
        >
          + 読みたい
        </button>
      </div>
    </div>
  );
}
