import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from "../client";
import { checkUsername } from "../users";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
});

describe("checkUsername", () => {
  it("正しいエンドポイントにGETリクエストを送る", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ available: true });
    await checkUsername("testuser");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/username/check?value=testuser",
    );
  });

  it("available: true のとき { available: true } を返す", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ available: true });
    const result = await checkUsername("testuser");
    expect(result).toEqual({ available: true });
  });

  it("available: false のとき { available: false } を返す", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ available: false });
    const result = await checkUsername("taken_user");
    expect(result).toEqual({ available: false });
  });

  it("特殊文字をURLエンコードして送る", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ available: true });
    await checkUsername("test user");
    expect(apiGet).toHaveBeenCalledWith(
      "/v1/users/username/check?value=test%20user",
    );
  });
});
