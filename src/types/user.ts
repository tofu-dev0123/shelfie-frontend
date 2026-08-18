// GET /v1/me レスポンス
export type Me = {
  id: number;
  username: string;
  nickname: string;
  bio: string | null;
  books_count: number;
  links: string[];
};

// GET /v1/users/:username レスポンス
export type User = {
  username: string;
  nickname: string;
  bio: string | null;
  books_count: number;
  links: string[];
};
