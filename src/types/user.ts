// GET /v1/me レスポンス
export type Me = {
  id: number;
  username: string;
  nickname: string;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  books_count: number;
  links: string[];
};

// GET /v1/users/:username レスポンス
export type User = {
  username: string;
  nickname: string;
  bio: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  books_count: number;
  links: string[];
  is_following: boolean;
};
