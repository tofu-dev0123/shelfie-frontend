import useSWR from "swr";
import { getMe } from "@/lib/api/me";
import { API_ENDPOINTS } from "@/constants/api";

/**
 * ログイン中のユーザー情報を取得するSWRフック。
 * @param enabled - falseの場合はフェッチしない（未ログイン時）
 * @returns SWRのレスポンス（data, error, isLoading）
 */
export const useMe = (enabled: boolean) => {
  return useSWR(enabled ? API_ENDPOINTS.ME : null, getMe);
};
