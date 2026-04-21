import { apiGet, apiPost } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  SearchBooksResponse,
  BookPostsResponse,
  WantToReadsResponse,
  TagsResponse,
  CreateBookInput,
} from "@/types/book";

/**
 * ユーザーの本棚（読了した本の投稿一覧）を取得する。
 * @param username - ユーザー名
 * @param cursor - ページネーションカーソル（省略時は先頭から取得）
 * @returns 本棚レスポンス（items・pagination）
 * @throws 取得失敗時にエラー
 */
export const getUserBooks = (
  username: string,
  cursor?: string | null,
): Promise<BookPostsResponse> => {
  const path = API_ENDPOINTS.USER_BOOKS(username);
  return apiGet<BookPostsResponse>(cursor ? `${path}?cursor=${cursor}` : path);
};

/**
 * 自分の読みたいリストを取得する。Bearer 認証必須。
 * @param cursor - ページネーションカーソル（省略時は先頭から取得）
 * @returns 読みたいリストレスポンス（items・pagination）
 * @throws 取得失敗時にエラー
 */
export const getMyWantToReads = (
  cursor?: string | null,
): Promise<WantToReadsResponse> => {
  const path = API_ENDPOINTS.ME_WANT_TO_READS;
  return apiGet<WantToReadsResponse>(
    cursor ? `${path}?cursor=${cursor}` : path,
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

/**
 * 読みたいリストに書籍を追加する。Bearer 認証必須。
 * @param isbn - ISBN-13（13桁の数字）
 * @throws 追加失敗時にエラー（401はclient.tsで自動処理、404は楽天APIに書籍が存在しない場合）
 */
export const addWantToRead = (isbn: string): Promise<void> =>
  apiPost<void>(API_ENDPOINTS.ME_WANT_TO_READ(isbn));
