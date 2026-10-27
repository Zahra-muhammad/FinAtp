"use client";

// Lenis smooth scrolling for the marketing site only. Skipped entirely when
// the visitor prefers reduced motion.

import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: { offset: -80 } }}>
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
}

// Lenis keeps its own scroll position, which overrides Next's scroll-to-top
// on client navigation — new pages would open scrolled to wherever the last
// page was. Jump to the top (or to the #hash target) on every route change.
function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target instanceof HTMLElement) lenis.scrollTo(target, { offset: -80, immediate: true });
    else lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}
