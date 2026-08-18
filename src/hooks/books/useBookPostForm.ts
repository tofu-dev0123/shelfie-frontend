import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBook } from "@/lib/api/books";
import { bookPostSchema, type BookPostFormData } from "@/schemas/book";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import { useMe } from "@/hooks/useMe";
import type { Book } from "@/types/book";

/**
 * 書籍投稿フォームのフック。
 * 文字数超過のエラーを送信前に気づかせるため mode は "onBlur" を指定している。
 * @param selectedBook - 選択済みの本（nullになったらフォームをリセットする）
 * @returns register, onSubmit, errors, isSubmitting, content
 */
export const useBookPostForm = (selectedBook: Book | null) => {
  const router = useRouter();
  const { data: me } = useMe(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<BookPostFormData>({
    resolver: zodResolver(bookPostSchema),
    mode: "onBlur",
    defaultValues: { content: "" },
  });

  // 本の選択が解除されたらフォームをリセットする
  useEffect(() => {
    if (!selectedBook) {
      reset();
    }
  }, [selectedBook, reset]);

  const content = useWatch({ control, name: "content" });

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedBook || !me?.username) return;
    try {
      await createBook({
        isbn: selectedBook.isbn,
        content: data.content,
      });
      toast.success(MESSAGES.BOOK.CREATE_SUCCESS);
      router.push(`/users/${me.username}`);
    } catch {
      logger.error("本の投稿失敗", { endpoint: API_ENDPOINTS.ME_BOOKS });
      toast.error(MESSAGES.BOOK.CREATE_ERROR);
    }
  });

  return {
    register,
    onSubmit,
    errors,
    isSubmitting,
    content,
  };
};
