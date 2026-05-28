import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/BookShelfSkeleton.module.css";

type Props = {
  count?: number;
};

export function BookShelfSkeleton({ count = 12 }: Props) {
  return (
    <div className={styles.grid} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton className={styles.cover} radius="md" />
          <Skeleton width="80%" height={13} />
        </div>
      ))}
    </div>
  );
}
