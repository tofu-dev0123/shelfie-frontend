"use client";

import { useAuth } from "@clerk/nextjs";
import { useMe } from "@/hooks/useMe";
import { useUser } from "@/hooks/useUser";
import type { User } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { BookShelf } from "./BookShelf";

type Props = {
  username: string;
  fallbackUser: User;
};

export function UserProfile({ username, fallbackUser }: Props) {
  const { isSignedIn } = useAuth();
  const { data: user } = useUser(username, fallbackUser);
  const { data: me } = useMe(!!isSignedIn);

  // useMe解決後にusernameを比較してis_meを判定する
  // 未解決の間はfalse（読みたいタブが後から出現するフラッシュは許容）
  const isMe = !!me && me.username === username;

  if (!user) return null;

  return (
    <>
      <ProfileHeader user={user} isMe={isMe} isLoggedIn={!!isSignedIn} />
      <BookShelf username={username} isMe={isMe} />
    </>
  );
}
