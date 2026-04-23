import { notFound } from "next/navigation";
import axios from "axios";
import { getUser } from "@/lib/api/users";
import { UserShelf } from "@/components/users/UserShelf";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: Props) {
  const { username } = await params;

  let user;
  try {
    user = await getUser(username);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  // SWRのfallbackDataとして渡すことで、クライアント側の初回フェッチを省略する
  return <UserShelf username={username} fallbackUser={user} />;
}
