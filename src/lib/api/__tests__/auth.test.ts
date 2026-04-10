import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  serverPost: vi.fn(),
  apiDelete: vi.fn(),
}));

vi.mock("@/store/authStore", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      setAccessToken: vi.fn(),
      clearAccessToken: vi.fn(),
    })),
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { serverPost, apiDelete } from "../client";
import { useAuthStore } from "@/store/authStore";
import { login, signup, logout } from "../auth";

beforeEach(() => {
  vi.mocked(serverPost).mockReset();
  vi.mocked(apiDelete).mockReset();
  vi.mocked(useAuthStore.getState).mockReturnValue({
    setAccessToken: vi.fn(),
    clearAccessToken: vi.fn(),
    accessToken: null,
  });
});

describe("login", () => {
  it("ログイン成功時に 'ok' を返し、アクセストークンを保存する", async () => {
    const setAccessToken = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      setAccessToken,
      clearAccessToken: vi.fn(),
      accessToken: null,
    });
    vi.mocked(serverPost).mockResolvedValueOnce({ access_token: "token123" });

    const result = await login("clerk-token");

    expect(result).toBe("ok");
    expect(serverPost).toHaveBeenCalledWith("/v1/auth/login", "clerk-token");
    expect(setAccessToken).toHaveBeenCalledWith("token123");
  });

  it("404エラーのとき 'not_found' を返す", async () => {
    const axiosError = Object.assign(new Error("Not Found"), {
      isAxiosError: true,
      response: { status: 404 },
    });
    vi.mocked(serverPost).mockRejectedValueOnce(axiosError);

    const result = await login("clerk-token");
    expect(result).toBe("not_found");
  });

  it("404以外のエラーはthrowする", async () => {
    vi.mocked(serverPost).mockRejectedValueOnce(new Error("Server Error"));
    await expect(login("clerk-token")).rejects.toThrow("Server Error");
  });
});

describe("signup", () => {
  it("正しいエンドポイントにPOSTリクエストを送る", async () => {
    const setAccessToken = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      setAccessToken,
      clearAccessToken: vi.fn(),
      accessToken: null,
    });
    vi.mocked(serverPost).mockResolvedValueOnce({ access_token: "token456" });

    const formData = { username: "testuser", nickname: "テスト" };
    await signup("clerk-token", formData);

    expect(serverPost).toHaveBeenCalledWith(
      "/v1/users",
      "clerk-token",
      formData,
    );
    expect(setAccessToken).toHaveBeenCalledWith("token456");
  });
});

describe("logout", () => {
  it("正しいエンドポイントにDELETEリクエストを送り、トークンをクリアする", async () => {
    const clearAccessToken = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      setAccessToken: vi.fn(),
      clearAccessToken,
      accessToken: null,
    });
    vi.mocked(apiDelete).mockResolvedValueOnce(undefined);

    await logout();

    expect(apiDelete).toHaveBeenCalledWith("/v1/auth/logout");
    expect(clearAccessToken).toHaveBeenCalled();
  });
});
