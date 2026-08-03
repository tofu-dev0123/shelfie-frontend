// GET /v1/books/search および本棚の book オブジェクト共通型
export type Book = {
  isbn: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
  // ログイン中ユーザーが読みたいリストに登録済みかどうか。未ログイン時は null
  is_in_my_want_to_read: boolean | null;
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

// GET /v1/me/want_to_reads レスポンス
export type WantToReadsResponse = {
  items: Book[];
  pagination: Pagination;
};

// GET /v1/tags レスポンス
export type TagsResponse = {
  tags: { name: string }[];
};

// POST /v1/me/books リクエスト
// tags はバックエンドで content 内の #ハッシュタグから自動抽出されるため、
// フロント側からは送信しない。
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
  tags: string[];
  created_at: string;
  updated_at: string;
  book: Book;
  user: BookPostAuthor;
};
