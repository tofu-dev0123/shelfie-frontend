import type { FeedItem } from "./feed";
import type { Pagination } from "./book";

// GET /v1/posts/search レスポンス
// items の型は Feed と同一
export type PostSearchResponse = {
  items: FeedItem[];
  pagination: Pagination;
};
