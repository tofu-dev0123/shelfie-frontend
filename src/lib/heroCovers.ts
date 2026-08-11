import type { BookPost } from "@/types/book";

const HERO_COVER_LIMIT = 7;

/**
 * 本棚ヒーローの背景に敷く書影URLを抽出する。
 * 書影が無い投稿は背景として使えないため除外する。
 * @param posts - 本棚の投稿一覧
 * @param limit - 抽出する最大件数
 * @returns 書影URLの配列。1件も無い場合は空配列
 */
export const pickHeroCovers = (
  posts: BookPost[],
  limit: number = HERO_COVER_LIMIT,
): string[] =>
  posts
    .map((post) => post.book.thumbnail_url)
    .filter((url): url is string => url !== null)
    .slice(0, limit);
