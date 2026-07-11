import Link from "next/link";

import { siteContent } from "@/content/site";

/** Building glyph from the brand design — a logo asset, not a UI icon. */
function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand text-primary-foreground">
        <BrandGlyph className="h-[18px] w-[18px]" />
      </span>
      <span className="text-base font-extrabold tracking-[.04em] text-copy-primary sm:text-[17px]">
        {siteContent.brand.name}
      </span>
    </Link>
  );
}
