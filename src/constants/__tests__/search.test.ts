import { describe, it, expect } from "vitest";
import { normalizeSearchType, DEFAULT_SEARCH_TYPE } from "../search";

describe("normalizeSearchType", () => {
  it("妥当な値はそのまま返す", () => {
    expect(normalizeSearchType("books")).toBe("books");
    expect(normalizeSearchType("posts")).toBe("posts");
    expect(normalizeSearchType("tags")).toBe("tags");
  });

  it("未知の値はデフォルトに丸める", () => {
    expect(normalizeSearchType("invalid")).toBe(DEFAULT_SEARCH_TYPE);
  });

  it("null はデフォルトに丸める", () => {
    expect(normalizeSearchType(null)).toBe(DEFAULT_SEARCH_TYPE);
  });

  it("空文字はデフォルトに丸める", () => {
    expect(normalizeSearchType("")).toBe(DEFAULT_SEARCH_TYPE);
  });
});
