import {
  apiGet,
  apiPost,
  apiPostMultipart,
  apiPatch,
  apiDelete,
} from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { User } from "@/types/user";

type UpdateMeInput = {
  nickname: string;
  bio: string | null;
  links: string[];
};

type UpdateMeResponse = {
  nickname: string;
  bio: string | null;
  links: string[];
};

type AvatarResponse = {
  avatar_url: string | null;
};

/**
 * ユーザーの公開情報を取得する。認証不要。
 * is_me・is_followingは含まない。認証状態に依存するUIはクライアントで判定する。
 * @param username - ユーザー名
 * @returns ユーザーの公開情報
 * @throws ユーザーが存在しない場合は404エラー
 */
export const getUser = (username: string): Promise<User> =>
  apiGet(API_ENDPOINTS.USER(username));

/**
 * ユーザー名の重複チェックを行う。
 * @param username - チェックするユーザー名
 * @returns available: true = 使用可能, false = 使用不可（重複）
 */
export const checkUsername = (
  username: string,
): Promise<{ available: boolean }> =>
  apiGet(
    `${API_ENDPOINTS.USERNAME_CHECK}?value=${encodeURIComponent(username)}`,
  );

/**
 * 指定ユーザーをフォローする。
 * @param username - フォロー対象のユーザー名
 * @throws フォロー失敗時にエラー
 */
export const followUser = (username: string): Promise<void> =>
  apiPost(API_ENDPOINTS.USER_FOLLOW(username));

/**
 * 指定ユーザーのフォローを解除する。
 * @param username - フォロー解除対象のユーザー名
 * @throws フォロー解除失敗時にエラー
 */
export const unfollowUser = (username: string): Promise<void> =>
  apiDelete(API_ENDPOINTS.USER_FOLLOW(username));

/**
 * 自分のプロフィール（nickname / bio / links）を更新する。
 * @param data - 更新内容
 * @returns 更新後のプロフィール
 */
export const updateMe = (data: UpdateMeInput): Promise<UpdateMeResponse> =>
  apiPatch(API_ENDPOINTS.ME, data);

/**
 * 自分のアバター画像をアップロードする。multipart/form-data で送信する。
 * @param file - 画像ファイル（JPEG / PNG / WebP、最大 5MB）
 * @returns 新しい avatar_url
 */
export const uploadAvatar = (file: File): Promise<AvatarResponse> => {
  const formData = new FormData();
  formData.append("avatar", file);
  return apiPostMultipart(API_ENDPOINTS.ME_AVATAR, formData);
};

/**
 * 自分のアバター画像を削除する。冪等。
 */
export const deleteAvatar = (): Promise<void> =>
  apiDelete(API_ENDPOINTS.ME_AVATAR);
