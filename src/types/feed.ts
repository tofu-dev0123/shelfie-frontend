import type { Pagination } from "./book";

// GET /v1/feed の投稿エントリ
export type FeedItem = {
  id: number;
  content: string | null;
  created_at: string;
  book: {
    isbn: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
  };
  user: {
    username: string;
    nickname: string;
  };
};

// GET /v1/feed レスポンス
export type FeedResponse = {
  items: FeedItem[];
  pagination: Pagination;
};
