export type User = {
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
