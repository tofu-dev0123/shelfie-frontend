// GET /v1/books/search および本棚の book オブジェクト共通型
export type Book = {
  google_books_id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
};

// カーソルベースページネーション共通型
export type Pagination = {
  next_cursor: string | null;
  has_next: boolean;
};

// GET /v1/books/search レスポンス
export type SearchBooksResponse = {
  items: Book[];
  pagination: Pagination;
};

// GET /v1/users/:username/books の投稿エントリ
export type BookPost = {
  id: number;
  content: string | null;
  tags: string[];
  created_at: string;
  book: Book;
};

// GET /v1/users/:username/books レスポンス
export type BookPostsResponse = {
  items: BookPost[];
  pagination: Pagination;
};
