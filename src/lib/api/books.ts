import { apiGet, apiPost, apiPut } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  Book,
  SearchBooksResponse,
  BookPostsResponse,
  BookPostDetail,
  CreateBookInput,
  UpdateBookInput,
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
 * 書籍を ISBN 指定で1冊取得する。Bearer 認証必須。
 * @param isbn - ISBN-13（13桁の数字）
 * @returns 書籍情報（isbn・title・authors・thumbnail_url）
 * @throws 楽天 Books API に書籍が存在しない場合は404エラー
 */
export const getBook = (isbn: string): Promise<Book> =>
  apiGet<Book>(API_ENDPOINTS.BOOK(isbn));

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
 * 本棚に書籍を投稿する。
 * @param data - 投稿データ（isbn・content）
 * @throws 投稿失敗時にエラー
 */
export const createBook = (data: CreateBookInput): Promise<void> =>
  apiPost<void>(API_ENDPOINTS.ME_BOOKS, data);

/**
 * 本棚投稿を更新する。
 * @param isbn - 更新対象投稿のISBN-13
 * @param data - 更新データ（content）
 * @throws 更新失敗時にエラー
 */
export const updateBook = (
  isbn: string,
  data: UpdateBookInput,
): Promise<void> => apiPut<void>(API_ENDPOINTS.ME_BOOK(isbn), data);

/**
 * 本棚投稿詳細を取得する。認証不要。
 * @param username - 投稿したユーザーの username
 * @param isbn - 書籍のISBN-13
 * @returns 投稿詳細（書籍・投稿者・本文・タグ）
 * @throws 投稿が存在しない場合は404エラー
 */
export const getBookPostDetail = (
  username: string,
  isbn: string,
): Promise<BookPostDetail> =>
  apiGet<BookPostDetail>(API_ENDPOINTS.USER_BOOK(username, isbn));
