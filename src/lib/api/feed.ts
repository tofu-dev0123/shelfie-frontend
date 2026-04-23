import { apiGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { FeedResponse } from "@/types/feed";

/**
 * フィードを取得する。
 * 認証ヘッダが付く場合はフォロー中ユーザー + 自分の投稿、付かない場合は全投稿が返る。
 * @param cursor - 前回レスポンスの next_cursor。初回は null
 * @returns フィードアイテムとページネーション情報
 */
export const getFeed = (cursor: string | null): Promise<FeedResponse> => {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  return apiGet(`${API_ENDPOINTS.FEED}${query}`);
};
