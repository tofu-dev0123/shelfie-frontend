import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { getFeed } from "../feed";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

describe("getFeed", () => {
  it("cursor が null の場合はクエリなしでGETする", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getFeed(null);
    expect(apiGet).toHaveBeenCalledWith("/v1/feed");
  });

  it("cursor が指定された場合はクエリ付きでGETする", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getFeed("cursor_abc");
    expect(apiGet).toHaveBeenCalledWith("/v1/feed?cursor=cursor_abc");
  });

  it("cursor を URL エンコードする", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getFeed("a b/c");
    expect(apiGet).toHaveBeenCalledWith("/v1/feed?cursor=a%20b%2Fc");
  });

  it("レスポンスをそのまま返す", async () => {
    const mockResponse = {
      items: [
        {
          id: 1,
          content: "とても良い本でした",
          tags: ["ビジネス"],
          created_at: "2026-04-22T00:00:00Z",
          book: {
            isbn: "9784873116068",
            title: "リーダブルコード",
            authors: ["Dustin Boswell"],
            thumbnail_url: null,
          },
          user: {
            username: "komusan",
            nickname: "コムさん",
            avatar_url: null,
          },
        },
      ],
      pagination: { next_cursor: null, has_next: false },
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockResponse);
    const result = await getFeed(null);
    expect(result).toEqual(mockResponse);
  });
});
