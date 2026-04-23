import axios from "axios";
import { serverPost, apiDelete } from "./client";
import { useAuthStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/constants/api";
import { logger } from "@/lib/logger";
import type { SignupFormData } from "@/schemas/auth";

export const login = async (
  clerkToken: string,
): Promise<"ok" | "not_found"> => {
  try {
    const data = await serverPost<{ access_token: string }>(
      API_ENDPOINTS.AUTH_LOGIN,
      clerkToken,
    );
    useAuthStore.getState().setAccessToken(data.access_token);
    logger.info("ログイン成功");
    return "ok";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      logger.info("Railsにユーザーが存在しない。サインアップへリダイレクト");
      return "not_found";
    }
    logger.error("ログイン失敗");
    throw error;
  }
};

export const signup = async (
  clerkToken: string,
  data: SignupFormData,
): Promise<void> => {
  const res = await serverPost<{ access_token: string }>(
    API_ENDPOINTS.USERS,
    clerkToken,
    data,
  );
  useAuthStore.getState().setAccessToken(res.access_token);
  logger.info("サインアップ成功");
};

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
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH_REFRESH}`,
      {},
      { withCredentials: true },
    );
    useAuthStore.getState().setAccessToken(res.data.access_token);
    logger.info("アクセストークン復元成功");
    return true;
  } catch {
    logger.warn(
      "アクセストークン復元失敗（未ログインまたはセッション期限切れ）",
    );
    return false;
  }
};
