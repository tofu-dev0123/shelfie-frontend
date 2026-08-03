import { describe, it, expect } from "vitest";
import { bookPostSchema } from "../book";

describe("bookPostSchema", () => {
  it("コメント1文字以上・タグなしは通過する", () => {
    const result = bookPostSchema.safeParse({ content: "読んだ" });
    expect(result.success).toBe(true);
  });

  it("コメントが空文字の場合はエラー", () => {
    const result = bookPostSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("コメントが1000文字超の場合はエラー", () => {
    const result = bookPostSchema.safeParse({ content: "a".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("ハッシュタグ5個までは通過する", () => {
    const content = "感想 #A #B #C #D #E";
    const result = bookPostSchema.safeParse({ content });
    expect(result.success).toBe(true);
  });

  it("ハッシュタグ6個はエラー", () => {
    const content = "感想 #A #B #C #D #E #F";
    const result = bookPostSchema.safeParse({ content });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("5個以内");
    }
  });

  it("同じタグを複数回書いても1個として数える", () => {
    const content = "#Ruby #Ruby #Ruby #Ruby #Ruby #Ruby";
    const result = bookPostSchema.safeParse({ content });
    expect(result.success).toBe(true);
  });
});
