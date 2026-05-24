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
 * タグは本文中のハッシュタグから派生するため、フォーム値としては content と purchase_links を管理する。
 * URL バリデーションを blur 時に走らせるため mode は "onBlur" を指定している。
 * @param selectedBook - 選択済みの本（nullになったらフォームをリセットする）
 * @returns register, handleSubmit, control, setValue, onSubmit, errors, isSubmitting, content
 */
export const useBookPostForm = (selectedBook: Book | null) => {
  const router = useRouter();
  const { data: me } = useMe(true);

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
    defaultValues: { content: "", purchase_links: [] },
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
    // 空欄行はサーバーに送らない
    const purchaseLinks = data.purchase_links
      .map((url) => url.trim())
      .filter((url) => url !== "");
    try {
      await createBook({
        isbn: selectedBook.isbn,
        content: data.content,
        purchase_links: purchaseLinks,
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
    control,
    setValue,
    onSubmit,
    errors,
    isSubmitting,
    content,
  };
};
