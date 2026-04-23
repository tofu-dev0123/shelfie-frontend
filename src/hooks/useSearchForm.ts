import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { MESSAGES } from "@/constants/messages";

/**
 * 検索フォームの状態とURLクエリパラメータの同期を管理するフック。
 * フォーム送信時に認証状態を確認し、未認証ならログイン画面へ誘導する。
 * @returns keyword, setKeyword, handleSubmit, q
 */
export const useSearchForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const q = searchParams.get("q") ?? "";
  const [keyword, setKeyword] = useState(q);

  // ブラウザの戻る/進む操作でURLのqが変わった場合に入力欄を同期する
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

      const trimmed = keyword.trim();
      if (!trimmed) {
        router.push("/search");
        return;
      }
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [keyword, router, isSignedIn],
  );

  return { keyword, setKeyword, handleSubmit, q };
};
