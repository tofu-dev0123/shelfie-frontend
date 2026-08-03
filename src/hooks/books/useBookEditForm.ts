import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { getBookPostDetail, updateBook } from "@/lib/api/books";
import { bookPostSchema, type BookPostFormData } from "@/schemas/book";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import { useMe } from "@/hooks/useMe";
import type { BookPostDetail } from "@/types/book";

/**
 * 書籍投稿編集フォームのフック。
 * 既存投稿を取得してフォーム初期値にセットし、更新後はユーザーの本棚へ遷移する。
 * @param isbn - 編集対象投稿のISBN-13
 * @returns post, isLoading, isUnauthorized, register, control, setValue, onSubmit, errors, isSubmitting, content
 */
export const useBookEditForm = (isbn: string) => {
  const router = useRouter();
  const { data: me, isLoading: isMeLoading } = useMe(true);

  const swrKey = me?.username
    ? API_ENDPOINTS.USER_BOOK(me.username, isbn)
    : null;

  const {
    data: post,
    error,
    isLoading: isPostLoading,
  } = useSWR<BookPostDetail>(swrKey, () =>
    getBookPostDetail(me!.username, isbn),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
  } = useForm<BookPostFormData>({
    resolver: zodResolver(bookPostSchema),
    mode: "onBlur",
    defaultValues: { content: "" },
  });

  // 投稿取得後にフォームへ初期値を流し込む
  useEffect(() => {
    if (!post) return;
    reset({ content: post.content ?? "" });
  }, [post, reset]);

  const content = useWatch({ control, name: "content" });

  const onSubmit = handleSubmit(async (data) => {
    if (!me?.username) return;
    try {
      await updateBook(isbn, { content: data.content });
      toast.success(MESSAGES.BOOK.UPDATE_SUCCESS);
      router.push(`/users/${me.username}/books/${isbn}`);
    } catch {
      logger.error("本の更新失敗", { endpoint: API_ENDPOINTS.ME_BOOK(isbn) });
      toast.error(MESSAGES.BOOK.UPDATE_ERROR);
    }
  });

  return {
    post,
    isLoading: isMeLoading || isPostLoading,
    error,
    register,
    control,
    setValue,
    onSubmit,
    errors,
    isSubmitting,
    content,
  };
};
