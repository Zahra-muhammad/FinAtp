"use client";

// Abstract graphic panels used where a photograph would feel forced.
// Pure SVG in brand colours; slow drift that stops under reduced motion.

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Variant = "arcs" | "ledger" | "bars" | "orbit";

export function Panel({ variant, className = "", dark = true }: { variant: Variant; className?: string; dark?: boolean }) {
  const reduce = useReducedMotion();
  const fg = dark ? "#8FA8FF" : "#1D46C8";
  const line = dark ? "#262B35" : "#D9D3C7";
  const bg = dark ? "bg-ink" : "bg-bone";

  return (
    <div aria-hidden className={`grain relative overflow-hidden ${bg} ${className}`}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {variant === "arcs" &&
          Array.from({ length: 12 }, (_, i) => (
            <motion.circle
              key={i}
              cx="400"
              cy="500"
              r={40 + i * 34}
              fill="none"
              stroke={i === 7 ? fg : line}
              strokeWidth={i === 7 ? 1.5 : 1}
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            />
          ))}
        {variant === "ledger" && (
          <>
            {Array.from({ length: 26 }, (_, i) => (
              <line key={i} x1="0" x2="400" y1={i * 20} y2={i * 20} stroke={line} strokeWidth="1" />
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <line key={`v${i}`} x1={80 + i * 90} x2={80 + i * 90} y1="0" y2="500" stroke={line} strokeWidth="1" />
            ))}
            <motion.path
              d="M0 380 L60 360 L120 372 L180 310 L240 290 L300 220 L360 196 L400 150"
              fill="none"
              stroke={fg}
              strokeWidth="2"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </>
        )}
        {variant === "bars" &&
          [120, 180, 150, 240, 210, 300, 280, 360].map((h, i) => (
            <motion.rect
              key={i}
              x={24 + i * 47}
              width="30"
              y={500 - h}
              height={h}
              fill={i === 7 ? fg : line}
              initial={{ scaleY: reduce ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              style={{ transformOrigin: "bottom", transformBox: "fill-box" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
            />
          ))}
        {variant === "orbit" && (
          <motion.g
            style={{ originX: "200px", originY: "250px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 120, ease: "linear", repeat: Infinity }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <ellipse key={i} cx="200" cy="250" rx={60 + i * 34} ry={150 + i * 22} fill="none" stroke={line} strokeWidth="1" transform={`rotate(${i * 24} 200 250)`} />
            ))}
            <circle cx="200" cy="100" r="5" fill={fg} />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
