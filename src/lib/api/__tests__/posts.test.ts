import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { searchPosts } from "../posts";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

describe("searchPosts", () => {
  it("q を指定して GET する", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await searchPosts({ q: "Ruby" });
    expect(apiGet).toHaveBeenCalledWith("/v1/posts/search?q=Ruby");
  });

  it("tag を指定して GET する", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await searchPosts({ tag: "Go" });
    expect(apiGet).toHaveBeenCalledWith("/v1/posts/search?tag=Go");
  });

  it("cursor を追加クエリとして付与する", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await searchPosts({ q: "test", cursor: "abc" });
    expect(apiGet).toHaveBeenCalledWith("/v1/posts/search?q=test&cursor=abc");
  });

  it("q と cursor を URL エンコードする", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await searchPosts({ q: "a b", cursor: "x/y" });
    expect(apiGet).toHaveBeenCalledWith("/v1/posts/search?q=a+b&cursor=x%2Fy");
  });

  it("cursor が null の場合は付与しない", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await searchPosts({ q: "test", cursor: null });
    expect(apiGet).toHaveBeenCalledWith("/v1/posts/search?q=test");
  });

  it("レスポンスをそのまま返す", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    const result = await searchPosts({ q: "test" });
    expect(result).toEqual(emptyResponse);
  });
});
