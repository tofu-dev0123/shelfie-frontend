import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import { logger } from "@/lib/logger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * リフレッシュトークン Cookie からログイン中ユーザーの username を解決する。
 * Server Components で / の SSR リダイレクト判定に使用する。
 * Zustand ストアを参照しない Server 専用実装。
 * @param refreshToken - ブラウザから送られてきた refresh_token Cookie の値
 * @returns 解決できれば username、失敗時は null
 */
export const resolveUsernameByRefreshToken = async (
  refreshToken: string,
): Promise<string | null> => {
  try {
    const refreshRes = await axios.post<{ access_token: string }>(
      `${BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`,
      {},
      { headers: { Cookie: `refresh_token=${refreshToken}` } },
    );
    const meRes = await axios.get<{ username: string }>(
      `${BASE_URL}${API_ENDPOINTS.ME}`,
      {
        headers: { Authorization: `Bearer ${refreshRes.data.access_token}` },
      },
    );
    return meRes.data.username;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.warn("SSRでのユーザー解決に失敗", {
        endpoint: error.config?.url,
        status: error.response?.status,
      });
    } else {
      logger.warn("SSRでのユーザー解決に失敗（非Axiosエラー）");
    }
    return null;
  }
};
