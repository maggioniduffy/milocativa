import {
  CalendarCheck2,
  CreditCard,
  Search,
  Send,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";

const stepIcons: LucideIcon[] = [Search, Send, CalendarCheck2, CreditCard];

export function HowItWorks() {
  const { howItWorks } = homeContent;

  return (
    <section id={howItWorks.anchorId} className="bg-subtle">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <Reveal>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-copy-primary sm:text-3xl">
              {howItWorks.title}
            </h2>
            <p className="mt-3 text-base text-copy-secondary sm:text-lg">
              {howItWorks.subtitle}
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <Reveal key={step.title} delay={index * 0.05}>
                <div className="flex h-full flex-col items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-dim text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-copy-primary">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-copy-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
