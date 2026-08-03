import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/BookFormSkeleton.module.css";

export function BookFormSkeleton() {
  return (
    <div className={styles.formCard} aria-busy="true" aria-live="polite">
      <div className={styles.hero}>
        <Skeleton className={styles.heroCover} radius="md" />
        <div className={styles.meta}>
          <Skeleton width="80%" height={24} />
          <Skeleton width="50%" height={15} />
        </div>
      </div>

      <div className={styles.comment}>
        <div className={styles.commentHeader}>
          <Skeleton width={80} height={14} />
          <Skeleton width={100} height={12} />
        </div>
        <Skeleton width="100%" height={120} radius="md" />
      </div>
    </div>
  );
}
