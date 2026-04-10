import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("swr", () => ({
  default: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
}));

vi.mock("@/lib/api/users", () => ({
  getUser: vi.fn(),
}));

import useSWR from "swr";
import { getUser } from "@/lib/api/users";
import { useUser } from "../useUser";

beforeEach(() => {
  vi.mocked(useSWR).mockClear();
});

describe("useUser", () => {
  it("正しいエンドポイントをキーに渡す", () => {
    useUser("testuser");
    expect(useSWR).toHaveBeenCalledWith(
      "/v1/users/testuser",
      expect.any(Function),
      expect.any(Object),
    );
  });

  it("fetcherが getUser を呼ぶ", async () => {
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      username: "testuser",
    } as never);

    useUser("testuser");

    const fetcher = vi.mocked(useSWR).mock.calls[0][1] as () => Promise<unknown>;
    await fetcher();
    expect(getUser).toHaveBeenCalledWith("testuser");
  });

  it("fallbackData が渡されたとき options に含まれる", () => {
    const fallback = { id: 1, username: "testuser" } as never;
    useUser("testuser", fallback);
    expect(useSWR).toHaveBeenCalledWith(
      "/v1/users/testuser",
      expect.any(Function),
      { fallbackData: fallback },
    );
  });

  it("fallbackData なしのとき options に undefined が渡される", () => {
    useUser("testuser");
    expect(useSWR).toHaveBeenCalledWith(
      "/v1/users/testuser",
      expect.any(Function),
      { fallbackData: undefined },
    );
  });
});
