"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

import { authContent } from "@/content/auth";
import { cn } from "@/lib/utils";

type AuthTab = "login" | "signup";

interface AuthPanelProps {
  initialTab: AuthTab;
  redirectUrl: string | null;
}

export function AuthPanel({ initialTab, redirectUrl }: AuthPanelProps) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const isLogin = tab === "login";
  const { tabs, login, signup } = authContent;
  const eyebrow = isLogin ? login.eyebrow : signup.eyebrow;
  const switchPrompt = isLogin ? login.switchPrompt : signup.switchPrompt;
  const fallbackRedirectUrl = redirectUrl ?? "/auth/redirect";

  return (
    <div className="w-full max-w-[420px] animate-[fadeSlide_.4s_ease]">
      <p className="mb-1.5 text-[13px] font-bold uppercase tracking-[.06em] text-accent-teal">
        {eyebrow}
      </p>

      <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-subtle p-1">
        {(["login", "signup"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "rounded-full px-3 py-2.5 text-sm font-bold transition-colors duration-200",
              tab === value
                ? "bg-surface text-copy-primary shadow-[0_1px_3px_rgba(11,31,38,.12)]"
                : "bg-transparent text-copy-muted hover:text-copy-primary"
            )}
          >
            {tabs[value]}
          </button>
        ))}
      </div>

      {isLogin ? (
        <SignIn key="login" routing="hash" fallbackRedirectUrl={fallbackRedirectUrl} />
      ) : (
        <SignUp key="signup" routing="hash" fallbackRedirectUrl={fallbackRedirectUrl} />
      )}

      <p className="mt-[22px] text-center text-sm text-copy-secondary">
        {switchPrompt.question}{" "}
        <button
          type="button"
          onClick={() => setTab(isLogin ? "signup" : "login")}
          className="font-bold text-brand hover:text-brand-hover"
        >
          {switchPrompt.action}
        </button>
      </p>
    </div>
  );
}
