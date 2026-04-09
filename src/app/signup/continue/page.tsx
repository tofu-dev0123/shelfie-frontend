"use client";

import { useSignupPage } from "@/hooks/useSignupPage";
import { SignupForm } from "@/components/signup/SignupForm";
import { Loading } from "@/components/ui/Loading";

export default function SignupContinuePage() {
  const { view } = useSignupPage();

  if (view === "loading" || view === "oauth") return <Loading />;
  return <SignupForm />;
}
