import { describe, it, expect } from "vitest";
import { pickHeroCovers } from "../heroCovers";
import type { BookPost } from "@/types/book";

const post = (id: number, thumbnailUrl: string | null): BookPost => ({
  id,
  content: null,
  created_at: "2026-08-04T00:00:00Z",
  book: {
    isbn: `978000000000${id}`,
    title: `本${id}`,
    authors: ["著者"],
    thumbnail_url: thumbnailUrl,
  },
});

describe("pickHeroCovers", () => {
  it("書影URLを順番どおりに取り出す", () => {
    const posts = [post(1, "https://example.com/1.jpg"), post(2, null)];
    expect(pickHeroCovers(posts)).toEqual(["https://example.com/1.jpg"]);
  });

  it("thumbnail_url が null の投稿を除外する", () => {
    const posts = [
      post(1, null),
      post(2, "https://example.com/2.jpg"),
      post(3, null),
    ];
    expect(pickHeroCovers(posts)).toEqual(["https://example.com/2.jpg"]);
  });

  it("投稿が空のときは空配列を返す", () => {
    expect(pickHeroCovers([])).toEqual([]);
  });

  it("すべて書影なしのときは空配列を返す", () => {
    expect(pickHeroCovers([post(1, null), post(2, null)])).toEqual([]);
  });

  it("デフォルトでは最大7件までに絞る", () => {
    const posts = Array.from({ length: 12 }, (_, i) =>
      post(i, `https://example.com/${i}.jpg`),
    );
    expect(pickHeroCovers(posts)).toHaveLength(7);
  });

  it("limit を指定するとその件数までに絞る", () => {
    const posts = Array.from({ length: 12 }, (_, i) =>
      post(i, `https://example.com/${i}.jpg`),
    );
    expect(pickHeroCovers(posts, 3)).toEqual([
      "https://example.com/0.jpg",
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
    ]);
  });
});
