import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { getMe } from "../me";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

describe("getMe", () => {
  it("正しいエンドポイントにGETリクエストを送る", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ id: 1, username: "testuser" });
    await getMe();
    expect(apiGet).toHaveBeenCalledWith("/v1/me");
  });

  it("レスポンスをそのまま返す", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      nickname: "テストユーザー",
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockUser);
    const result = await getMe();
    expect(result).toEqual(mockUser);
  });
});
