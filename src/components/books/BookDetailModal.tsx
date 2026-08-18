"use client";

import { Modal } from "@/components/ui/Modal";
import { useBookDetailModal } from "@/hooks/books/useBookDetailModal";
import type { BookPostDetail } from "@/types/book";
import { BookDetailInfo } from "./BookDetailInfo";
import { BookDetailBody } from "./BookDetailBody";
import { BookPostMenu } from "./BookPostMenu";
import styles from "./styles/BookDetailModal.module.css";

const TITLE_ID = "book-detail-modal-title";

type Props = {
  post: BookPostDetail;
};

export function BookDetailModal({ post }: Props) {
  const { close } = useBookDetailModal();

  return (
    <Modal onClose={close} labelledBy={TITLE_ID}>
      {/* 投稿者情報は本棚のヒーローに出ているため、モーダルでは操作系のみを置く */}
      <div className={styles.actions}>
        <BookPostMenu
          authorUsername={post.user.username}
          bookTitle={post.book.title}
          isbn={post.book.isbn}
        />
        <button
          type="button"
          onClick={close}
          className={styles.closeButton}
          aria-label="閉じる"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <div className={styles.body}>
        <BookDetailInfo book={post.book} titleId={TITLE_ID} />
        <BookDetailBody content={post.content} />
      </div>
    </Modal>
  );
}
