import { z } from "zod";

export const bookPostSchema = z.object({
  content: z
    .string()
    .min(1, "コメントは必須です")
    .max(1000, "1000文字以内で入力してください"),
});

export type BookPostFormData = z.infer<typeof bookPostSchema>;
