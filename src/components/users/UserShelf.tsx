"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/useMe";
import { useUser } from "@/hooks/users/useUser";
import type { User } from "@/types/user";
import type { BookPostsResponse } from "@/types/book";
import { ShelfHeader } from "./ShelfHeader";
import { BookShelf } from "./BookShelf";
import { UserShelfSkeleton } from "./UserShelfSkeleton";

type Props = {
  username: string;
  fallbackUser: User;
  fallbackBooks: BookPostsResponse;
  heroCoverUrls: string[];
};

export function UserShelf({
  username,
  fallbackUser,
  fallbackBooks,
  heroCoverUrls,
}: Props) {
  const { isSignedIn } = useAuth();
  const { data: user } = useUser(username, fallbackUser);
  const { data: me } = useMe(isSignedIn);

  // useMe解決後にusernameを比較してis_meを判定する
  // 未解決の間はfalse（自分向けUIが後から出現するフラッシュは許容）
  const isMe = !!me && me.username === username;

  // fallbackUser があるため通常は到達しないが、無表示でのレイアウトジャンプを避ける
  if (!user) return <UserShelfSkeleton />;

  return (
    <>
      <ShelfHeader user={user} isMe={isMe} coverUrls={heroCoverUrls} />
      <BookShelf
        username={username}
        isMe={isMe}
        fallbackBooks={fallbackBooks}
      />
    </>
  );
}
