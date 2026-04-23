"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { followUser, unfollowUser } from "@/lib/api/users";
import { API_ENDPOINTS } from "@/constants/api";
import { MESSAGES } from "@/constants/messages";
import { logger } from "@/lib/logger";

/**
 * フォロー・アンフォロー操作を管理するフック。
 * is_followingの初期値は取得できないためfalse（未フォロー）をデフォルトとする。
 * APIレスポンスを受けてからUIを更新する（楽観的更新なし）。
 * @param username - 操作対象のユーザー名
 * @returns isFollowing, isPending, handleFollow
 */
export const useFollow = (username: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  const handleFollow = async () => {
    setIsPending(true);
    try {
      if (isFollowing) {
        await unfollowUser(username);
        setIsFollowing(false);
        toast.success(MESSAGES.USER.UNFOLLOW_SUCCESS);
      } else {
        await followUser(username);
        setIsFollowing(true);
        toast.success(MESSAGES.USER.FOLLOW_SUCCESS);
      }
      mutate(API_ENDPOINTS.USER(username));
    } catch {
      logger.error("フォロー操作失敗", {
        endpoint: API_ENDPOINTS.USER_FOLLOW(username),
      });
      toast.error(
        isFollowing ? MESSAGES.USER.UNFOLLOW_ERROR : MESSAGES.USER.FOLLOW_ERROR,
      );
    } finally {
      setIsPending(false);
    }
  };

  return { isFollowing, isPending, handleFollow };
};
