import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/constants/api";
import { logger } from "@/lib/logger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ----------------------------------------------------------------
// クライアントサイド用 axios インスタンス
// ----------------------------------------------------------------
const _client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// リクエストインターセプター: アクセストークンを自動付与
_client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  logger.info("APIリクエスト送信", { endpoint: config.url });
  return config;
});

// レスポンスインターセプター: 401時にサイレントリフレッシュ
_client.interceptors.response.use(
  (response) => {
    logger.info("APIレスポンス受信", {
      endpoint: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      logger.error("APIリクエスト失敗", {
        endpoint: error.config?.url,
        status: error.response?.status,
      });
      return Promise.reject(error);
    }

    original._retry = true;
    logger.warn("アクセストークン期限切れ。リフレッシュを試みます", {
      endpoint: original.url,
    });

    const refreshed = await tryRefresh();
    if (!refreshed) {
      logger.error("トークンリフレッシュ失敗。ログイン画面へリダイレクト");
      useAuthStore.getState().clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
    return _client(original);
  },
);

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`,
      {},
      { withCredentials: true },
    );
    useAuthStore.getState().setAccessToken(res.data.access_token);
    return true;
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------
// クライアントサイド用メソッドハンドラ
// ----------------------------------------------------------------
export const apiGet = async <T>(path: string): Promise<T> => {
  const r = await _client.get<T>(path);
  return r.data;
};

export const apiPost = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _client.post<T>(path, data);
  return r.data;
};

/**
 * multipart/form-data でPOSTする。
 * インスタンスのデフォルト Content-Type (application/json) を上書きし、
 * FormData が JSON にシリアライズされて空オブジェクトになる挙動を回避する。
 * @param path - エンドポイントパス
 * @param formData - 送信する FormData
 */
export const apiPostMultipart = async <T>(
  path: string,
  formData: FormData,
): Promise<T> => {
  const r = await _client.post<T>(path, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data;
};

export const apiPut = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _client.put<T>(path, data);
  return r.data;
};

export const apiPatch = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _client.patch<T>(path, data);
  return r.data;
};

export const apiDelete = async <T>(path: string): Promise<T> => {
  const r = await _client.delete<T>(path);
  return r.data;
};

// ----------------------------------------------------------------
// サーバーサイド用メソッドハンドラ（Server Components から使用）
// ----------------------------------------------------------------
const serverHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const serverGet = async <T>(path: string, token: string): Promise<T> => {
  const r = await axios.get<T>(`${BASE_URL}${path}`, {
    headers: serverHeaders(token),
    withCredentials: true,
  });
  return r.data;
};

export const serverPost = async <T>(
  path: string,
  token: string,
  data?: unknown,
): Promise<T> => {
  const r = await axios.post<T>(`${BASE_URL}${path}`, data, {
    headers: serverHeaders(token),
    withCredentials: true,
  });
  return r.data;
};

export const serverPatch = async <T>(
  path: string,
  token: string,
  data?: unknown,
): Promise<T> => {
  const r = await axios.patch<T>(`${BASE_URL}${path}`, data, {
    headers: serverHeaders(token),
    withCredentials: true,
  });
  return r.data;
};

export const serverDelete = async <T>(
  path: string,
  token: string,
): Promise<T> => {
  const r = await axios.delete<T>(`${BASE_URL}${path}`, {
    headers: serverHeaders(token),
    withCredentials: true,
  });
  return r.data;
};
