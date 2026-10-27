"use client";

// Mock file upload: accepts a picked or dropped file, shows a short upload
// animation, and reports the file name. Nothing leaves the browser.

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useId, useRef, useState } from "react";
import { fakeSize } from "@/lib/demo/format";

export function FileDrop({
  label,
  hint,
  value,
  onDone,
  compact = false,
}: {
  label: string;
  hint?: string;
  value?: string;
  onDone: (fileName: string, size: string) => void;
  compact?: boolean;
}) {
  const inputId = useId();
  const ref = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  function handle(file?: File) {
    const name = file?.name ?? `${label.replace(/\s+/g, "_")}.pdf`;
    const size = fakeSize(file);
    if (reduce) {
      onDone(name, size);
      return;
    }
    setProgress(0);
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else {
        setProgress(null);
        onDone(name, size);
      }
    };
    requestAnimationFrame(tick);
  }

  const done = !!value && progress === null;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      className={`relative overflow-hidden rounded-xl border border-dashed transition-colors duration-300 ${
        done ? "border-success/40 bg-success-wash" : over ? "border-blue bg-blue-wash" : "border-line bg-white"
      } ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium">{label}</p>
          <p className="mt-0.5 truncate text-sm text-muted">{done ? value : progress !== null ? "Uploading…" : hint ?? "PDF, JPG or PNG — drag here or browse"}</p>
        </div>
        <input
          ref={ref}
          id={inputId}
          type="file"
          className="sr-only"
          onChange={(e) => {
            handle(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {done ? (
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-success">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 13l4 4L19 7" />
            </svg>
            Uploaded
            <label htmlFor={inputId} className="ms-2 cursor-pointer text-muted underline">
              Replace
            </label>
          </span>
        ) : (
          <label htmlFor={inputId} className="btn btn-line btn-sm shrink-0 cursor-pointer">
            Browse
          </label>
        )}
      </div>
      {progress !== null ? (
        <motion.span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left bg-blue" style={{ scaleX: progress }} />
      ) : null}
    </div>
  );
}
