import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { MESSAGES } from "@/constants/messages";
import { normalizeSearchType, type SearchType } from "@/constants/search";

const buildSearchUrl = (type: SearchType, q: string): string => {
  const params = new URLSearchParams();
  params.set("type", type);
  if (q) params.set("q", q);
  return `/search?${params.toString()}`;
};

/**
 * 検索フォームの状態と URL クエリ（type / q）の同期を管理するフック。
 * 書籍検索は認証必須のため、書籍タブで未認証時はログイン画面へ誘導する。
 * 投稿・タグ検索は認証不要。
 * @returns type, keyword, setKeyword, handleSubmit, switchType, q
 */
export const useSearchForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const type = normalizeSearchType(searchParams.get("type"));
  const q = searchParams.get("q") ?? "";
  const [keyword, setKeyword] = useState(q);

  useEffect(() => {
    setKeyword(q);
  }, [q]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (type === "books" && !isSignedIn) {
        toast(MESSAGES.BOOK.SEARCH_LOGIN_REQUIRED);
        router.push("/login");
        return;
      }

      const trimmed = keyword.trim();
      router.push(buildSearchUrl(type, trimmed));
    },
    [keyword, router, isSignedIn, type],
  );

  // タブ切替時にキーワードは引き継いで遷移する
  const switchType = useCallback(
    (next: SearchType) => {
      router.push(buildSearchUrl(next, q));
    },
    [router, q],
  );

  return { type, keyword, setKeyword, handleSubmit, switchType, q };
};
