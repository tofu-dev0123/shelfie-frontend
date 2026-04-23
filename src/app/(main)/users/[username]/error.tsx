"use client";

import styles from "./styles/error.module.css";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <div className={styles.container}>
      <p className={styles.code}>エラー</p>
      <h1 className={styles.title}>ページの読み込みに失敗しました</h1>
      <p className={styles.description}>
        しばらく経ってから再度お試しください。
      </p>
      <button onClick={reset} className={styles.button}>
        再試行
      </button>
    </div>
  );
}
