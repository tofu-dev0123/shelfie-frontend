"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 本棚投稿詳細画面の3点リーダーメニューの開閉状態を管理するフック。
 * 外側クリックとEscapeキー押下でメニューを閉じる。
 * @returns open - メニューが開いているか
 * @returns wrapRef - 外側クリック判定用のラッパー要素ref
 * @returns toggle - メニューの開閉をトグルするハンドラー
 * @returns close - メニューを閉じるハンドラー
 */
export const useBookPostMenu = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return { open, wrapRef, toggle, close };
};
