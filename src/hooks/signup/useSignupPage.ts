import { useCallback, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { getSignupContext } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { SignupContext } from "@/types/auth";

export type SignupView = "loading" | "form" | "error";

type State = {
  view: SignupView;
  context: SignupContext | null;
};

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; context: SignupContext }
  | { type: "FAIL" };

const INITIAL_STATE: State = { view: "loading", context: null };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START":
      return INITIAL_STATE;
    case "SUCCESS":
      return { view: "form", context: action.context };
    case "FAIL":
      return { view: "error", context: null };
  }
};

/**
 * サインアップページの表示状態を管理するフック。
 * signup_token（HttpOnly Cookie）を使って signup_context を取得し、
 * ニックネームのプリフィル値とセッションの有効性を得る。
 * @returns view - 現在表示すべき画面の種別
 * @returns context - プリフィルに使うメールアドレスとニックネーム候補
 * @returns handleRetry - signup_context の取得を再試行する
 * @returns handleGoToLogin - ログイン画面へ戻る
 */
export const useSignupPage = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // 初回マウント時に signup_context を二重に叩かないためのフラグ
  const hasFetched = useRef(false);

  const load = useCallback(async () => {
    try {
      dispatch({ type: "SUCCESS", context: await getSignupContext() });
    } catch (error) {
      // 401 は signup_token が無い、または10分の期限を過ぎた場合。
      // 再試行しても回復しないので OAuth からやり直してもらう
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logger.warn("signup_tokenが無効。ログイン画面へ戻す");
        toast.error(MESSAGES.AUTH.SIGNUP_SESSION_EXPIRED);
        router.replace("/login");
        return;
      }
      logger.error("サインアップコンテキストの取得失敗", {
        endpoint: axios.isAxiosError(error) ? error.config?.url : undefined,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      });
      toast.error(MESSAGES.AUTH.SIGNUP_SERVER_ERROR);
      dispatch({ type: "FAIL" });
    }
  }, [router]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    load();
  }, [load]);

  const handleRetry = () => {
    dispatch({ type: "START" });
    load();
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return {
    view: state.view,
    context: state.context,
    handleRetry,
    handleGoToLogin,
  };
};
