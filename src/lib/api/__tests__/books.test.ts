import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { getUserBooks } from "../books";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

describe("getUserBooks", () => {
  it("正しいエンドポイントにGETリクエストを送る（done・page1）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({
      books: [],
      has_next: false,
      page: 1,
    });
    await getUserBooks("testuser", "done", 1);
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/testuser/books?status=done&page=1",
    );
  });

  it("正しいエンドポイントにGETリクエストを送る（want・page2）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({
      books: [],
      has_next: false,
      page: 2,
    });
    await getUserBooks("testuser", "want", 2);
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/testuser/books?status=want&page=2",
    );
  });

  it("レスポンスをそのまま返す", async () => {
    const mockResponse = {
      books: [{ id: 1, title: "吾輩は猫である" }],
      has_next: true,
      page: 1,
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockResponse);
    const result = await getUserBooks("testuser", "done", 1);
    expect(result).toEqual(mockResponse);
  });
});
