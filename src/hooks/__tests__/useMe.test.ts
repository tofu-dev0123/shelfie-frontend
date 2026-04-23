import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("swr", () => ({
  default: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
}));

vi.mock("@/lib/api/me", () => ({
  getMe: vi.fn(),
}));

import useSWR from "swr";
import { getMe } from "@/lib/api/me";
import { useMe } from "../useMe";

beforeEach(() => {
  vi.mocked(useSWR).mockClear();
});

describe("useMe", () => {
  it("enabled=true のとき ME エンドポイントをキーに渡す", () => {
    useMe(true);
    expect(useSWR).toHaveBeenCalledWith("/v1/me", getMe);
  });

  it("enabled=false のとき null をキーに渡す", () => {
    useMe(false);
    expect(useSWR).toHaveBeenCalledWith(null, getMe);
  });
});
