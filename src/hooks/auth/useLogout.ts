import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * ログアウト処理を提供するフック。
 * Rails のログアウトとホーム画面への遷移を行う。
 * @returns ログアウトを実行する関数
 */
export const useLogout = () => {
  const router = useRouter();

  return useCallback(async () => {
    try {
      await logout();
      router.push("/");
    } catch {
      logger.error("ログアウト失敗");
      toast.error(MESSAGES.AUTH.LOGOUT_ERROR);
    }
  }, [router]);
};
