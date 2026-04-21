import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { getUserBooks, getMyWantToReads, searchBooks, getTags } from "../books";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

describe("getUserBooks", () => {
  it("正しいエンドポイントにGETリクエストを送る（カーソルなし）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getUserBooks("testuser");
    expect(apiGet).toHaveBeenCalledWith("/v1/users/testuser/books");
  });

  it("正しいエンドポイントにGETリクエストを送る（カーソルあり）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getUserBooks("testuser", "cursor_abc");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/testuser/books?cursor=cursor_abc",
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
            isbn: "abc",
            title: "吾輩は猫である",
            authors: ["夏目漱石"],
            thumbnail_url: null,
          },
        },
      ],
      pagination: { next_cursor: null, has_next: false },
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockResponse);
    const result = await getUserBooks("testuser");
    expect(result).toEqual(mockResponse);
  });
});

describe("getMyWantToReads", () => {
  it("正しいエンドポイントにGETリクエストを送る（カーソルなし）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getMyWantToReads();
    expect(apiGet).toHaveBeenCalledWith("/v1/me/want_to_reads");
  });

  it("正しいエンドポイントにGETリクエストを送る（カーソルあり）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce(emptyResponse);
    await getMyWantToReads("cursor_xyz");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/me/want_to_reads?cursor=cursor_xyz",
    );
  });

  it("レスポンスをそのまま返す", async () => {
    const mockResponse = {
      items: [
        {
          isbn: "9784001234567",
          title: "ノルウェイの森",
          authors: ["村上春樹"],
          thumbnail_url: null,
        },
      ],
      pagination: { next_cursor: null, has_next: false },
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockResponse);
    const result = await getMyWantToReads();
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

describe("getTags", () => {
  it("クエリを q パラメータに付けて GET する（英数字）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ tags: [] });
    await getTags("Ru");
    expect(apiGet).toHaveBeenCalledWith("/v1/tags?q=Ru");
  });

  it("クエリを q パラメータに付けて GET する（日本語・URLエンコード）", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ tags: [] });
    await getTags("日本");
    expect(apiGet).toHaveBeenCalledWith("/v1/tags?q=%E6%97%A5%E6%9C%AC");
  });

  it("レスポンスをそのまま返す", async () => {
    const mock = { tags: [{ name: "Ruby" }, { name: "Rails" }] };
    vi.mocked(apiGet).mockResolvedValueOnce(mock);
    const result = await getTags("R");
    expect(result).toEqual(mock);
  });
});
