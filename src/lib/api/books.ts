import { apiGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { UserBooksResponse } from "@/types/book";

/**
 * ユーザーの本棚を取得する。
 * @param username - ユーザー名
 * @param status - 本のステータス（done: 読了 / want: 読みたい）
 * @param page - ページ番号（1始まり）
 * @returns 本棚レスポンス（books・has_next・page）
 * @throws 取得失敗時にエラー
 */
export const getUserBooks = (
  username: string,
  status: "done" | "want",
  page: number,
): Promise<UserBooksResponse> =>
  apiGet<UserBooksResponse>(
    `${API_ENDPOINTS.USER_BOOKS(username)}?status=${status}&page=${page}`,
  );
