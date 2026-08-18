import Link from "next/link";
import styles from "./styles/not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>投稿が見つかりません</h1>
      <p className={styles.description}>
        この投稿は存在しないか、削除された可能性があります。
      </p>
      <Link href="/" className={styles.link}>
        ホームに戻る
      </Link>
    </div>
  );
}
