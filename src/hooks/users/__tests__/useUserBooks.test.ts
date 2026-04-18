// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

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

describe("useUserBooks", () => {
  it("初期状態では books が空配列", async () => {
    const { result } = renderHook(() => useUserBooks("testuser", "done"));
    expect(result.current.books).toEqual([]);
  });

  it("status が変わったとき size が 1 にリセットされる", async () => {
    const { result, rerender } = renderHook(
      ({ status }: { status: "done" | "want" }) =>
        useUserBooks("testuser", status),
      { initialProps: { status: "done" as "done" | "want" } },
    );

    act(() => {
      result.current.loadMore();
    });

    rerender({ status: "want" });

    expect(result.current.books).toEqual([]);
  });

  it("APIレスポンスに has_next: false が含まれるとき hasMore が false", async () => {
    vi.mocked(getUserBooks).mockResolvedValue({
      items: [
        {
          id: 1,
          content: null,
          tags: [],
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

    const { result } = renderHook(() => useUserBooks("testuser", "done"));

    await act(async () => {});

    expect(result.current.hasMore).toBe(false);
  });

  it("APIレスポンスに has_next: true が含まれるとき hasMore が true", async () => {
    vi.mocked(getUserBooks).mockResolvedValue({
      items: [
        {
          id: 1,
          content: null,
          tags: [],
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

    const { result } = renderHook(() => useUserBooks("testuser", "done"));

    await act(async () => {});

    expect(result.current.hasMore).toBe(true);
  });
});
