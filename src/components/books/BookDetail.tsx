import type { BookPostDetail } from "@/types/book";
import { BookDetailBackButton } from "./BookDetailBackButton";
import { BookDetailInfo } from "./BookDetailInfo";
import { BookDetailAuthor } from "./BookDetailAuthor";
import { BookDetailTags } from "./BookDetailTags";
import { BookDetailBody } from "./BookDetailBody";
import { BookDetailPurchaseLinks } from "./BookDetailPurchaseLinks";
import { WantToReadButton } from "./WantToReadButton";
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
      <BookDetailPurchaseLinks links={post.purchase_links} />
      <WantToReadButton
        isbn={post.book.isbn}
        authorUsername={post.user.username}
        isInMyWantToRead={post.book.is_in_my_want_to_read}
      />
    </div>
  );
}
