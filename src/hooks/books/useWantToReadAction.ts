"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAddWantToRead } from "@/hooks/books/useAddWantToRead";
import { MESSAGES } from "@/constants/messages";

/**
 * 投稿詳細画面の「読みたいリストに追加」アクションを管理するフック。
 * 未ログイン時はトーストでログインを促したうえでログイン画面へ遷移する。
 * ログイン済みなら useAddWantToRead に委譲して追加処理を行う。
 * @param isbn - 追加対象のISBN-13
 * @returns isPending, handleAdd
 */
export const useWantToReadAction = (isbn: string) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { isPending, handleAdd } = useAddWantToRead(isbn);

  const handleClick = async () => {
    if (!isSignedIn) {
      toast.info(MESSAGES.BOOK.WANT_TO_READ_LOGIN_REQUIRED);
      router.push("/login");
      return;
    }
    await handleAdd();
  };

  return { isPending, handleClick };
};
