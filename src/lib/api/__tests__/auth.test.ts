import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  authGet: vi.fn(),
  authPost: vi.fn(),
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
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { authGet, authPost, apiDelete } from "../client";
import { useAuthStore } from "@/store/authStore";
import { getSignupContext, signup, logout, refreshAccessToken } from "../auth";

const mockStore = (overrides = {}) => {
  const state = {
    setAccessToken: vi.fn(),
    clearAccessToken: vi.fn(),
    accessToken: null,
    status: "idle" as const,
    setStatus: vi.fn(),
    ...overrides,
  };
  vi.mocked(useAuthStore.getState).mockReturnValue(state);
  return state;
};

beforeEach(() => {
  vi.mocked(authGet).mockReset();
  vi.mocked(authPost).mockReset();
  vi.mocked(apiDelete).mockReset();
  mockStore();
});

describe("getSignupContext", () => {
  it("正しいエンドポイントにGETリクエストを送る", async () => {
    const context = {
      email: "test@example.com",
      nickname_suggestion: "テスト",
    };
    vi.mocked(authGet).mockResolvedValueOnce(context);

    const result = await getSignupContext();

    expect(authGet).toHaveBeenCalledWith("/v1/auth/signup_context");
    expect(result).toEqual(context);
  });

  it("signup_tokenが無効な場合のエラーはそのまま伝播する", async () => {
    const axiosError = Object.assign(new Error("Unauthorized"), {
      isAxiosError: true,
      response: { status: 401 },
    });
    vi.mocked(authGet).mockRejectedValueOnce(axiosError);

    await expect(getSignupContext()).rejects.toThrow("Unauthorized");
  });
});

describe("signup", () => {
  it("トークンを渡さずPOSTリクエストを送り、アクセストークンを保存する", async () => {
    const { setAccessToken } = mockStore();
    vi.mocked(authPost).mockResolvedValueOnce({ access_token: "token456" });

    const formData = { username: "testuser", nickname: "テスト" };
    await signup(formData);

    expect(authPost).toHaveBeenCalledWith("/v1/users", formData);
    expect(setAccessToken).toHaveBeenCalledWith("token456");
  });
});

describe("logout", () => {
  it("正しいエンドポイントにDELETEリクエストを送り、トークンをクリアする", async () => {
    const { clearAccessToken } = mockStore();
    vi.mocked(apiDelete).mockResolvedValueOnce(undefined);

    await logout();

    expect(apiDelete).toHaveBeenCalledWith("/v1/auth/logout");
    expect(clearAccessToken).toHaveBeenCalled();
  });
});

describe("refreshAccessToken", () => {
  it("成功時にtrueを返し、アクセストークンを保存する", async () => {
    const { setAccessToken } = mockStore();
    vi.mocked(authPost).mockResolvedValueOnce({ access_token: "refreshed" });

    const result = await refreshAccessToken();

    expect(authPost).toHaveBeenCalledWith("/v1/auth/refresh");
    expect(result).toBe(true);
    expect(setAccessToken).toHaveBeenCalledWith("refreshed");
  });

  it("失敗時はthrowせずfalseを返す", async () => {
    vi.mocked(authPost).mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(refreshAccessToken()).resolves.toBe(false);
  });
});
