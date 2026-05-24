import { describe, it, expect } from "vitest";
import { bookPostSchema } from "../book";

describe("bookPostSchema", () => {
  it("コメント1文字以上・タグなしは通過する", () => {
    const result = bookPostSchema.safeParse({
      content: "読んだ",
      purchase_links: [],
    });
    expect(result.success).toBe(true);
  });

  it("コメントが空文字の場合はエラー", () => {
    const result = bookPostSchema.safeParse({
      content: "",
      purchase_links: [],
    });
    expect(result.success).toBe(false);
  });

  it("コメントが1000文字超の場合はエラー", () => {
    const result = bookPostSchema.safeParse({
      content: "a".repeat(1001),
      purchase_links: [],
    });
    expect(result.success).toBe(false);
  });

  it("ハッシュタグ5個までは通過する", () => {
    const content = "感想 #A #B #C #D #E";
    const result = bookPostSchema.safeParse({ content, purchase_links: [] });
    expect(result.success).toBe(true);
  });

  it("ハッシュタグ6個はエラー", () => {
    const content = "感想 #A #B #C #D #E #F";
    const result = bookPostSchema.safeParse({ content, purchase_links: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("5個以内");
    }
  });

  it("同じタグを複数回書いても1個として数える", () => {
    const content = "#Ruby #Ruby #Ruby #Ruby #Ruby #Ruby";
    const result = bookPostSchema.safeParse({ content, purchase_links: [] });
    expect(result.success).toBe(true);
  });

  it("購入リンクが http(s):// で始まれば通過する", () => {
    const result = bookPostSchema.safeParse({
      content: "感想",
      purchase_links: ["https://amazon.co.jp/dp/123", "http://books.example/x"],
    });
    expect(result.success).toBe(true);
  });

  it("購入リンクの空文字は許容する（送信時にフィルタする想定）", () => {
    const result = bookPostSchema.safeParse({
      content: "感想",
      purchase_links: ["", "https://example.com/a"],
    });
    expect(result.success).toBe(true);
  });

  it("購入リンクが http(s):// で始まらない場合はエラー", () => {
    const result = bookPostSchema.safeParse({
      content: "感想",
      purchase_links: ["ftp://example.com/a"],
    });
    expect(result.success).toBe(false);
  });

  it("購入リンクが3件を超えるとエラー", () => {
    const result = bookPostSchema.safeParse({
      content: "感想",
      purchase_links: [
        "https://example.com/a",
        "https://example.com/b",
        "https://example.com/c",
        "https://example.com/d",
      ],
    });
    expect(result.success).toBe(false);
  });
});
