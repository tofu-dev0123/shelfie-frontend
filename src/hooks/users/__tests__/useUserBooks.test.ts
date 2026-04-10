// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@/lib/api/books", () => ({
  getUserBooks: vi.fn().mockResolvedValue({ books: [], has_next: false, page: 1 }),
}));

import { getUserBooks } from "@/lib/api/books";
import { useUserBooks } from "../useUserBooks";

beforeEach(() => {
  vi.mocked(getUserBooks).mockReset();
  vi.mocked(getUserBooks).mockResolvedValue({ books: [], has_next: false, page: 1 });
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
      { initialProps: { status: "done" as const } },
    );

    act(() => {
      result.current.loadMore();
    });

    rerender({ status: "want" });

    expect(result.current.books).toEqual([]);
  });

  it("APIレスポンスに has_next: false が含まれるとき hasMore が false", async () => {
    vi.mocked(getUserBooks).mockResolvedValue({
      books: [{ id: 1, title: "テスト本" } as never],
      has_next: false,
      page: 1,
    });

    const { result } = renderHook(() => useUserBooks("testuser", "done"));

    await act(async () => {});

    expect(result.current.hasMore).toBe(false);
  });

  it("APIレスポンスに has_next: true が含まれるとき hasMore が true", async () => {
    vi.mocked(getUserBooks).mockResolvedValue({
      books: [{ id: 1, title: "テスト本" } as never],
      has_next: true,
      page: 1,
    });

    const { result } = renderHook(() => useUserBooks("testuser", "done"));

    await act(async () => {});

    expect(result.current.hasMore).toBe(true);
  });
});
