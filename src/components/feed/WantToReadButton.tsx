"use client";

import { useAddWantToRead } from "@/hooks/books/useAddWantToRead";
import styles from "./styles/FeedPostCard.module.css";

type Props = {
  isbn: string;
};

export function WantToReadButton({ isbn }: Props) {
  const { isPending, handleAdd } = useAddWantToRead(isbn);
  return (
    <button
      type="button"
      className={styles.wantButton}
      onClick={handleAdd}
      disabled={isPending}
    >
      <i className="fa-regular fa-bookmark" aria-hidden="true" />
      読みたい
    </button>
  );
}
