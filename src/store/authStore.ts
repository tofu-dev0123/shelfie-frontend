import { create } from "zustand";

export type AuthStatus =
  | "idle"
  | "initializing"
  | "authenticated"
  | "unauthenticated";

type AuthStore = {
  accessToken: string | null;
  status: AuthStatus;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  status: "idle",
  setAccessToken: (token) =>
    set({ accessToken: token, status: "authenticated" }),
  clearAccessToken: () => set({ accessToken: null, status: "unauthenticated" }),
  setStatus: (status) => set({ status }),
}));
