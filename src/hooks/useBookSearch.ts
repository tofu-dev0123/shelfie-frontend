import useSWR from "swr";
import { toast } from "sonner";
import { searchBooks } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * 書籍検索SWRフック。
 * キーワードが空または未認証の場合はフェッチしない。
 * @param q - 検索キーワード（空文字の場合はフェッチしない）
 * @param isAuthenticated - Railsトークンが存在するか（falseの場合はフェッチしない）
 * @returns SWRのレスポンス（data, error, isLoading）
 */
export const useBookSearch = (q: string, isAuthenticated: boolean) => {
  return useSWR(
    q && isAuthenticated
      ? `${API_ENDPOINTS.BOOKS_SEARCH}?q=${encodeURIComponent(q)}`
      : null,
    () => searchBooks(q),
    {
      onError: () => {
        logger.error("書籍検索失敗", { endpoint: API_ENDPOINTS.BOOKS_SEARCH });
        toast.error(MESSAGES.BOOK.SEARCH_ERROR);
      },
      shouldRetryOnError: false,
    },
  );
};
