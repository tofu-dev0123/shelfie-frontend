"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { useBookDetailModal } from "@/hooks/books/useBookDetailModal";
import styles from "./styles/BookDetailModalSkeleton.module.css";

export function BookDetailModalSkeleton() {
  const { close } = useBookDetailModal();

  return (
    <Modal onClose={close}>
      <div className={styles.wrap} aria-busy="true" aria-live="polite">
        <div className={styles.info}>
          <Skeleton className={styles.thumb} radius="md" />
          <div className={styles.meta}>
            <Skeleton width="80%" height={24} />
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
    </Modal>
  );
}
