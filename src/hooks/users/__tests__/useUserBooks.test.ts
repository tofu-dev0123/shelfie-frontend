// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("@/lib/api/books", () => ({
  getUserBooks: vi.fn().mockResolvedValue({
    items: [],
    pagination: { next_cursor: null, has_next: false },
  }),
}));

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

import { getUserBooks } from "@/lib/api/books";
import { useUserBooks } from "../useUserBooks";

beforeEach(() => {
  vi.mocked(getUserBooks).mockReset();
  vi.mocked(getUserBooks).mockResolvedValue(emptyResponse);
});

// SWR のグローバルキャッシュがテスト間で共有されるため、
// テストごとに異なる username を使ってキャッシュ干渉を避ける
describe("useUserBooks", () => {
  it("初期状態では books が空配列", async () => {
    const { result } = renderHook(() => useUserBooks("init_user"));
    expect(result.current.books).toEqual([]);
  });

  it("getUserBooks が username を渡して呼ばれる", async () => {
    renderHook(() => useUserBooks("called_user"));
    await waitFor(() => {
      expect(getUserBooks).toHaveBeenCalledWith("called_user", null);
    });
  });

  it("APIレスポンスに has_next: false が含まれるとき hasMore が false", async () => {
    vi.mocked(getUserBooks).mockResolvedValue({
      items: [
        {
          id: 1,
          content: null,
          created_at: "2026-01-01T00:00:00Z",
          book: {
            isbn: "abc",
            title: "テスト本",
            authors: ["著者名"],
            thumbnail_url: null,
          },
        },
      ],
      pagination: { next_cursor: null, has_next: false },
    });

    const { result } = renderHook(() => useUserBooks("false_user"));

    await waitFor(() => {
      expect(result.current.books.length).toBe(1);
    });
    expect(result.current.hasMore).toBe(false);
  });

  it("APIレスポンスに has_next: true が含まれるとき hasMore が true", async () => {
    vi.mocked(getUserBooks).mockResolvedValue({
      items: [
        {
          id: 1,
          content: null,
          created_at: "2026-01-01T00:00:00Z",
          book: {
            isbn: "abc",
            title: "テスト本",
            authors: ["著者名"],
            thumbnail_url: null,
          },
        },
      ],
      pagination: { next_cursor: "next_abc", has_next: true },
    });

    const { result } = renderHook(() => useUserBooks("true_user"));

    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });
});
