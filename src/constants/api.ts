export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const API_ENDPOINTS = {
  // 認証
  AUTH_LOGIN: "/v1/auth/login",
  AUTH_SIGNUP: "/v1/auth/signup",
  AUTH_LOGOUT: "/v1/auth/logout",
  AUTH_REFRESH: "/v1/auth/refresh",

  // ユーザー
  USERS: "/v1/users",
  USER: (username: string) => `/v1/users/${username}`,
  USER_FOLLOW: (username: string) => `/v1/users/${username}/follow`,

  // 本
  BOOKS: "/v1/books",
  BOOK: (id: number) => `/v1/books/${id}`,
} as const;
