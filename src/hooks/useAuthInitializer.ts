import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/lib/api/auth";

/**
 * アプリ起動時に Rails リフレッシュトークン（HttpOnly Cookie）を使い
 * アクセストークンの復元を試みるフック。
 * 1 回だけ発火し、成功時は authStore が "authenticated" に、
 * 失敗時は "unauthenticated" に遷移する。
 * 未ログインユーザーでは必ず 401 が 1 回発生するが、リロード時のみで
 * アプリ内遷移では発火しないため許容する。
 */
export const useAuthInitializer = () => {
  const status = useAuthStore((s) => s.status);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    if (status !== "idle") return;
    setStatus("initializing");
    (async () => {
      const ok = await refreshAccessToken();
      if (!ok) setStatus("unauthenticated");
    })();
  }, [status, setStatus]);
};
