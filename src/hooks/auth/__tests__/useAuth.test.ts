// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "../useAuth";

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, status: "idle" });
});

describe("useAuth", () => {
  it("status が idle のとき isInitializing=true, isSignedIn=false", () => {
    useAuthStore.setState({ status: "idle" });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isInitializing).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
  });

  it("status が initializing のとき isInitializing=true, isSignedIn=false", () => {
    useAuthStore.setState({ status: "initializing" });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isInitializing).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
  });

  it("status が authenticated のとき isInitializing=false, isSignedIn=true", () => {
    useAuthStore.setState({ status: "authenticated" });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isInitializing).toBe(false);
    expect(result.current.isSignedIn).toBe(true);
  });

  it("status が unauthenticated のとき isInitializing=false, isSignedIn=false", () => {
    useAuthStore.setState({ status: "unauthenticated" });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isInitializing).toBe(false);
    expect(result.current.isSignedIn).toBe(false);
  });
});
