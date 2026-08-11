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
// 認証系用 axios インスタンス
// signup_token / refresh_token Cookie で認証するエンドポイント専用。
// これらはアクセストークンを持たないため、401 が返っても「アクセストークンの
// 期限切れ」を意味しない。_client のインターセプターに乗せると無意味な
// リフレッシュが走った上でログイン画面へ強制遷移してしまうので、経路を分ける
// ----------------------------------------------------------------
const _authClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

_authClient.interceptors.request.use((config) => {
  logger.info("認証APIリクエスト送信", { endpoint: config.url });
  return config;
});

_authClient.interceptors.response.use(
  (response) => {
    logger.info("認証APIレスポンス受信", {
      endpoint: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    logger.warn("認証APIリクエスト失敗", {
      endpoint: error.config?.url,
      status: error.response?.status,
    });
    return Promise.reject(error);
  },
);

export const authGet = async <T>(path: string): Promise<T> => {
  const r = await _authClient.get<T>(path);
  return r.data;
};

export const authPost = async <T>(path: string, data?: unknown): Promise<T> => {
  const r = await _authClient.post<T>(path, data);
  return r.data;
};
