export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// OAuth の入口。JSON API ではなくブラウザのトップレベル遷移で叩くため /v1 の外にある
export const OAUTH_PROVIDERS = ["google", "github"] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export const OAUTH_START_URL = (provider: OAuthProvider): string =>
  `${API_BASE_URL}/auth/${provider}`;

export const API_ENDPOINTS = {
  // 認証
  AUTH_LOGOUT: "/v1/auth/logout",
  AUTH_REFRESH: "/v1/auth/refresh",
  AUTH_SIGNUP_CONTEXT: "/v1/auth/signup_context",

  // 自分のプロフィール
  ME: "/v1/me",

  // ユーザー
  USERS: "/v1/users",
  USERNAME_CHECK: "/v1/users/username/check",
  USER: (username: string) => `/v1/users/${username}`,

  // 本
  BOOKS: "/v1/books",
  BOOK: (isbn: string) => `/v1/books/${isbn}`,
  BOOKS_SEARCH: "/v1/books/search",
  USER_BOOKS: (username: string) => `/v1/users/${username}/books`,
  USER_BOOK: (username: string, isbn: string) =>
    `/v1/users/${username}/books/${isbn}`,
  ME_BOOKS: "/v1/me/books",
  ME_BOOK: (isbn: string) => `/v1/me/books/${isbn}`,
} as const;
