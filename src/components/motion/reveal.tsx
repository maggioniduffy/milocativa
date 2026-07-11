"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealVariant = "up" | "scale" | "stack";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** up: slide from below · scale: settle from 1.03 · stack: rise + descale (big panels). */
  variant?: RevealVariant;
  className?: string;
}

const hiddenByVariant: Record<RevealVariant, { y?: number; scale?: number }> = {
  up: { y: 24 },
  scale: { scale: 1.03 },
  stack: { y: 56, scale: 0.95 },
};

export function Reveal({ children, delay = 0, variant = "up", className }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const hidden = hiddenByVariant[variant];

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, ...hidden }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}
