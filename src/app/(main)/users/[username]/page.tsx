import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { getUser } from "@/lib/api/users";
import { UserProfile } from "@/components/users/UserProfile";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  let user;
  try {
    user = await getUser(username, token ?? undefined);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  return <UserProfile user={user} isLoggedIn={!!token} />;
}
