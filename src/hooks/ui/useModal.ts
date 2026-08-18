"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// ハイドレーション完了を検知するための useSyncExternalStore 用の定数。
// 購読先は無いので subscribe は何もしない
const subscribeNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * モーダルの副作用をまとめて管理するフック。
 * マウント中は背面のスクロールを止め、Escキーで閉じ、Tabのフォーカスをモーダル内に閉じ込める。
 * @param onClose - モーダルを閉じるハンドラー
 * @returns dialogRef - モーダル本体に渡す ref、isMounted - ポータルを描画してよいか、handleOverlayClick - オーバーレイのクリックハンドラー
 */
export const useModal = (onClose: () => void) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // createPortal は document を参照するため、クライアントでマウントされるまで描画しない
  const isMounted = useSyncExternalStore(
    subscribeNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  // 開いた時点のフォーカス位置を覚えておき、閉じたら元の要素へ戻す
  useEffect(() => {
    const trigger = document.activeElement;
    return () => {
      if (!(trigger instanceof HTMLElement)) return;
      trigger.focus();
    };
  }, []);

  // 背面のスクロールを止める。閉じたら元の値に戻す
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // 初期フォーカスをモーダル内へ移す。フォーカスできる要素が無ければモーダル自体に当てる
  useEffect(() => {
    if (!isMounted) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const first = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (first ?? dialog).focus();
  }, [isMounted]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (items.length === 0) return;

      // 端に到達したら反対の端へ送り、フォーカスがモーダルの外へ出ないようにする
      const first = items[0];
      const last = items[items.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // オーバーレイ自身がクリックされたときだけ閉じる。モーダル内のクリックでは閉じない
      if (event.target !== event.currentTarget) return;
      onClose();
    },
    [onClose],
  );

  return { dialogRef, isMounted, handleOverlayClick };
};
