import { useReducer, useEffect } from "react";
import axios from "axios";
import { checkUsername } from "@/lib/api/users";

export type UsernameCheckStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

type Action =
  | { type: "RESET" }
  | { type: "START_CHECK" }
  | { type: "RESOLVE"; available: boolean }
  | { type: "INVALID" }
  | { type: "ERROR" };

export const reducer = (
  _state: UsernameCheckStatus,
  action: Action,
): UsernameCheckStatus => {
  switch (action.type) {
    case "RESET":
      return "idle";
    case "START_CHECK":
      return "checking";
    case "RESOLVE":
      return action.available ? "available" : "taken";
    case "INVALID":
      return "invalid";
    case "ERROR":
      return "idle";
  }
};

/**
 * ユーザー名の重複チェックを行うフック。入力変更から400msのdebounceを設ける。
 * 3文字未満または形式不正の場合はAPIを呼ばずidleに戻す（Zodバリデーションに委ねる）。
 * @param username - チェックするユーザー名（RHFのwatch値）
 * @returns status - チェック状態
 */
export const useUsernameCheck = (username: string) => {
  const [status, dispatch] = useReducer(reducer, "idle");

  useEffect(() => {
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      dispatch({ type: "RESET" });
      return;
    }

    dispatch({ type: "START_CHECK" });

    const timer = setTimeout(async () => {
      try {
        const { available } = await checkUsername(username);
        dispatch({ type: "RESOLVE", available });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          dispatch({ type: "INVALID" });
        } else {
          dispatch({ type: "ERROR" });
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  return { status };
};
