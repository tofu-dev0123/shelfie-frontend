import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { API_ENDPOINTS } from '@/constants/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ----------------------------------------------------------------
// クライアントサイド用 axios インスタンス
// ----------------------------------------------------------------
const _client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// リクエストインターセプター: アクセストークンを自動付与
_client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// レスポンスインターセプター: 401時にサイレントリフレッシュ
_client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshed = await tryRefresh()
      if (!refreshed) {
        useAuthStore.getState().clearAccessToken()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      original.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`
      return _client(original)
    }
    return Promise.reject(error)
  }
)

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`,
      {},
      { withCredentials: true }
    )
    useAuthStore.getState().setAccessToken(res.data.access_token)
    return true
  } catch {
    return false
  }
}

// ----------------------------------------------------------------
// クライアントサイド用メソッドハンドラ
// ----------------------------------------------------------------
export const apiGet = <T>(path: string): Promise<T> =>
  _client.get<T>(path).then((r) => r.data)

export const apiPost = <T>(path: string, data?: unknown): Promise<T> =>
  _client.post<T>(path, data).then((r) => r.data)

export const apiPatch = <T>(path: string, data?: unknown): Promise<T> =>
  _client.patch<T>(path, data).then((r) => r.data)

export const apiDelete = <T>(path: string): Promise<T> =>
  _client.delete<T>(path).then((r) => r.data)

// ----------------------------------------------------------------
// サーバーサイド用メソッドハンドラ（Server Components から使用）
// ----------------------------------------------------------------
const serverHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const serverGet = <T>(path: string, token: string): Promise<T> =>
  axios
    .get<T>(`${BASE_URL}${path}`, { headers: serverHeaders(token), withCredentials: true })
    .then((r) => r.data)

export const serverPost = <T>(path: string, token: string, data?: unknown): Promise<T> =>
  axios
    .post<T>(`${BASE_URL}${path}`, data, { headers: serverHeaders(token), withCredentials: true })
    .then((r) => r.data)

export const serverPatch = <T>(path: string, token: string, data?: unknown): Promise<T> =>
  axios
    .patch<T>(`${BASE_URL}${path}`, data, { headers: serverHeaders(token), withCredentials: true })
    .then((r) => r.data)

export const serverDelete = <T>(path: string, token: string): Promise<T> =>
  axios
    .delete<T>(`${BASE_URL}${path}`, { headers: serverHeaders(token), withCredentials: true })
    .then((r) => r.data)
