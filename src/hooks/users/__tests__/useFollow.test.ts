// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("swr", () => ({
  default: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useSWRConfig: vi.fn().mockReturnValue({ mutate: vi.fn() }),
}));

vi.mock("@/lib/api/users", () => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn() },
}));

import { followUser, unfollowUser } from "@/lib/api/users";
import { toast } from "sonner";
import { useFollow } from "../useFollow";

beforeEach(() => {
  vi.mocked(followUser).mockReset();
  vi.mocked(unfollowUser).mockReset();
  vi.mocked(toast.success).mockReset();
  vi.mocked(toast.error).mockReset();
});

describe("useFollow", () => {
  it("初期状態では isFollowing が false", () => {
    const { result } = renderHook(() => useFollow("testuser"));
    expect(result.current.isFollowing).toBe(false);
  });

  it("フォロー成功時に isFollowing が true になりトーストを表示する", async () => {
    vi.mocked(followUser).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useFollow("testuser"));

    await act(async () => {
      await result.current.handleFollow();
    });

    expect(followUser).toHaveBeenCalledWith("testuser");
    expect(result.current.isFollowing).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("フォローしました");
  });

  it("フォロー中に handleFollow を呼ぶとアンフォローする", async () => {
    vi.mocked(followUser).mockResolvedValueOnce(undefined);
    vi.mocked(unfollowUser).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useFollow("testuser"));

    // まずフォロー
    await act(async () => {
      await result.current.handleFollow();
    });

    // アンフォロー
    await act(async () => {
      await result.current.handleFollow();
    });

    expect(unfollowUser).toHaveBeenCalledWith("testuser");
    expect(result.current.isFollowing).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("フォローを外しました");
  });

  it("API失敗時にエラートーストを表示する", async () => {
    vi.mocked(followUser).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useFollow("testuser"));

    await act(async () => {
      await result.current.handleFollow();
    });

    expect(result.current.isFollowing).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("フォローに失敗しました");
  });

  it("処理中は isPending が true になる", async () => {
    let resolve: () => void;
    vi.mocked(followUser).mockReturnValueOnce(
      new Promise<void>((res) => { resolve = res; }),
    );

    const { result } = renderHook(() => useFollow("testuser"));

    act(() => {
      result.current.handleFollow();
    });

    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolve!();
    });

    expect(result.current.isPending).toBe(false);
  });
});
