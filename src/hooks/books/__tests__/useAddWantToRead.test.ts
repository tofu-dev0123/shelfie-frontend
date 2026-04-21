// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mutateMock = vi.fn();

vi.mock("swr", () => ({
  default: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
  useSWRConfig: () => ({ mutate: mutateMock }),
}));

vi.mock("@/lib/api/books", () => ({
  addWantToRead: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn() },
}));

import { addWantToRead } from "@/lib/api/books";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { useAddWantToRead } from "../useAddWantToRead";

beforeEach(() => {
  vi.mocked(addWantToRead).mockReset();
  vi.mocked(toast.success).mockReset();
  vi.mocked(toast.error).mockReset();
  vi.mocked(toast.info).mockReset();
  vi.mocked(logger.error).mockReset();
  mutateMock.mockReset();
});

describe("useAddWantToRead", () => {
  const ISBN = "9784123456789";

  it("初期状態では isPending が false", () => {
    const { result } = renderHook(() => useAddWantToRead(ISBN));
    expect(result.current.isPending).toBe(false);
  });

  it("追加成功時に addWantToRead が呼ばれ、成功トーストが表示され、キャッシュが無効化される", async () => {
    vi.mocked(addWantToRead).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAddWantToRead(ISBN));

    await act(async () => {
      await result.current.handleAdd();
    });

    expect(addWantToRead).toHaveBeenCalledWith(ISBN);
    expect(toast.success).toHaveBeenCalledWith("読みたいリストに追加しました");
    expect(mutateMock).toHaveBeenCalledTimes(1);

    // mutate に渡した matcher 関数が想定どおり動作するか検証
    const matcher = mutateMock.mock.calls[0][0] as (key: unknown) => boolean;
    expect(matcher({ type: "my-want-to-reads", cursor: null })).toBe(true);
    expect(matcher({ type: "my-want-to-reads", cursor: "abc" })).toBe(true);
    expect(matcher({ type: "other" })).toBe(false);
    expect(matcher("/v1/me/want_to_reads")).toBe(false);
    expect(matcher(null)).toBe(false);
  });

  it("409エラー時は info トーストで追加済みを通知し、エラーログは出さない", async () => {
    // axios.isAxiosError は isAxiosError: true プロパティで判定するため、
    // テスト用に同等の形状のエラーオブジェクトを作る
    const conflictError = Object.assign(new Error("conflict"), {
      isAxiosError: true,
      response: { status: 409, data: {} },
    });
    vi.mocked(addWantToRead).mockRejectedValueOnce(conflictError);

    const { result } = renderHook(() => useAddWantToRead(ISBN));

    await act(async () => {
      await result.current.handleAdd();
    });

    expect(toast.info).toHaveBeenCalledWith(
      "すでに読みたいリストに追加済みです",
    );
    expect(toast.error).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("API失敗時にエラートーストとログを出し、キャッシュ無効化は行わない", async () => {
    vi.mocked(addWantToRead).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useAddWantToRead(ISBN));

    await act(async () => {
      await result.current.handleAdd();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "読みたいリストへの追加に失敗しました",
    );
    expect(logger.error).toHaveBeenCalledWith(
      "読みたいリスト追加失敗",
      expect.objectContaining({
        endpoint: `/v1/me/want_to_reads/${ISBN}`,
      }),
    );
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("処理中は isPending が true になる", async () => {
    let resolve: () => void;
    vi.mocked(addWantToRead).mockReturnValueOnce(
      new Promise<void>((res) => {
        resolve = res;
      }),
    );

    const { result } = renderHook(() => useAddWantToRead(ISBN));

    act(() => {
      result.current.handleAdd();
    });

    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolve!();
    });

    expect(result.current.isPending).toBe(false);
  });

  it("処理中に再度呼び出しても二重に発火しない", async () => {
    let resolve: () => void;
    vi.mocked(addWantToRead).mockReturnValueOnce(
      new Promise<void>((res) => {
        resolve = res;
      }),
    );

    const { result } = renderHook(() => useAddWantToRead(ISBN));

    act(() => {
      result.current.handleAdd();
    });

    // 処理中に再度呼んでも追加でAPIが呼ばれないこと
    await act(async () => {
      await result.current.handleAdd();
    });

    expect(addWantToRead).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve!();
    });
  });
});
