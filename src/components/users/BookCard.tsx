import Link from "next/link";
import type { Book } from "@/types/book";
import styles from "./styles/BookCard.module.css";

type Props = {
  book: Book;
  username: string;
};

export function BookCard({ book, username }: Props) {
  const href = `/users/${username}/books/${book.isbn}`;

  return (
    // title 属性でPCのホバー時にタイトルが出る。棚にはタイトルを表示しないため補助として置く
    <Link href={href} className={styles.spine} title={book.title}>
      {book.thumbnail_url ? (
        // next/image は remotePatterns 設定が必要なため、img で表示する
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.thumbnail_url}
          alt={book.title}
          className={styles.cover}
        />
      ) : (
        // 書影が無い本は表紙で判別できないため、背表紙風にタイトルを出す
        <span className={styles.fallback}>{book.title}</span>
      )}
    </Link>
  );
}
