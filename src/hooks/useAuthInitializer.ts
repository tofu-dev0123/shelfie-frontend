import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/lib/api/auth";

/**
 * ページリロード時にZustandのアクセストークンを復元するフック。
 * Clerkセッションが有効でRailsトークンが未設定の場合、
 * リフレッシュトークン（HttpOnly Cookie）を使ってトークンを取得する。
 * これにより、APIコールがトークン取得前に発火するのを防ぐ。
 */
export const useAuthInitializer = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || accessToken) return;
    refreshAccessToken();
  }, [isLoaded, isSignedIn, accessToken]);
};
