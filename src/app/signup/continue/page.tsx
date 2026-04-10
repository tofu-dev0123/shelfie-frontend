"use client";

import { useSignupPage } from "@/hooks/useSignupPage";
import { SignupForm } from "@/components/signup/SignupForm";
import { SignupError } from "@/components/signup/SignupError";
import { Loading } from "@/components/ui/Loading";

export default function SignupContinuePage() {
  const { view, handleRetry, handleGoToLogin } = useSignupPage();

  if (view === "loading" || view === "oauth") return <Loading />;
  if (view === "error")
    return <SignupError onRetry={handleRetry} onGoToLogin={handleGoToLogin} />;
  return <SignupForm />;
}
