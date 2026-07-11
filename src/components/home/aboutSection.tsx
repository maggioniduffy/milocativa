"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";
import { cn } from "@/lib/utils";

function AboutTitle({ className }: { className?: string }) {
  const { about } = homeContent;
  return (
    <>
      <span className={className}>{about.titleLead}</span>{" "}
      <em className="font-serif-accent italic font-normal tracking-normal text-copy-muted">
        {about.titleAccent}
      </em>
    </>
  );
}

/**
 * "Nosotros" flip card: front shows the title; hovering (or tapping, on
 * touch) flips it 180° on the X axis to reveal the description. With reduced
 * motion the faces crossfade instead of rotating.
 */
export function AboutSection() {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();
  const { about } = homeContent;

  return (
    <section id={about.anchorId} className="px-4 sm:px-6">
      <Reveal variant="stack" className="mx-auto max-w-6xl [perspective:1400px]">
        <div
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
          onClick={() => setFlipped((f) => !f)}
          className={cn(
            "relative min-h-[300px] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] sm:min-h-[340px] lg:min-h-[380px]",
            !reduceMotion && flipped && "[transform:rotateX(180deg)]"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center overflow-hidden rounded-[28px] bg-subtle/60 [backface-visibility:hidden] sm:rounded-[40px] lg:rounded-[48px]",
              reduceMotion && "transition-opacity duration-300",
              reduceMotion && flipped && "opacity-0"
            )}
          >
            <div
              className="pointer-events-none absolute -left-36 -top-36 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,var(--accent-primary-dim),transparent_70%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--accent-teal-dim),transparent_70%)]"
              aria-hidden
            />
            <h2 className="relative m-0 text-balance p-6 text-center text-3xl font-extrabold tracking-tight text-copy-primary sm:text-4xl lg:text-[46px]">
              <AboutTitle />
            </h2>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col items-start justify-center gap-3.5 overflow-hidden rounded-[28px] bg-surface p-7 shadow-xl [backface-visibility:hidden] sm:rounded-[40px] sm:p-10 lg:rounded-[48px] lg:p-14",
              reduceMotion
                ? cn("transition-opacity duration-300", !flipped && "opacity-0")
                : "[transform:rotateX(180deg)]"
            )}
          >
            <h3 className="m-0 text-xl font-extrabold tracking-tight text-copy-primary sm:text-2xl lg:text-[28px]">
              <AboutTitle />
            </h3>
            <p className="m-0 max-w-[760px] text-base leading-[1.7] text-copy-secondary [text-wrap:pretty] sm:text-lg lg:text-[19px]">
              {about.body}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
