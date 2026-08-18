"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/useMe";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

export default function ProfilePage() {
  const { isSignedIn, isInitializing } = useAuth();
  const { data: me, isLoading } = useMe(isSignedIn);

  if (isInitializing || isLoading || !me) return <ProfileSkeleton />;
  return <ProfileEditor me={me} />;
}
