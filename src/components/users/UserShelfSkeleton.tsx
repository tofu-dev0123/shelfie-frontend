import { BookShelfSkeleton } from "./BookShelfSkeleton";
import styles from "./styles/UserShelfSkeleton.module.css";

export function UserShelfSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/*
        ヒーローは暗い背景なので、グレーのShimmerを載せると浮いてしまう。
        Skeletonプリミティブではなく半透明のブロックで骨格を示す
      */}
      <div className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.avatar} />
          <div className={styles.meta}>
            <div className={styles.nickname} />
            <div className={styles.sub} />
            <div className={styles.bio} />
          </div>
        </div>
      </div>

      <div className={styles.shelfSection}>
        <div className={styles.container}>
          <BookShelfSkeleton />
        </div>
      </div>
    </div>
  );
}
