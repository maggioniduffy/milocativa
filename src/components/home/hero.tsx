import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";

/** Subtle SVG-noise grain over the hero, per the design (opacity .04). */
const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[.04]"
        style={{ backgroundImage: GRAIN_TEXTURE }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 -top-32 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,var(--accent-primary-dim)_0%,transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:gap-16 lg:py-24">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-dim px-4 py-1.5 text-[13px] font-bold text-brand">
              <MapPin className="h-3.5 w-3.5" />
              {hero.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-copy-primary sm:text-5xl lg:text-[56px]">
              {hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-[540px] text-base leading-relaxed text-copy-secondary [text-wrap:pretty] sm:text-lg">
              {hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.24} className="w-full sm:w-auto">
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-hover active:scale-[.97]"
              >
                {hero.primaryCta.label}
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border-[1.5px] border-surface-border px-7 py-3.5 text-base font-bold text-copy-primary transition hover:border-subtle-border hover:bg-subtle active:scale-[.97]"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <ul className="mt-3 flex flex-wrap items-center gap-2.5 text-sm font-semibold text-copy-muted">
              {hero.stats.map((stat, index) => (
                <li key={stat} className="flex items-center gap-2.5">
                  {index > 0 ? (
                    <span className="h-1 w-1 rounded-full bg-subtle-border" aria-hidden />
                  ) : null}
                  {stat}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.15} variant="scale" className="w-full min-w-0 flex-1">
          <div className="relative h-[300px] overflow-hidden rounded-3xl bg-subtle shadow-[0_24px_64px_rgba(11,31,38,.16),0_4px_16px_rgba(11,31,38,.08)] sm:h-[360px] lg:h-[440px]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
