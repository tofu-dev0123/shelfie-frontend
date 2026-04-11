import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { getUserBooks, searchBooks } from "../books";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

describe("getUserBooks", () => {
  it("正しいエンドポイントにGETリクエストを送る（done・カーソルなし）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getUserBooks("testuser", "done");
    expect(apiGet).toHaveBeenCalledWith("/v1/users/testuser/books?status=done");
  });

  it("正しいエンドポイントにGETリクエストを送る（want・カーソルあり）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getUserBooks("testuser", "want", "cursor_abc");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/testuser/books?status=want&cursor=cursor_abc",
    );
  });

  it("レスポンスをそのまま返す", async () => {
    const mockResponse = {
      items: [
        {
          id: 1,
          content: null,
          tags: [],
          created_at: "2026-01-01T00:00:00Z",
          book: {
            google_books_id: "abc",
            title: "吾輩は猫である",
            authors: ["夏目漱石"],
            thumbnail_url: null,
          },
        },
      ],
      pagination: { next_cursor: null, has_next: false },
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockResponse);
    const result = await getUserBooks("testuser", "done");
    expect(result).toEqual(mockResponse);
  });
});

const emptySearchResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

describe("searchBooks", () => {
  it("正しいエンドポイントにGETリクエストを送る（カーソルなし）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptySearchResponse);
    await searchBooks("村上春樹");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/books/search?q=%E6%9D%91%E4%B8%8A%E6%98%A5%E6%A8%B9",
    );
  });

  it("正しいエンドポイントにGETリクエストを送る（カーソルあり）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptySearchResponse);
    await searchBooks("村上春樹", "cursor_abc");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/books/search?q=%E6%9D%91%E4%B8%8A%E6%98%A5%E6%A8%B9&cursor=cursor_abc",
    );
  });
});
