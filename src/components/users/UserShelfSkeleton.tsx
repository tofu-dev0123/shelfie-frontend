import { Skeleton } from "@/components/ui/Skeleton";
import { BookShelfSkeleton } from "./BookShelfSkeleton";
import styles from "./styles/UserShelfSkeleton.module.css";

export function UserShelfSkeleton() {
  return (
    <>
      <div className={styles.headerSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Skeleton
              width={56}
              height={56}
              radius="full"
              className={styles.avatar}
            />
            <div className={styles.nameRow}>
              <Skeleton width={180} height={18} />
              <Skeleton width={120} height={13} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.shelfSection}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            <Skeleton width={64} height={16} />
          </div>
          <BookShelfSkeleton />
        </div>
      </div>
    </>
  );
}
