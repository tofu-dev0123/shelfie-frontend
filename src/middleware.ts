import { NextResponse, type NextRequest } from "next/server";

// 認証が必要なページ。Cookie の存在だけを見る UX 上のガードであり、認可の境界ではない。
// 実際の認可は Rails API が Bearer トークンを検証して行う
const PROTECTED_PATHS = ["/profile", "/books/new"];

// Cookie を持つユーザーが開いても意味がないページ。サインアップ完了後のリロードで
// 期限切れの signup_token を叩きにいくのを防ぐ
const SIGNED_IN_ONLY_REDIRECT_PATHS = ["/signup"];

const isProtectedPath = (pathname: string): boolean =>
  PROTECTED_PATHS.some((path) => pathname.startsWith(path)) ||
  /^\/books\/[^/]+\/edit$/.test(pathname);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Rails が発行する Cookie は COOKIE_DOMAIN で親ドメインに設定されるため Next.js からも読める。
  // 存在するだけでは有効性を保証しないので、無効だった場合は API 側の 401 に委ねる
  const hasRefreshToken = req.cookies.has("refresh_token");

  if (isProtectedPath(pathname) && !hasRefreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (SIGNED_IN_ONLY_REDIRECT_PATHS.includes(pathname) && hasRefreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
