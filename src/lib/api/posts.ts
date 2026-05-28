import { apiGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { PostSearchResponse } from "@/types/post";

type SearchPostsParams = {
  q?: string;
  tag?: string;
  cursor?: string | null;
};

/**
 * 投稿を本文（q）またはタグ（tag）で検索する。
 * q と tag はどちらか一方のみ指定する。
 * @param params - q または tag のいずれか、必要なら cursor
 * @returns 投稿検索結果（items・pagination）
 * @throws 検索失敗時にエラー
 */
export const searchPosts = ({
  q,
  tag,
  cursor,
}: SearchPostsParams): Promise<PostSearchResponse> => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  if (cursor) params.set("cursor", cursor);
  return apiGet<PostSearchResponse>(
    `${API_ENDPOINTS.POSTS_SEARCH}?${params.toString()}`,
  );
};
