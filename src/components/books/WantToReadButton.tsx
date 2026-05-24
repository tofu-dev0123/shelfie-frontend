"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/useMe";
import { useWantToReadAction } from "@/hooks/books/useWantToReadAction";
import styles from "./styles/WantToReadButton.module.css";

type Props = {
  isbn: string;
  authorUsername: string;
  isInMyWantToRead: boolean | null;
};

export function WantToReadButton({
  isbn,
  authorUsername,
  isInMyWantToRead,
}: Props) {
  const { isSignedIn, isInitializing } = useAuth();
  const { data: me } = useMe(isSignedIn);
  const { isPending, handleClick } = useWantToReadAction(isbn);

  // 認証状態の復元が済むまでボタン自体を出さない（出し入れのちらつき防止）
  if (isInitializing) return null;
  if (isSignedIn && me?.username === authorUsername) return null;

  const isAlreadyAdded = isInMyWantToRead === true;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.btn}
        onClick={handleClick}
        disabled={isPending || isAlreadyAdded}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        {isAlreadyAdded ? "読みたいリストに追加済み" : "読みたいリストに追加"}
      </button>
    </div>
  );
}
