import styles from "./styles/BookDetailSkeleton.module.css";

export function BookDetailSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <div className={styles.backPlaceholder} aria-hidden="true" />
      <div className={styles.info}>
        <div className={styles.thumb} />
        <div className={styles.meta}>
          <div className={styles.lineLg} />
          <div className={styles.lineSm} />
          <div className={styles.lineXs} />
        </div>
      </div>
      <div className={styles.author}>
        <div className={styles.avatar} />
        <div className={styles.authorMeta}>
          <div className={styles.lineSm} />
          <div className={styles.lineXs} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.lineFull} />
        <div className={styles.lineFull} />
        <div className={styles.lineHalf} />
      </div>
    </div>
  );
}
