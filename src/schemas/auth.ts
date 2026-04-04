import { z } from "zod";

export const signupFormSchema = z.object({
  username: z
    .string()
    .min(3, "3文字以上で入力してください")
    .max(20, "20文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_]+$/, "半角英数字・アンダースコアのみ使用できます")
    .regex(/^(?!.*__).+$/, "アンダースコアを連続して使用することはできません"),
  nickname: z
    .string()
    .min(1, "ニックネームを入力してください")
    .max(50, "50文字以内で入力してください"),
});

export type SignupFormData = z.infer<typeof signupFormSchema>;
