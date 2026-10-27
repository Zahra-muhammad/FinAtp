"use client";

// Motion building blocks. Everything settles on one expo-out ease and
// falls back to a short fade (or nothing) under prefers-reduced-motion.

import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Children, useEffect, useRef, type ElementType, type ReactNode } from "react";

export const EXPO = [0.16, 1, 0.3, 1] as const;

// --- Reveal: fade + rise on entering the viewport ---------------------------

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduce ? 0.2 : 1, ease: EXPO, delay: reduce ? 0 : delay }}
    >
      {children}
    </Comp>
  );
}

// --- Lines: each line rises from behind a mask ------------------------------

export function Lines({
  children,
  as = "h2",
  className,
  delay = 0,
  trigger = "view",
}: {
  children: ReactNode; // one child per line
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  trigger?: "view" | "mount";
}) {
  const reduce = useReducedMotion();
  const Tag = as as ElementType;
  const lines = Children.toArray(children);
  // Watch the heading itself: the masked lines start outside their clip box,
  // so observing them directly would never report them as visible.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = trigger === "mount" || inView;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="block will-change-transform"
            initial={reduce ? { opacity: 0, y: "0%" } : { y: "110%", opacity: 1 }}
            animate={show ? { y: "0%", opacity: 1 } : undefined}
            transition={{ duration: reduce ? 0.2 : 1.1, ease: EXPO, delay: reduce ? 0 : delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// --- ScrollWords: a statement that "reads itself" as you scroll ------------

export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  // Same markup either way (keeps server and client HTML identical);
  // reduced motion simply shows every word at full strength.
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range, still }: { children: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

// --- Counter: counts up once in view ---------------------------------------

export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EXPO,
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduce]);
  // Same markup on server and client; the effect fills in the number.
  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {`0${suffix}`}
    </span>
  );
}

// --- Marquee: slow infinite strip, pauses on hover --------------------------

// Under reduced motion the CSS animation is switched off and the strip
// wraps into a static list instead (pure CSS, so no hydration differences).
export function Marquee({ items, className, speed = 40 }: { items: string[]; className?: string; speed?: number }) {
  return (
    <div className={`group overflow-hidden ${className ?? ""}`} aria-label={items.join(", ")} role="list">
      <div
        className="flex w-max gap-14 pe-14 [animation:marquee_var(--speed)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-y-3 motion-reduce:px-[var(--margin)] motion-reduce:[animation:none] motion-reduce:[&>[aria-hidden]]:hidden"
        style={{ ["--speed" as string]: `${speed}s` }}
      >
        {[...items, ...items].map((it, i) => (
          <span key={i} role={i < items.length ? "listitem" : undefined} aria-hidden={i >= items.length || undefined} className="whitespace-nowrap">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Magnetic: element leans toward the pointer ---------------------------

export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <motion.div ref={ref} className={`inline-block ${className ?? ""}`} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}

// --- Parallax: shifts its child slowly against the scroll -------------------

export function useParallax(amount = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`-${amount}%`, `${amount}%`]);
  return { ref, y };
}
