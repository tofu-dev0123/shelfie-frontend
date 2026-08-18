import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { MESSAGES } from "@/constants/messages";

const buildSearchUrl = (q: string): string => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  return `/search?${params.toString()}`;
};

/**
 * 検索フォームの状態と URL クエリ（q）の同期を管理するフック。
 * 書籍検索は認証必須のため、未認証時はログイン画面へ誘導する。
 * @returns keyword, setKeyword, handleSubmit, q
 */
export const useSearchForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const q = searchParams.get("q") ?? "";
  const [keyword, setKeyword] = useState(q);

  useEffect(() => {
    setKeyword(q);
  }, [q]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!isSignedIn) {
        toast(MESSAGES.BOOK.SEARCH_LOGIN_REQUIRED);
        router.push("/login");
        return;
      }

      router.push(buildSearchUrl(keyword.trim()));
    },
    [keyword, router, isSignedIn],
  );

  return { keyword, setKeyword, handleSubmit, q };
};
