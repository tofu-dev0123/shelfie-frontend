import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { getBook, searchBooks } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { Book } from "@/types/book";

/**
 * 書籍投稿画面の書籍選択用フック。
 * キーワードを入力するたびに書籍検索 API を呼ぶ（デバウンス 300ms）。
 * URL クエリに isbn が含まれる場合は、対応する書籍を初期 selectedBook としてセットする。
 * @param isAuthenticated - Railsトークンが存在するか（falseの場合はフェッチしない）
 * @returns keyword, setKeyword, books, isLoading, isEmpty, debouncedKeyword, selectedBook, selectBook, clearBook, isInitializing
 */
export const useBookPostSearch = (isAuthenticated: boolean) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIsbn = searchParams.get("isbn");

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // URL クエリ ?isbn=... があれば書籍を取得して selectedBook にセットする
  const fetchByIsbnKey =
    initialIsbn && isAuthenticated && !selectedBook
      ? API_ENDPOINTS.BOOK(initialIsbn)
      : null;

  const { isLoading: isInitializing } = useSWR<Book>(
    fetchByIsbnKey,
    () => getBook(initialIsbn!),
    {
      onSuccess: (data) => {
        setSelectedBook(data);
      },
      onError: () => {
        logger.error("書籍取得失敗", {
          endpoint: API_ENDPOINTS.BOOK(initialIsbn ?? ""),
        });
        toast.error(MESSAGES.BOOK.FETCH_ERROR);
        router.replace("/books/new");
      },
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const searchKey =
    debouncedKeyword && isAuthenticated
      ? [API_ENDPOINTS.BOOKS_SEARCH, debouncedKeyword]
      : null;

  const { data, isLoading } = useSWR<{ items: Book[] }>(
    searchKey,
    ([, q]: [string, string]) => searchBooks(q),
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
    !isLoading &&
    debouncedKeyword !== "" &&
    data !== undefined &&
    books.length === 0;

  const selectBook = (book: Book) => setSelectedBook(book);
  const clearBook = () => {
    setSelectedBook(null);
    // URL クエリ起点で開いていた場合、再マウントで復元されないようクエリを落とす
    if (initialIsbn) router.replace("/books/new");
  };

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
    isInitializing,
  };
};
