// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("@/lib/api/books", () => ({
  getMyWantToReads: vi.fn(),
}));

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

import { getMyWantToReads } from "@/lib/api/books";
import { useMyWantToReads } from "../useMyWantToReads";

beforeEach(() => {
  vi.mocked(getMyWantToReads).mockReset();
  vi.mocked(getMyWantToReads).mockResolvedValue(emptyResponse);
});

// SWR のグローバルキャッシュがテスト間で共有されるため、
// fetcher の呼び出し有無を 1 ケースずつ独立に検証する
describe("useMyWantToReads", () => {
  it("enabled が省略された場合（デフォルト true）は fetcher が呼ばれる", async () => {
    renderHook(() => useMyWantToReads());
    await waitFor(() => {
      expect(getMyWantToReads).toHaveBeenCalled();
    });
  });

  it("enabled が false の場合は fetcher が呼ばれない", async () => {
    renderHook(() => useMyWantToReads(false));
    // 非同期で fetch が走らないことを担保するため少し待つ
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(getMyWantToReads).not.toHaveBeenCalled();
  });
});
