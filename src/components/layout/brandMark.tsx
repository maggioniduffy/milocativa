import Link from "next/link";

import { siteContent } from "@/content/site";

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-primary-foreground">
        M
      </span>
      <span className="text-base font-bold tracking-tight text-copy-primary">
        {siteContent.brand.name}
      </span>
    </Link>
  );
}
