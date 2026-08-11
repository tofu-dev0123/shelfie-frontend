"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useModal } from "@/hooks/ui/useModal";
import styles from "./styles/Modal.module.css";

type Props = {
  onClose: () => void;
  /** モーダルの見出しとなる要素の id。読み上げ時のタイトルになる */
  labelledBy?: string;
  children: ReactNode;
};

export function Modal({ onClose, labelledBy, children }: Props) {
  const { dialogRef, isMounted, handleOverlayClick } = useModal(onClose);

  if (!isMounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
