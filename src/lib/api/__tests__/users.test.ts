import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiDelete: vi.fn(),
}));

import { apiGet, apiPost, apiDelete } from "../client";
import { getUser, checkUsername, followUser, unfollowUser } from "../users";

beforeEach(() => {
  vi.mocked(apiGet).mockReset();
  vi.mocked(apiPost).mockReset();
  vi.mocked(apiDelete).mockReset();
});

describe("getUser", () => {
  it("正しいエンドポイントにGETリクエストを送る", async () => {
    vi.mocked(apiGet).mockResolvedValueOnce({ id: 1, username: "testuser" });
    await getUser("testuser");
    expect(apiGet).toHaveBeenCalledWith("/v1/users/testuser");
  });

  it("レスポンスをそのまま返す", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      nickname: "テストユーザー",
    };
    vi.mocked(apiGet).mockResolvedValueOnce(mockUser);
    const result = await getUser("testuser");
    expect(result).toEqual(mockUser);
  });
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

describe("followUser", () => {
  it("正しいエンドポイントにPOSTリクエストを送る", async () => {
    vi.mocked(apiPost).mockResolvedValueOnce(undefined);
    await followUser("testuser");
    expect(apiPost).toHaveBeenCalledWith("/v1/me/follows/testuser");
  });
});

describe("unfollowUser", () => {
  it("正しいエンドポイントにDELETEリクエストを送る", async () => {
    vi.mocked(apiDelete).mockResolvedValueOnce(undefined);
    await unfollowUser("testuser");
    expect(apiDelete).toHaveBeenCalledWith("/v1/me/follows/testuser");
  });
});
