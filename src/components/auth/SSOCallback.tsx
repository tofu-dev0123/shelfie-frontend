"use client";

import { useSSOCallback } from "@/hooks/useSSOCallback";

export function SSOCallback() {
  useSSOCallback();

  return (
    <div>
      <div id="clerk-captcha" />
    </div>
  );
}
