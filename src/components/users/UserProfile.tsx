import type { User } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { BookShelf } from "./BookShelf";

type Props = {
  user: User;
  isLoggedIn: boolean;
};

export function UserProfile({ user, isLoggedIn }: Props) {
  return (
    <>
      <ProfileHeader user={user} isLoggedIn={isLoggedIn} />
      <BookShelf username={user.username} isMe={user.is_me} />
    </>
  );
}
