export const SEARCH_TYPES = ["books", "posts", "tags"] as const;
export type SearchType = (typeof SEARCH_TYPES)[number];

export const SEARCH_TYPE_LABEL: Record<SearchType, string> = {
  books: "書籍",
  posts: "投稿",
  tags: "タグ",
};

export const DEFAULT_SEARCH_TYPE: SearchType = "books";

/**
 * 任意の文字列を SearchType に正規化する。未知の値はデフォルトに丸める。
 * @param raw - URL クエリから取り出した type 値
 * @returns 妥当な SearchType
 */
export const normalizeSearchType = (raw: string | null): SearchType => {
  if (raw && (SEARCH_TYPES as readonly string[]).includes(raw)) {
    return raw as SearchType;
  }
  return DEFAULT_SEARCH_TYPE;
};
