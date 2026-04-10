import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { MESSAGES } from "@/constants/messages";

/**
 * 検索フォームの状態とURLクエリパラメータの同期を管理するフック。
 * フォーム送信時にRailsトークンの有無を確認し、未認証ならログイン画面へ誘導する。
 * Zustandのトークンが未ロードでもClerkセッションがあれば検索を続行する（サイレントリフレッシュに委ねる）。
 * @returns keyword, setKeyword, handleSubmit, q
 */
export const useSearchForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const accessToken = useAuthStore((s) => s.accessToken);

  const q = searchParams.get("q") ?? "";
  const [keyword, setKeyword] = useState(q);

  // ブラウザの戻る/進む操作でURLのqが変わった場合に入力欄を同期する
  useEffect(() => {
    setKeyword(q);
  }, [q]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // RailsトークンなしかつClerkセッションもない場合は未認証と判断してログインへ誘導する
      // Zustandトークンが未ロードでもClerkがサインイン済みならサイレントリフレッシュで対応できるため続行する
      if (!accessToken && !isSignedIn) {
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
    [keyword, router, accessToken, isSignedIn],
  );

  return { keyword, setKeyword, handleSubmit, q };
};
