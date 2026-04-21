"use client";

import { useState } from "react";
import axios from "axios";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { addWantToRead } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * 読みたいリスト追加操作を管理するフック。
 * APIレスポンスを受けてからUIを更新する（楽観的更新なし）。
 * 追加成功後は useMyWantToReads のキャッシュを無効化する。
 * @param isbn - 追加対象のISBN-13
 * @returns isPending, handleAdd
 */
export const useAddWantToRead = (isbn: string) => {
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  const handleAdd = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await addWantToRead(isbn);
      toast.success(MESSAGES.BOOK.WANT_TO_READ_SUCCESS);
      // useMyWantToReads は useSWRInfinite で { type: "my-want-to-reads", cursor } を
      // キーに使うため、matcher 関数で全ページキーをまとめて無効化する
      await mutate(
        (key) =>
          typeof key === "object" &&
          key !== null &&
          (key as { type?: string }).type === "my-want-to-reads",
      );
    } catch (error) {
      // 409 は「すでに追加済み」を意味するため、エラー扱いせず info トーストで通知する
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.info(MESSAGES.BOOK.WANT_TO_READ_ALREADY_ADDED);
        return;
      }
      logger.error("読みたいリスト追加失敗", {
        endpoint: API_ENDPOINTS.ME_WANT_TO_READ(isbn),
      });
      toast.error(MESSAGES.BOOK.WANT_TO_READ_ERROR);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, handleAdd };
};
