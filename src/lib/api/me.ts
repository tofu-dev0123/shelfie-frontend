import { apiGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { User } from "@/types/user";

/**
 * 自分のプロフィールを取得する。
 * @returns 自分のユーザー情報
 * @throws アクセストークンがない場合は401エラー
 */
export const getMe = (): Promise<User> => apiGet(API_ENDPOINTS.ME);
