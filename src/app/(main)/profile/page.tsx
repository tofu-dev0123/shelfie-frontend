"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/useMe";
import { ProfileEditor } from "@/components/profile/ProfileEditor";

export default function ProfilePage() {
  const { isSignedIn, isInitializing } = useAuth();
  const { data: me, isLoading } = useMe(isSignedIn);

  if (isInitializing || isLoading || !me) return null;
  return <ProfileEditor me={me} />;
}
