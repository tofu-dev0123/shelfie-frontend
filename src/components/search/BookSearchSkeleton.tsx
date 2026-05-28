import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/BookSearchSkeleton.module.css";

type Props = {
  count?: number;
};

export function BookSearchSkeleton({ count = 10 }: Props) {
  return (
    <div className={styles.grid} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton className={styles.cover} />
          <div className={styles.body}>
            <Skeleton width="90%" height={13} />
            <Skeleton width="60%" height={11} />
          </div>
          <div className={styles.footer}>
            <Skeleton className={styles.button} radius="md" />
            <Skeleton className={styles.button} radius="md" />
          </div>
        </div>
      ))}
    </div>
  );
}
