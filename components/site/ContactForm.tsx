"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EXPO } from "@/components/motion/primitives";
import { Arrow } from "@/components/ui/bits";
import { categories } from "@/data/services";

// Mock form: nothing is sent. Shows a confirmation after a short delay.
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setState("sending");
    setTimeout(() => setState("sent"), 900);
  }

  return (
    <AnimatePresence mode="wait">
      {state === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EXPO }} className="card p-8" role="status">
          <p className="t-h3">Thank you — message received.</p>
          <p className="mt-3 text-muted-2">A member of the team will reply within one business day.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="field-label">Name</label>
            <input id="c-name" name="name" required autoComplete="name" className="field" />
          </div>
          <div>
            <label htmlFor="c-email" className="field-label">Email</label>
            <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <div>
            <label htmlFor="c-phone" className="field-label">Phone (optional)</label>
            <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" />
          </div>
          <div>
            <label htmlFor="c-topic" className="field-label">Topic</label>
            <select id="c-topic" name="topic" className="field">
              {categories.map((c) => (
                <option key={c.slug}>{c.name}</option>
              ))}
              <option>Something else</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-msg" className="field-label">How can we help?</label>
            <textarea id="c-msg" name="message" required rows={5} className="field" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-ink" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send message"} <Arrow />
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
