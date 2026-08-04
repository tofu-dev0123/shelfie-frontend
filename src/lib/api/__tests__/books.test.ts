import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
}));

import { apiGet, apiPost, apiPut } from "../client";
import {
  getUserBooks,
  searchBooks,
  getTags,
  getBookPostDetail,
  createBook,
  updateBook,
} from "../books";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
  vi.mocked(apiPost).mockReset();
  vi.mocked(apiPut).mockReset();
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

describe("getBookPostDetail", () => {
  it("正しいエンドポイントにGETリクエストを送る", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({});
    await getBookPostDetail("testuser", "9784873115658");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/testuser/books/9784873115658",
    );
  });

  it("レスポンスをそのまま返す", async () => {
    const mockResponse = {
      id: 1,
      content: "よかった",
      tags: ["技術書"],
      created_at: "2026-03-05T00:00:00Z",
      updated_at: "2026-03-05T00:00:00Z",
      book: {
        isbn: "9784873115658",
        title: "リーダブルコード",
        authors: ["Dustin Boswell"],
        thumbnail_url: null,
      },
      user: {
        username: "haruki_m",
        nickname: "村上春樹",
      },
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockResponse);
    const result = await getBookPostDetail("haruki_m", "9784873115658");
    expect(result).toEqual(mockResponse);
  });
});

describe("createBook", () => {
  it("正しいエンドポイントにPOSTリクエストを送る", async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined);
    await createBook({ isbn: "9784873115658", content: "感想" });
    expect(apiPost).toHaveBeenCalledWith("/v1/me/books", {
      isbn: "9784873115658",
      content: "感想",
    });
  });
});

describe("updateBook", () => {
  it("正しいエンドポイントにPUTリクエストを送る", async () => {
    vi.mocked(apiPut).mockResolvedValueOnce(undefined);
    await updateBook("9784873115658", { content: "更新後の感想" });
    expect(apiPut).toHaveBeenCalledWith("/v1/me/books/9784873115658", {
      content: "更新後の感想",
    });
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
