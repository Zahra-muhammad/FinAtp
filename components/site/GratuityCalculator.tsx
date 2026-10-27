"use client";

// The gratuity calculator from finaptgroup.com/gratuity-calculation-in-uae,
// ported with the same formula as the original:
//   service years = whole years + remaining months / 12
//   up to 5 years:  basic × 21 × years ÷ 30
//   over 5 years:   basic × 30 × years ÷ 30

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EXPO } from "@/components/motion/primitives";

function serviceYears(start: Date, end: Date): number {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return years + months / 12;
}

export function GratuityCalculator() {
  const [salary, setSalary] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState<{ amount: number; years: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const basic = parseFloat(salary.replace(/,/g, ""));
    const s = new Date(start);
    const en = new Date(end);
    if (!(basic > 0) || Number.isNaN(s.getTime()) || Number.isNaN(en.getTime()) || en <= s) {
      setError("Enter a basic salary and an end date after the start date.");
      setResult(null);
      return;
    }
    const years = serviceYears(s, en);
    const amount = years <= 5 ? (basic * 21 * years) / 30 : (basic * 30 * years) / 30;
    setError(null);
    setResult({ amount, years });
  }

  return (
    <form onSubmit={calculate} className="card my-10 p-6 md:p-8" aria-labelledby="calc-title">
      <p id="calc-title" className="t-label text-blue">[ Gratuity calculator ]</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="g-salary" className="field-label">Basic Salary (AED)</label>
          <input id="g-salary" inputMode="decimal" className="field t-num" placeholder="Enter Basic Salary (AED)" value={salary} onChange={(e) => setSalary(e.target.value)} />
        </div>
        <div>
          <label htmlFor="g-start" className="field-label">Start Date</label>
          <input id="g-start" type="date" className="field" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label htmlFor="g-end" className="field-label">End Date</label>
          <input id="g-end" type="date" className="field" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="btn btn-ink mt-5">Calculate</button>
      <div aria-live="polite">
        {error ? <p className="mt-4 text-sm text-signal-text">{error}</p> : null}
        <AnimatePresence>
          {result ? (
            <motion.div key={result.amount} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EXPO }} className="mt-6 border-t border-line pt-5">
              <p className="t-label text-muted">Gratuity Amount</p>
              <p className="t-num mt-1 text-4xl font-medium tracking-[-0.03em] text-blue">
                AED {result.amount.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-sm text-muted">{result.years.toFixed(2)} years of service</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
