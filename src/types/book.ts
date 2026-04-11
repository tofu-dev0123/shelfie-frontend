export type UserBook = {
  google_books_id: string;
  title: string;
  author: string;
  thumbnail_url: string | null;
};

export type UserBooksResponse = {
  books: UserBook[];
  has_next: boolean;
  page: number;
};

export type SearchBook = {
  google_books_id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
};

export type SearchBooksResponse = {
  items: SearchBook[];
  pagination: {
    next_cursor: string | null;
    has_next: boolean;
  };
};
