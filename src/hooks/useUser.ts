import useSWR from "swr";
import { getUser } from "@/lib/api/users";
import { API_ENDPOINTS } from "@/constants/api";
import type { User } from "@/types/user";

/**
 * ユーザーの公開情報を取得するSWRフック。
 * Server ComponentからfallbackDataを渡すと初回リクエストをスキップできる。
 * @param username - ユーザー名
 * @param fallbackData - Server Componentで取得済みのユーザーデータ（オプション）
 * @returns SWRのレスポンス（data, error, isLoading）
 */
export const useUser = (username: string, fallbackData?: User) =>
  useSWR(API_ENDPOINTS.USER(username), () => getUser(username), {
    fallbackData,
  });
