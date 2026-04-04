import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { signup } from "@/lib/api/auth";
import { MESSAGES } from "@/constants/messages";
import type { SignupFormData } from "@/schemas/auth";

/**
 * サインアップフォームの送信処理を担うフック。
 * @returns onSubmit - フォーム送信ハンドラ
 */
export const useSignupForm = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error(MESSAGES.AUTH.SIGNUP_ERROR);
        return;
      }
      await signup(token, data);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error(MESSAGES.AUTH.SIGNUP_VALIDATION_ERROR);
      } else {
        toast.error(MESSAGES.AUTH.SIGNUP_SERVER_ERROR);
      }
    }
  };

  return { onSubmit };
};
