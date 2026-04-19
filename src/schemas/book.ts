import { z } from "zod";
import { extractHashtags, MAX_HASHTAGS } from "@/lib/hashtag";

export const bookPostSchema = z.object({
  content: z
    .string()
    .min(1, "コメントは必須です")
    .max(1000, "1000文字以内で入力してください")
    .superRefine((value, ctx) => {
      const count = extractHashtags(value).length;
      if (count <= MAX_HASHTAGS) return;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `タグは${MAX_HASHTAGS}個以内にしてください（現在${count}個）`,
      });
    }),
});

export type BookPostFormData = z.infer<typeof bookPostSchema>;
