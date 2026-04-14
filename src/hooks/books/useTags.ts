import useSWR from "swr";
import { toast } from "sonner";
import { getTags } from "@/lib/api/books";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * タグ一覧を取得するSWRフック。
 * @returns tags, isLoading
 */
export const useTags = () => {
  const { data, isLoading } = useSWR(API_ENDPOINTS.TAGS, getTags, {
    onError: () => {
      logger.error("タグ取得失敗", { endpoint: API_ENDPOINTS.TAGS });
      toast.error(MESSAGES.BOOK.TAG_FETCH_ERROR);
    },
    shouldRetryOnError: false,
  });

  return { tags: data?.tags.map((t) => t.name) ?? [], isLoading };
};
