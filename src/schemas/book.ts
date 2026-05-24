import { z } from "zod";
import { extractHashtags, MAX_HASHTAGS } from "@/lib/hashtag";

export const MAX_PURCHASE_LINKS = 3;
export const MAX_PURCHASE_LINK_LENGTH = 1000;

// 空文字は許容する（送信時にフィルタする）。
// 入力ありの場合のみ http(s):// で始まるかと長さを検証する。
const purchaseLinkSchema = z
  .string()
  .max(MAX_PURCHASE_LINK_LENGTH, "URLは1000文字以内で入力してください")
  .refine(
    (v) => v === "" || /^https?:\/\//.test(v),
    "http(s)://で始まるURLを入力してください",
  );

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
  purchase_links: z
    .array(purchaseLinkSchema)
    .max(
      MAX_PURCHASE_LINKS,
      `購入リンクは${MAX_PURCHASE_LINKS}件まで登録できます`,
    ),
});

export type BookPostFormData = z.infer<typeof bookPostSchema>;
