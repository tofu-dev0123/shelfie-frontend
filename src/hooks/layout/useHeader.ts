import { useState, useEffect, useRef } from "react";

/**
 * ヘッダーのドロップダウンメニュー開閉を制御するフック。
 * @returns ドロップダウンの開閉状態・ref・トグル関数
 */
export const useHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return { dropdownOpen, dropdownRef, toggleDropdown };
};
