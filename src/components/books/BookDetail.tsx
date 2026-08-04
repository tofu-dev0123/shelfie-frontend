import type { BookPostDetail } from "@/types/book";
import { BookDetailBackButton } from "./BookDetailBackButton";
import { BookDetailInfo } from "./BookDetailInfo";
import { BookDetailAuthor } from "./BookDetailAuthor";
import { BookDetailTags } from "./BookDetailTags";
import { BookDetailBody } from "./BookDetailBody";
import styles from "./styles/BookDetail.module.css";

type Props = {
  post: BookPostDetail;
};

export function BookDetail({ post }: Props) {
  return (
    <div className={styles.page}>
      <BookDetailBackButton />
      <BookDetailInfo book={post.book} />
      <BookDetailAuthor
        author={post.user}
        createdAt={post.created_at}
        bookTitle={post.book.title}
        isbn={post.book.isbn}
      />
      <BookDetailTags tags={post.tags} />
      <BookDetailBody content={post.content} />
    </div>
  );
}
