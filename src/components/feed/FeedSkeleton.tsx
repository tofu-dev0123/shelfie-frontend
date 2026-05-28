import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/FeedSkeleton.module.css";

type Props = {
  count?: number;
};

export function FeedSkeleton({ count = 3 }: Props) {
  return (
    <ul className={styles.list} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className={styles.item}>
          <div className={styles.head}>
            <Skeleton width={40} height={40} radius="full" />
            <div className={styles.userMeta}>
              <Skeleton width="40%" height={12} />
              <Skeleton width="25%" height={10} />
            </div>
            <Skeleton width={48} height={10} className={styles.postedAt} />
          </div>

          <div className={styles.bookBlock}>
            <Skeleton className={styles.cover} radius="sm" />
            <div className={styles.bookInfo}>
              <Skeleton width="80%" height={15} />
              <Skeleton width="50%" height={12} />
            </div>
          </div>

          <div className={styles.comment}>
            <Skeleton width="100%" height={12} />
            <Skeleton width="92%" height={12} />
            <Skeleton width="60%" height={12} />
          </div>
        </li>
      ))}
    </ul>
  );
}
