"use client";

// Framer Motion drops transform/layout animation (keeping fades) for
// visitors who prefer reduced motion.

import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
