"use client";

import { useSSOCallback } from "@/hooks/auth/useSSOCallback";
import { Loading } from "@/components/ui/Loading";

export function SSOCallback() {
  useSSOCallback();

  return (
    <>
      <Loading />
      <div id="clerk-captcha" />
    </>
  );
}
