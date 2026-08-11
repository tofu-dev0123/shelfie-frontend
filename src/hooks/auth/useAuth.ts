import { useAuthStore } from "@/store/authStore";

/**
 * 認証状態を参照するフック。
 * バックエンド発行のアクセストークンをSource of Truthとする。
 * @returns isSignedIn - バックエンドで認証済みかどうか
 * @returns isInitializing - アプリ起動直後でリフレッシュ試行が未完了の状態
 */
export const useAuth = () => {
  const status = useAuthStore((s) => s.status);
  return {
    isSignedIn: status === "authenticated",
    isInitializing: status === "idle" || status === "initializing",
  };
};
