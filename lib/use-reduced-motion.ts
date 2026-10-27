"use client";

// Hydration-safe reduced-motion check. The server can't know the visitor's
// preference, so during hydration this reports `false` (matching the server
// HTML) and switches to the real value straight after. Framer Motion's own
// hook reads the media query immediately, which makes server and client
// markup disagree for reduced-motion visitors.

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
