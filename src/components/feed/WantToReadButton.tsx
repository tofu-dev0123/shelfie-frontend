"use client";

import { useAddWantToRead } from "@/hooks/books/useAddWantToRead";
import styles from "./styles/FeedPostCard.module.css";

type Props = {
  isbn: string;
  isInMyWantToRead: boolean | null;
};

export function WantToReadButton({ isbn, isInMyWantToRead }: Props) {
  const { isPending, handleAdd } = useAddWantToRead(isbn);
  const isAlreadyAdded = isInMyWantToRead === true;
  return (
    <button
      type="button"
      className={styles.wantButton}
      onClick={handleAdd}
      disabled={isPending || isAlreadyAdded}
    >
      <i className="fa-regular fa-bookmark" aria-hidden="true" />
      {isAlreadyAdded ? "追加済み" : "読みたい"}
    </button>
  );
}
