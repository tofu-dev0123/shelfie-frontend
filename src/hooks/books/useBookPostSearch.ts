import { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { searchBooks } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { Book } from "@/types/book";

type SearchKey = { type: "book-post-search"; q: string };

/**
 * 書籍投稿画面の書籍選択用フック。
 * キーワードを入力するたびに書籍検索 API を呼ぶ（デバウンス 300ms）。
 * @param isAuthenticated - Railsトークンが存在するか（falseの場合はフェッチしない）
 * @returns keyword, setKeyword, books, isLoading, isEmpty, debouncedKeyword, selectedBook, selectBook, clearBook
 */
export const useBookPostSearch = (isAuthenticated: boolean) => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const key: SearchKey | null =
    debouncedKeyword && isAuthenticated
      ? { type: "book-post-search", q: debouncedKeyword }
      : null;

  const { data, isLoading } = useSWR<{ items: Book[] }>(
    key,
    ({ q }: SearchKey) => searchBooks(q),
    {
      onError: () => {
        logger.error("書籍検索失敗", { endpoint: API_ENDPOINTS.BOOKS_SEARCH });
        toast.error(MESSAGES.BOOK.SEARCH_ERROR);
      },
      shouldRetryOnError: false,
    },
  );

  const books = data?.items ?? [];
  const isEmpty =
    !isLoading && debouncedKeyword !== "" && data !== undefined && books.length === 0;

  const selectBook = (book: Book) => setSelectedBook(book);
  const clearBook = () => setSelectedBook(null);

  return {
    keyword,
    setKeyword,
    books,
    isLoading,
    isEmpty,
    debouncedKeyword,
    selectedBook,
    selectBook,
    clearBook,
  };
};
