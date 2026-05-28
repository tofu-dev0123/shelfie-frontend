import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./styles/ProfileSkeleton.module.css";

export function ProfileSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <Skeleton width={100} height={14} />

      <div className={styles.title}>
        <Skeleton width={200} height={24} />
      </div>

      <div className={styles.section}>
        <Skeleton width={80} height={13} />
        <Skeleton width={96} height={96} radius="full" />
      </div>

      <div className={styles.section}>
        <Skeleton width={80} height={13} />
        <Skeleton width="100%" height={44} radius="md" />
      </div>

      <div className={styles.section}>
        <Skeleton width={80} height={13} />
        <Skeleton width="100%" height={96} radius="md" />
      </div>

      <div className={styles.section}>
        <Skeleton width={80} height={13} />
        <Skeleton width="100%" height={44} radius="md" />
      </div>
    </div>
  );
}
