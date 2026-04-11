import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { getUserBooks } from "../books";

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
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/testuser/books?status=done",
    );
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
