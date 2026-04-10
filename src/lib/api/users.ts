import { apiGet, apiPost, apiDelete, serverGet } from "./client";
import { API_ENDPOINTS } from "@/constants/api";
import type { User } from "@/types/user";

/**
 * ユーザー情報を取得する。
 * tokenを渡した場合はServer Components用のサーバーサイドリクエストを使用する。
 * is_meおよびis_followingフラグはRailsがアクセストークンをもとに判定して返す。
 * @param username - ユーザー名
 * @param token - Railsアクセストークン（Server Componentsから呼ぶ場合に指定）
 * @returns ユーザー情報
 * @throws ユーザーが存在しない場合は404エラー
 */
export const getUser = (username: string, token?: string): Promise<User> =>
  token
    ? serverGet(API_ENDPOINTS.USER(username), token)
    : apiGet(API_ENDPOINTS.USER(username));

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
