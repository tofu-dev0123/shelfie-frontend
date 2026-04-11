import { apiGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { SearchBooksResponse, BookPostsResponse } from "@/types/book";

/**
 * ユーザーの本棚を取得する。
 * @param username - ユーザー名
 * @param status - 本のステータス（done: 読了 / want: 読みたい）
 * @param cursor - ページネーションカーソル（省略時は先頭から取得）
 * @returns 本棚レスポンス（items・pagination）
 * @throws 取得失敗時にエラー
 */
export const getUserBooks = (
  username: string,
  status: "done" | "want",
  cursor?: string | null,
): Promise<BookPostsResponse> => {
  const params = new URLSearchParams({ status });
  if (cursor) params.set("cursor", cursor);
  return apiGet<BookPostsResponse>(
    `${API_ENDPOINTS.USER_BOOKS(username)}?${params.toString()}`,
  );
};

/**
 * 書籍をキーワードで検索する。
 * @param q - 検索キーワード
 * @returns 検索結果レスポンス（items・pagination）
 * @throws 検索失敗時にエラー
 */
export const searchBooks = (q: string): Promise<SearchBooksResponse> =>
  apiGet<SearchBooksResponse>(
    `${API_ENDPOINTS.BOOKS_SEARCH}?q=${encodeURIComponent(q)}`,
  );
