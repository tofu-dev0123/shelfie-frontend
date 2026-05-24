import { z } from "zod";

// React Hook Form の useFieldArray は object 配列を要求するため、
// links は { url: string } のオブジェクト配列で扱う。
// API に送るときは url を flatten する。
const linkItemSchema = z.object({
  url: z.string().trim().url("正しいURL形式で入力してください"),
});

export const profileFormSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, "ニックネームを入力してください")
    .max(50, "50文字以内で入力してください"),
  bio: z.string().max(500, "500文字以内で入力してください"),
  links: z.array(linkItemSchema).max(10, "リンクは10件までです"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
