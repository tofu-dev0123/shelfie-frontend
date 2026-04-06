import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { logout } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

export const useHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useClerk();

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

  return { dropdownOpen, dropdownRef, toggleDropdown, handleLogout };
};
