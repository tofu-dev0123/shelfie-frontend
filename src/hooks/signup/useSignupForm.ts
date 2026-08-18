import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { signup } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { SignupFormData } from "@/schemas/auth";

/**
 * サインアップフォームの送信処理を担うフック。
 * 認証は signup_token（HttpOnly Cookie）が自動送信されるため、トークンは扱わない。
 * @returns onSubmit - フォーム送信ハンドラ
 */
export const useSignupForm = () => {
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
      router.push("/");
    } catch (error) {
      logger.error("サインアップ失敗");
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error(MESSAGES.AUTH.SIGNUP_VALIDATION_ERROR);
        return;
      }
      toast.error(MESSAGES.AUTH.SIGNUP_SERVER_ERROR);
    }
  };

  return { onSubmit };
};
