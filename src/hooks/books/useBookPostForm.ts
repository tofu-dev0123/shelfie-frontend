import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
 * @param selectedBook - 選択済みの本（nullになったらフォームをリセットする）
 * @returns register, onSubmit, errors, isSubmitting, content, selectedTags, toggleTag, tagFilter, setTagFilter
 */
export const useBookPostForm = (selectedBook: Book | null) => {
  const router = useRouter();
  const { data: me } = useMe(true);
  const [tagFilter, setTagFilter] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<BookPostFormData>({
    resolver: zodResolver(bookPostSchema),
    defaultValues: { content: "", tags: [] },
  });

  // 本の選択が解除されたらフォームをリセットする
  useEffect(() => {
    if (!selectedBook) {
      reset();
      setTagFilter("");
    }
  }, [selectedBook, reset]);

  const content = watch("content");
  const selectedTags = watch("tags");

  const toggleTag = (tagName: string) => {
    const current = getValues("tags");
    if (current.includes(tagName)) {
      setValue("tags", current.filter((t) => t !== tagName), {
        shouldValidate: true,
      });
    } else {
      setValue("tags", [...current, tagName], { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedBook || !me?.username) return;
    try {
      await createBook({
        isbn: selectedBook.isbn,
        content: data.content,
        tags: data.tags,
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
    selectedTags,
    toggleTag,
    tagFilter,
    setTagFilter,
  };
};
