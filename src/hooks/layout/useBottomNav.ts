import { useState, useEffect, useRef } from "react";

/**
 * ボトムナビゲーションのアカウントメニュー開閉を制御するフック。
 * @returns アカウントメニューの開閉状態・ref・トグル関数
 */
export const useBottomNav = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  const toggleAccountMenu = () => setAccountMenuOpen((prev) => !prev);

  return { accountMenuOpen, accountMenuRef, toggleAccountMenu };
};
