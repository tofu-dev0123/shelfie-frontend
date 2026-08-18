import { LoginOAuth } from "@/components/login/LoginOAuth";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <LoginOAuth error={error} />;
}
