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
  author: string;
  thumbnail_url: string | null;
  published_year: number | null;
};

export type SearchBooksResponse = {
  books: SearchBook[];
};
