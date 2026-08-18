import type { Book } from "@/types/book";
import styles from "./styles/BookDetailInfo.module.css";

type Props = {
  book: Book;
  /** モーダルから使う際に aria-labelledby の参照先とするための id */
  titleId?: string;
};

export function BookDetailInfo({ book, titleId }: Props) {
  return (
    <section className={styles.container}>
      <div className={styles.thumbWrap}>
        {book.thumbnail_url ? (
          // next/image は remotePatterns 設定が必要なため、BookCard 同様に img で表示する
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.thumbnail_url}
            alt={book.title}
            className={styles.thumb}
          />
        ) : (
          <div className={styles.placeholder} aria-label="書影なし" />
        )}
      </div>
      <div className={styles.meta}>
        <h1 id={titleId} className={styles.title}>
          {book.title}
        </h1>
        <p className={styles.authors}>{book.authors.join(" ")}</p>
        <p className={styles.isbn}>ISBN: {book.isbn}</p>
      </div>
    </section>
  );
}
