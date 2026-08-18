"use client";

import { toast } from "sonner";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * 現在のページURLをクリップボードにコピーするフック。
 * 投稿詳細画面の3点リーダー「共有」から呼び出す。
 * @returns copy - クリップボードへコピーを実行するハンドラー
 */
export const useShareBookUrl = () => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(MESSAGES.SHARE.COPY_SUCCESS);
    } catch {
      logger.error("URLのクリップボードコピー失敗");
      toast.error(MESSAGES.SHARE.COPY_ERROR);
    }
  };
  return { copy };
};
