import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/BookShelfSkeleton.module.css";

type Props = {
  count?: number;
};

export function BookShelfSkeleton({ count = 12 }: Props) {
  return (
    <div className={styles.shelf} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} radius="sm" className={styles.spine} />
      ))}
    </div>
  );
}
