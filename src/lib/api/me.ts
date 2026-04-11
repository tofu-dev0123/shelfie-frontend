import { apiGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { Me } from "@/types/user";

/**
 * 自分のプロフィールを取得する。
 * @returns 自分のユーザー情報
 * @throws アクセストークンがない場合は401エラー
 */
export const getMe = (): Promise<Me> => apiGet(API_ENDPOINTS.ME);
