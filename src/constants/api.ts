export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const API_ENDPOINTS = {
  // 認証
  AUTH_LOGIN: "/v1/auth/login",
  AUTH_LOGOUT: "/v1/auth/logout",
  AUTH_REFRESH: "/v1/auth/refresh",

  // 自分のプロフィール
  ME: "/v1/me",

  // ユーザー
  USERS: "/v1/users",
  USERNAME_CHECK: "/v1/users/username/check",
  USER: (username: string) => `/v1/users/${username}`,
  USER_FOLLOW: (username: string) => `/v1/me/follows/${username}`,

  // 本
  BOOKS: "/v1/books",
  BOOK: (isbn: string) => `/v1/books/${isbn}`,
  BOOKS_SEARCH: "/v1/books/search",
  USER_BOOKS: (username: string) => `/v1/users/${username}/books`,
  USER_BOOK: (username: string, isbn: string) =>
    `/v1/users/${username}/books/${isbn}`,
  ME_BOOKS: "/v1/me/books",
  ME_BOOK: (isbn: string) => `/v1/me/books/${isbn}`,

  // フィード
  FEED: "/v1/feed",
} as const;
