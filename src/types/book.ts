// GET /v1/books/search および本棚の book オブジェクト共通型
export type Book = {
  isbn: string;
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
  created_at: string;
  book: Book;
};

// GET /v1/users/:username/books レスポンス
export type BookPostsResponse = {
  items: BookPost[];
  pagination: Pagination;
};

// POST /v1/me/books リクエスト
export type CreateBookInput = {
  isbn: string;
  content?: string;
};

// PUT /v1/me/books/:isbn リクエスト
export type UpdateBookInput = {
  content: string;
};

// GET /v1/users/:username/books/:isbn の投稿者情報
export type BookPostAuthor = {
  username: string;
  nickname: string;
};

// GET /v1/users/:username/books/:isbn レスポンス
export type BookPostDetail = {
  id: number;
  content: string | null;
  created_at: string;
  updated_at: string;
  book: Book;
  user: BookPostAuthor;
};
