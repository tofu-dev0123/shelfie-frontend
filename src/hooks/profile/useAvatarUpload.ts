"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { uploadAvatar, deleteAvatar } from "@/lib/api/users";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";
import type { Me, User } from "@/types/user";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const withCacheBuster = (url: string | null): string | null =>
  url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : null;

/**
 * アバター画像のアップロード・削除を扱うフック。
 * 成功時は POST/DELETE のレスポンスを使って useMe / useUser のキャッシュを
 * 楽観更新する。アバター URL はバックエンドでも毎回ユニーク化されるが、
 * 念のため cache-buster クエリも付与しブラウザキャッシュに古い画像が
 * 残らないようにしている。
 * @param username - useUser キャッシュ更新用のユーザー名
 */
export const useAvatarUpload = (username: string) => {
  const { mutate } = useSWRConfig();
  const [isUploading, setIsUploading] = useState(false);

  const applyAvatarUrl = (avatarUrl: string | null) => {
    const next = withCacheBuster(avatarUrl);
    return Promise.all([
      mutate<Me>(
        API_ENDPOINTS.ME,
        (current) => (current ? { ...current, avatar_url: next } : current),
        { revalidate: false },
      ),
      mutate<User>(
        API_ENDPOINTS.USER(username),
        (current) => (current ? { ...current, avatar_url: next } : current),
        { revalidate: false },
      ),
    ]);
  };

  const handleUpload = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(MESSAGES.USER.AVATAR_TYPE_ERROR);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(MESSAGES.USER.AVATAR_SIZE_ERROR);
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAvatar(file);
      await applyAvatarUrl(response.avatar_url);
      toast.success(MESSAGES.USER.AVATAR_UPLOAD_SUCCESS);
    } catch {
      logger.error("アバターアップロード失敗", {
        endpoint: API_ENDPOINTS.ME_AVATAR,
      });
      toast.error(MESSAGES.USER.AVATAR_UPLOAD_ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsUploading(true);
    try {
      await deleteAvatar();
      await applyAvatarUrl(null);
      toast.success(MESSAGES.USER.AVATAR_DELETE_SUCCESS);
    } catch {
      logger.error("アバター削除失敗", {
        endpoint: API_ENDPOINTS.ME_AVATAR,
      });
      toast.error(MESSAGES.USER.AVATAR_DELETE_ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleUpload, handleDelete };
};
