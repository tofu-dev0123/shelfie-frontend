import { z } from "zod";

export const bookPostSchema = z.object({
  content: z
    .string()
    .min(1, "コメントは必須です")
    .max(1000, "1000文字以内で入力してください"),
  tags: z.array(z.string()).max(5, "タグは5個以内で選択してください"),
});

export type BookPostFormData = z.infer<typeof bookPostSchema>;
