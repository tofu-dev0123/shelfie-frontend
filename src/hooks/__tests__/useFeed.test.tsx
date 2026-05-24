// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import type { ReactNode } from "react";

vi.mock("@/lib/api/feed", () => ({
  getFeed: vi.fn(),
}));

import { getFeed } from "@/lib/api/feed";
import { useFeed } from "../useFeed";

const emptyResponse = {
  items: [],
  pagination: { next_cursor: null, has_next: false },
};

const sampleItem = {
  id: 1,
  content: "とても良い本でした",
  tags: ["ビジネス"],
  created_at: "2026-04-22T00:00:00Z",
  book: {
    isbn: "9784873116068",
    title: "リーダブルコード",
    authors: ["Dustin Boswell"],
    thumbnail_url: null,
    is_in_my_want_to_read: null,
  },
  user: {
    username: "komusan",
    nickname: "コムさん",
    avatar_url: null,
  },
};

// SWR のグローバルキャッシュがテスト間で共有されるのを防ぐため、
// テストごとに新しい Map を持つ SWRConfig でラップする
const wrapper = () => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );
  return Wrapper;
};

beforeEach(() => {
  vi.mocked(getFeed).mockReset();
  vi.mocked(getFeed).mockResolvedValue(emptyResponse);
});

describe("useFeed", () => {
  it("初期状態では items が空配列", () => {
    const { result } = renderHook(() => useFeed(false), { wrapper: wrapper() });
    expect(result.current.items).toEqual([]);
  });

  it("初回は cursor=null で getFeed を呼ぶ", async () => {
    renderHook(() => useFeed(false), { wrapper: wrapper() });
    await waitFor(() => {
      expect(getFeed).toHaveBeenCalledWith(null);
    });
  });

  it("APIレスポンスに has_next: false が含まれるとき hasMore が false", async () => {
    vi.mocked(getFeed).mockResolvedValue({
      items: [sampleItem],
      pagination: { next_cursor: null, has_next: false },
    });
    const { result } = renderHook(() => useFeed(true), { wrapper: wrapper() });
    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });
    expect(result.current.hasMore).toBe(false);
  });

  it("APIレスポンスに has_next: true が含まれるとき hasMore が true", async () => {
    vi.mocked(getFeed).mockResolvedValue({
      items: [sampleItem],
      pagination: { next_cursor: "next_abc", has_next: true },
    });
    const { result } = renderHook(() => useFeed(false), { wrapper: wrapper() });
    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });
});
