import { apiGet } from './client'
import { API_ENDPOINTS } from '@/constants/api'

/**
 * ユーザー名の重複チェックを行う。
 * @param username - チェックするユーザー名
 * @returns available: true = 使用可能, false = 使用不可（重複）
 */
export const checkUsername = (username: string): Promise<{ available: boolean }> =>
  apiGet(`${API_ENDPOINTS.USERNAME_CHECK}?value=${encodeURIComponent(username)}`)
