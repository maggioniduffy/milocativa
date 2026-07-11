import {
  CircleCheckBig,
  CreditCard,
  Search,
  Send,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";

const stepIcons: LucideIcon[] = [Search, Send, CircleCheckBig, CreditCard];

export function HowItWorks() {
  const { howItWorks } = homeContent;

  return (
    <section id={howItWorks.anchorId} className="px-4 pb-12 sm:px-6 sm:pb-16 lg:pb-20">
      <Reveal variant="stack" className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[28px] border border-surface-border bg-surface px-6 py-10 shadow-xl sm:rounded-[40px] sm:px-10 sm:py-14 lg:rounded-[48px] lg:px-16 lg:py-[72px]">
          <div
            className="pointer-events-none absolute -right-36 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--accent-primary-dim),transparent_70%)]"
            aria-hidden
          />
          <h2 className="relative mb-8 text-2xl font-extrabold tracking-tight text-copy-primary sm:mb-10 sm:text-3xl lg:text-4xl">
            {howItWorks.title}
          </h2>
          <div className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <Reveal key={step.title} delay={index * 0.1}>
                  <div className="flex h-full flex-col gap-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-accent-dim text-brand">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-[13px] font-extrabold tracking-[.08em] text-copy-faint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-copy-primary">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-copy-muted sm:text-[14.5px]">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
