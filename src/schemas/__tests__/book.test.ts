import { describe, it, expect } from "vitest";
import { bookPostSchema } from "../book";

describe("bookPostSchema", () => {
  it("コメント1文字以上は通過する", () => {
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

  it("# を含む本文はただのテキストとして通過する", () => {
    const content = "感想 #A #B #C #D #E #F";
    const result = bookPostSchema.safeParse({ content });
    expect(result.success).toBe(true);
  });
});
