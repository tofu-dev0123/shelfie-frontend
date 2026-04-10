import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { logout } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * ボトムナビゲーションのアカウントメニュー制御とログアウト処理を提供するフック。
 * @returns アカウントメニューの開閉状態・ref・トグル関数・ログアウトハンドラ
 */
export const useBottomNav = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useClerk();

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

  const handleLogout = async () => {
    try {
      await logout();
      await signOut();
      router.push("/login");
    } catch {
      logger.error("ログアウト失敗");
      toast.error(MESSAGES.AUTH.LOGOUT_ERROR);
    }
  };

  return { accountMenuOpen, accountMenuRef, toggleAccountMenu, handleLogout };
};
