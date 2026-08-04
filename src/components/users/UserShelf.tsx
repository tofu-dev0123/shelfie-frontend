"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/useMe";
import { useUser } from "@/hooks/users/useUser";
import type { User } from "@/types/user";
import { ShelfHeader } from "./ShelfHeader";
import { BookShelf } from "./BookShelf";

type Props = {
  username: string;
  fallbackUser: User;
};

export function UserShelf({ username, fallbackUser }: Props) {
  const { isSignedIn } = useAuth();
  const { data: user } = useUser(username, fallbackUser);
  const { data: me } = useMe(isSignedIn);

  // useMe解決後にusernameを比較してis_meを判定する
  // 未解決の間はfalse（自分向けUIが後から出現するフラッシュは許容）
  const isMe = !!me && me.username === username;

  if (!user) return null;

  return (
    <>
      <ShelfHeader user={user} isMe={isMe} isLoggedIn={isSignedIn} />
      <BookShelf username={username} isMe={isMe} />
    </>
  );
}
