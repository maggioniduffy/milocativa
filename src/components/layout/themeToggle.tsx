"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { siteContent } from "@/content/site";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={siteContent.nav.themeToggle}
      className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border-[1.5px] border-surface-border bg-subtle text-copy-primary transition-colors hover:bg-subtle-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
      ) : (
        <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
      )}
    </button>
  );
}
