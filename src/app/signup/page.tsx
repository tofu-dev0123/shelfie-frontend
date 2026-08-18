"use client";

import { useSignupPage } from "@/hooks/signup/useSignupPage";
import { SignupForm } from "@/components/signup/SignupForm";
import { SignupError } from "@/components/signup/SignupError";
import { Loading } from "@/components/ui/Loading";

export default function SignupPage() {
  const { view, context, handleRetry, handleGoToLogin } = useSignupPage();

  if (view === "error")
    return <SignupError onRetry={handleRetry} onGoToLogin={handleGoToLogin} />;
  if (view === "loading" || !context) return <Loading />;
  return (
    <SignupForm
      email={context.email}
      defaultNickname={context.nickname_suggestion}
    />
  );
}
