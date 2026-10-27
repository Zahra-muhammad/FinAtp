"use client";

// Segmented stage tracker: done segments solid, the current one pulsing,
// upcoming ones empty. Fills in on first view. Used by the site and portal.

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { EXPO } from "@/components/motion/primitives";

export function StageTracker({
  stages,
  current,
  completed = false,
  showLabels = false,
  tone = "paper",
  size = "md",
}: {
  stages: { label: string }[];
  current: number; // index of the stage in progress
  completed?: boolean;
  showLabels?: boolean;
  tone?: "paper" | "ink";
  size?: "sm" | "md";
}) {
  const reduce = useReducedMotion();
  const done = tone === "ink" ? "bg-blue-tint" : "bg-blue";
  const empty = tone === "ink" ? "bg-ink-line" : "bg-line-soft";
  const h = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div>
      <ol
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        aria-label={completed ? "All stages complete" : `Stage ${current + 1} of ${stages.length}: ${stages[current]?.label}`}
      >
        {stages.map((s, i) => {
          const state = completed || i < current ? "done" : i === current ? "current" : "todo";
          return (
            <li key={s.label} className={`relative overflow-hidden rounded-full ${h} ${empty}`}>
              <span className="sr-only">
                {s.label}: {state === "done" ? "complete" : state === "current" ? "in progress" : "not started"}
              </span>
              {state !== "todo" ? (
                <motion.span
                  aria-hidden
                  className={`absolute inset-y-0 start-0 rounded-full ${done} ${state === "current" && !reduce ? "animate-pulse" : ""}`}
                  initial={{ width: reduce ? (state === "done" ? "100%" : "50%") : "0%" }}
                  whileInView={{ width: state === "done" ? "100%" : "50%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EXPO, delay: reduce ? 0 : i * 0.07 }}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      {showLabels ? (
        <ol className="mt-3 hidden gap-1.5 text-[11px] leading-tight [overflow-wrap:anywhere] sm:grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }} aria-hidden>
          {stages.map((s, i) => (
            <li
              key={s.label}
              className={
                completed || i < current
                  ? tone === "ink" ? "text-mist" : "text-muted"
                  : i === current
                    ? tone === "ink" ? "font-semibold text-paper" : "font-semibold text-ink"
                    : tone === "ink" ? "text-mist/70" : "text-muted/80"
              }
            >
              {s.label}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
