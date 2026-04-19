import { apiGet, apiPost } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  SearchBooksResponse,
  BookPostsResponse,
  TagsResponse,
  CreateBookInput,
} from "@/types/book";

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
 * @param cursor - ページネーションカーソル（省略時は先頭から取得）
 * @returns 検索結果レスポンス（items・pagination）
 * @throws 検索失敗時にエラー
 */
export const searchBooks = (
  q: string,
  cursor?: string | null,
): Promise<SearchBooksResponse> => {
  const params = new URLSearchParams({ q });
  if (cursor) params.set("cursor", cursor);
  return apiGet<SearchBooksResponse>(
    `${API_ENDPOINTS.BOOKS_SEARCH}?${params.toString()}`,
  );
};

/**
 * タグをサジェスト用に検索する。
 * q は必須（最大50文字）。バックエンドは最大10件返す。
 * @param q - 検索クエリ（URLエンコードせずに渡す）
 * @returns マッチしたタグのレスポンス
 * @throws 取得失敗時にエラー
 */
export const getTags = (q: string): Promise<TagsResponse> => {
  const params = new URLSearchParams({ q });
  return apiGet<TagsResponse>(`${API_ENDPOINTS.TAGS}?${params.toString()}`);
};

/**
 * 本棚に書籍を投稿する。
 * @param data - 投稿データ（isbn・content・tags）
 * @throws 投稿失敗時にエラー
 */
export const createBook = (data: CreateBookInput): Promise<void> =>
  apiPost<void>(API_ENDPOINTS.ME_BOOKS, data);
