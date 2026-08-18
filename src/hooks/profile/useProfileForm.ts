"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { profileFormSchema, type ProfileFormData } from "@/schemas/user";
import { updateMe } from "@/lib/api/users";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { Me } from "@/types/user";

/**
 * プロフィール（nickname / bio / links）編集フォームを扱うフック。
 * 保存成功時は useMe と useUser のキャッシュを再取得し、本棚ページに遷移する。
 * @param me - 初期値として表示する現在のプロフィール情報
 */
export const useProfileForm = (me: Me) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nickname: me.nickname,
      bio: me.bio ?? "",
      links: me.links.map((url) => ({ url })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMe({
        nickname: data.nickname,
        bio: data.bio?.trim() ? data.bio.trim() : null,
        links: data.links.map((link) => link.url),
      });
      await Promise.all([
        mutate(API_ENDPOINTS.ME),
        mutate(API_ENDPOINTS.USER(me.username)),
      ]);
      toast.success(MESSAGES.USER.UPDATE_SUCCESS);
      router.push(`/users/${me.username}`);
    } catch {
      logger.error("プロフィール更新失敗", { endpoint: API_ENDPOINTS.ME });
      toast.error(MESSAGES.USER.UPDATE_ERROR);
    }
  });

  const handleCancel = () => router.push(`/users/${me.username}`);
  const handleAddLink = () => append({ url: "" });
  const handleRemoveLink = (index: number) => remove(index);

  return {
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    fields,
    onSubmit,
    handleCancel,
    handleAddLink,
    handleRemoveLink,
  };
};
