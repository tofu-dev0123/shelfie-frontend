import { authGet, authPost, apiDelete } from "./client";
import { useAuthStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/constants/api";
import { logger } from "@/lib/logger";
import type { SignupFormData } from "@/schemas/auth";
import type { SignupContext } from "@/types/auth";

/**
 * サインアップ画面の初期表示に必要な情報を取得する。
 * 認証は signup_token（HttpOnly Cookie）で行うため引数は不要。
 * @returns OAuth プロバイダから取得したメールアドレスとニックネーム候補
 * @throws signup_token が無い、または期限切れの場合は401エラー
 */
export const getSignupContext = (): Promise<SignupContext> =>
  authGet(API_ENDPOINTS.AUTH_SIGNUP_CONTEXT);

/**
 * ユーザーを新規作成しログイン状態にする。
 * 認証は signup_token（HttpOnly Cookie）で行うためトークンは渡さない。
 * @param data - ユーザー名とニックネーム
 * @returns なし
 * @throws 入力が不正な場合は422、signup_tokenが無効な場合は401エラー
 */
export const signup = async (data: SignupFormData): Promise<void> => {
  const res = await authPost<{ access_token: string }>(
    API_ENDPOINTS.USERS,
    data,
  );
  useAuthStore.getState().setAccessToken(res.access_token);
  logger.info("サインアップ成功");
};

/**
 * ログアウトする。
 * Rails 側でリフレッシュトークンを失効させ、ストアのアクセストークンを破棄する。
 * @returns なし
 * @throws リクエストが失敗した場合はエラー
 */
export const logout = async (): Promise<void> => {
  await apiDelete(API_ENDPOINTS.AUTH_LOGOUT);
  useAuthStore.getState().clearAccessToken();
  logger.info("ログアウト");
};

/**
 * リフレッシュトークン（HttpOnly Cookie）を使いアクセストークンを取得する。
 * ページリロード時にZustandのトークンを復元するために使用する。
 * @returns 取得成功したか
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const res = await authPost<{ access_token: string }>(
      API_ENDPOINTS.AUTH_REFRESH,
    );
    useAuthStore.getState().setAccessToken(res.access_token);
    logger.info("アクセストークン復元成功");
    return true;
  } catch {
    logger.warn(
      "アクセストークン復元失敗（未ログインまたはセッション期限切れ）",
    );
    return false;
  }
};
