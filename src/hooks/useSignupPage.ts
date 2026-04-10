import { useEffect, useRef, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { login } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

export type SignupView = "oauth" | "form" | "loading" | "error";

/**
 * サインアップページの表示状態を管理するフック。
 * Clerk の認証状態に応じて OAuth 画面・プロフィール設定フォームを切り替える。
 * Rails 連携エラー時はエラー画面を表示し、再試行またはサインアウトを選択できる。
 * @returns view - 現在表示すべき画面の種別
 * @returns handleRetry - Rails 連携を再試行する
 * @returns handleGoToLogin - Clerk セッションをクリアしてログイン画面へ戻る
 */
export const useSignupPage = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  // Railsログイン成功後にフォームを表示するためのフラグ
  const [formReady, setFormReady] = useState(false);
  // Rails 連携失敗時にエラー画面を表示するためのフラグ
  const [loginFailed, setLoginFailed] = useState(false);
  // ページ滞在中に login() を複数回呼ばないためのフラグ
  const loginAttempted = useRef(false);

  // isLoaded・isSignedIn から同期的に計算できる状態はEffectを介さず派生させる
  const view: SignupView = !isLoaded
    ? "loading"
    : !isSignedIn
      ? "oauth"
      : loginFailed
        ? "error"
        : formReady
          ? "form"
          : "loading";

  useEffect(() => {
    if (view === "oauth") router.push("/signup");
  }, [view, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || loginAttempted.current) return;
    loginAttempted.current = true;

    const tryLogin = async () => {
      try {
        const token = await getToken();
        if (!token) {
          toast.error(MESSAGES.AUTH.SIGNUP_ERROR);
          return;
        }
        const result = await login(token);
        if (result === "ok") {
          router.push("/");
        } else {
          setFormReady(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error(MESSAGES.AUTH.LOGIN_AUTH_ERROR);
        } else {
          toast.error(MESSAGES.AUTH.LOGIN_ERROR);
        }
        setLoginFailed(true);
      }
    };

    tryLogin();
  }, [isSignedIn, isLoaded, getToken, router]);

  const handleRetry = () => {
    setLoginFailed(false);
    loginAttempted.current = false;
  };

  const handleGoToLogin = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch {
      logger.error("サインアウト失敗（エラー画面からの遷移）");
      router.push("/login");
    }
  };

  return { view, handleRetry, handleGoToLogin };
};
