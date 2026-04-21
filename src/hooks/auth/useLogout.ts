import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { logout } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * ログアウト処理を提供するフック。
 * Rails のログアウト、Clerk セッション削除、ホーム画面への遷移を一括で行う。
 * Clerk 依存を認証処理以外の箇所に広げないため、signOut 呼び出しはこのフックに閉じ込める。
 * @returns ログアウトを実行する関数
 */
export const useLogout = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  return useCallback(async () => {
    try {
      await logout();
      await signOut();
      router.push("/");
    } catch {
      logger.error("ログアウト失敗");
      toast.error(MESSAGES.AUTH.LOGOUT_ERROR);
    }
  }, [signOut, router]);
};
