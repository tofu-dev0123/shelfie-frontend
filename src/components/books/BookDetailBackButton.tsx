"use client";

import { useRouter } from "next/navigation";
import styles from "./styles/BookDetailBackButton.module.css";

export function BookDetailBackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={styles.backButton}
      aria-label="戻る"
    >
      <i className="fa-solid fa-chevron-left" />
    </button>
  );
}
