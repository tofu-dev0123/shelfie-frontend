import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/BookDetailSkeleton.module.css";

export function BookDetailSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <Skeleton
        width={40}
        height={40}
        radius="full"
        className={styles.backPlaceholder}
      />
      <div className={styles.info}>
        <Skeleton className={styles.thumb} radius="md" />
        <div className={styles.meta}>
          <Skeleton width="80%" height={24} />
          <Skeleton width="40%" height={14} />
          <Skeleton width="30%" height={12} />
        </div>
      </div>
      <div className={styles.author}>
        <Skeleton
          width={44}
          height={44}
          radius="full"
          className={styles.avatar}
        />
        <div className={styles.authorMeta}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="30%" height={12} />
        </div>
      </div>
      <div className={styles.body}>
        <Skeleton width="100%" height={14} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="60%" height={14} />
      </div>
    </div>
  );
}
