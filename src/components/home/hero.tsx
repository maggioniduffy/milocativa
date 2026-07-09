import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";
import { cn } from "@/lib/utils";

export function Hero() {
  const { hero } = homeContent;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-accent-dim px-3 py-1 text-sm font-medium text-brand">
              {hero.eyebrow}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-copy-primary sm:text-4xl lg:text-5xl">
              {hero.title}
            </h1>
            <p className="max-w-xl text-base text-copy-secondary sm:text-lg">
              {hero.subtitle}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={hero.primaryCta.href}
                className={cn(
                  buttonVariants(),
                  "h-11 w-full px-6 text-base sm:w-auto"
                )}
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-full px-6 text-base sm:w-auto"
                )}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {hero.stats.map((stat) => (
                <li
                  key={stat}
                  className="flex items-center gap-2 text-sm font-medium text-copy-muted"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-brand"
                    aria-hidden
                  />
                  {stat}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
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
