import { notFound } from "next/navigation";
import axios from "axios";
import { getUser } from "@/lib/api/users";
import { getUserBooks } from "@/lib/api/books";
import { pickHeroCovers } from "@/lib/heroCovers";
import { UserShelf } from "@/components/users/UserShelf";
import type { User } from "@/types/user";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: Props) {
  const { username } = await params;

  let user: User;
  try {
    user = await getUser(username);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  // ヒーロー背景の書影は初期HTMLで確定させたいので、本棚の1ページ目もサーバーで取得する
  const firstPage = await getUserBooks(username);

  // SWRのfallbackDataとして渡すことで、クライアント側の初回フェッチを省略する
  return (
    <UserShelf
      username={username}
      fallbackUser={user}
      fallbackBooks={firstPage}
      heroCoverUrls={pickHeroCovers(firstPage.items)}
    />
  );
}
