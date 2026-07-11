import Image from "next/image";
import { MapPin } from "lucide-react";

import { authContent } from "@/content/auth";

/** Right-hand split-screen panel — industrial photo, gradients, pill badge, and stat row. */
export function AuthPhotoPanel() {
  const { photoPanel } = authContent;

  return (
    <div className="relative hidden min-h-dvh overflow-hidden bg-[#0B1F26] min-[900px]:block">
      <Image
        src="/images/hero-anelo.png"
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover [filter:saturate(.82)_contrast(.96)_brightness(.9)]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,38,.28)_0%,rgba(11,31,38,.15)_40%,rgba(11,31,38,.72)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,86,120,.34)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="relative flex min-h-dvh flex-col justify-between p-8 lg:p-14">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[.18] bg-white/[.14] px-4 py-2 text-[13px] font-bold text-white backdrop-blur-[6px]">
          <MapPin className="h-3.5 w-3.5" />
          {photoPanel.pill}
        </span>

        <div>
          <h2 className="max-w-[15ch] text-balance text-[clamp(26px,2.8vw,40px)] font-extrabold leading-[1.14] tracking-[-.02em] text-white">
            {photoPanel.headingPrefix}
            <em className="font-serif-accent italic font-normal text-[#8FE3D6]">
              {photoPanel.headingEmphasis}
            </em>
          </h2>
          <ul className="mt-5 flex flex-wrap items-center gap-2.5 text-sm font-bold text-white/90">
            {photoPanel.stats.map((stat, index) => (
              <li key={index} className="flex items-center gap-2.5">
                {index > 0 ? (
                  <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden />
                ) : null}
                {"value" in stat && stat.value ? (
                  <span>
                    <span className="text-2xl font-extrabold text-white">
                      {stat.value}
                    </span>{" "}
                    {stat.label}
                  </span>
                ) : (
                  stat.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
