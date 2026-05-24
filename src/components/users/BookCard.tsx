import Link from "next/link";
import type { Book } from "@/types/book";
import styles from "./styles/BookCard.module.css";

type LinkTo = "detail" | "postNew";

type Props = {
  book: Book;
  username: string;
  linkTo?: LinkTo;
};

export function BookCard({ book, username, linkTo = "detail" }: Props) {
  const href =
    linkTo === "postNew"
      ? `/books/new?isbn=${book.isbn}`
      : `/users/${username}/books/${book.isbn}`;

  return (
    <Link href={href} className={styles.card}>
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
    </Link>
  );
}
