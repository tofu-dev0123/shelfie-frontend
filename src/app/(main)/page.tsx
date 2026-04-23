import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Landing } from "@/components/landing/Landing";
import { resolveUsernameByRefreshToken } from "@/lib/api/serverAuth";

export default async function Home() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    const username = await resolveUsernameByRefreshToken(refreshToken);
    if (username) {
      redirect(`/users/${username}`);
    }
  }

  return <Landing />;
}
