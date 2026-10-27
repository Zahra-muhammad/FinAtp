"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageHeader, Pill } from "@/components/app/ui";
import { EXPO } from "@/components/motion/primitives";
import { aed, dueLabel, fmtDate, invoiceTotal as total } from "@/lib/demo/format";
import { useClientData } from "@/lib/demo/hooks";
import { useDemo } from "@/lib/demo/store";
import type { Invoice } from "@/lib/demo/types";

export default function InvoicesPage() {
  const { invoices } = useClientData();
  const pay = useDemo((s) => s.payInvoice);
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [stage, setStage] = useState<"form" | "processing" | "done">("form");
  const sorted = [...invoices].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + total(i), 0);

  return (
    <>
      <PageHeader eyebrow="Billing" title="Invoices" />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="t-label text-muted">Outstanding</p>
          <p className="t-num mt-2 text-2xl font-medium">{aed(outstanding)}</p>
        </div>
        <div className="card p-5">
          <p className="t-label text-muted">Overdue</p>
          <p className="t-num mt-2 text-2xl font-medium text-signal-text">{invoices.filter((i) => i.status === "overdue").length}</p>
        </div>
        <div className="card p-5">
          <p className="t-label text-muted">Paid this year</p>
          <p className="t-num mt-2 text-2xl font-medium">{aed(invoices.filter((i) => i.status === "paid").reduce((s, i) => s + total(i), 0))}</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="t-label border-b border-line-soft text-start text-muted">
              <th className="p-4 text-start font-normal">Invoice</th>
              <th className="p-4 text-start font-normal">Description</th>
              <th className="p-4 text-start font-normal">Issued</th>
              <th className="p-4 text-end font-normal">Total incl. 5% VAT</th>
              <th className="p-4 text-start font-normal">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {sorted.map((i) => (
              <tr key={i.id}>
                <td className="t-num whitespace-nowrap p-4">{i.number}</td>
                <td className="p-4">{i.items.map((x) => x.label).join(", ")}</td>
                <td className="p-4 text-muted">{fmtDate(i.issuedAt)}</td>
                <td className="t-num p-4 text-end">{aed(total(i))}</td>
                <td className="p-4">
                  {i.status === "paid" ? <Pill tone="success">Paid {i.paidAt ? fmtDate(i.paidAt, { day: "numeric", month: "short" }) : ""}</Pill> : i.status === "overdue" ? <Pill tone="signal">Overdue</Pill> : <Pill tone="blue">Due {dueLabel(i.dueAt)}</Pill>}
                </td>
                <td className="p-4 text-end">
                  {i.status !== "paid" ? (
                    <button
                      type="button"
                      className="btn btn-ink btn-sm"
                      onClick={() => {
                        setPaying(i);
                        setStage("form");
                      }}
                    >
                      Pay now
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {paying ? (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => stage !== "processing" && setPaying(null)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pay-title"
              className="card w-full max-w-md p-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: EXPO }}
              onClick={(e) => e.stopPropagation()}
            >
              {stage === "done" ? (
                <div className="text-center">
                  <p className="text-xl font-medium">Payment received</p>
                  <p className="mt-2 text-muted-2">
                    {paying.number} · {aed(total(paying))}. Your FinApt team has been notified.
                  </p>
                  <button type="button" className="btn btn-ink mt-6 w-full" onClick={() => setPaying(null)}>
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStage("processing");
                    setTimeout(() => {
                      pay(paying.id);
                      setStage("done");
                    }, 1200);
                  }}
                >
                  <p id="pay-title" className="text-xl font-medium">Pay {paying.number}</p>
                  <p className="t-num mt-1 text-2xl">{aed(total(paying))}</p>
                  <p className="mt-2 text-xs text-muted">Payments are processed securely. Card details are never stored by FinApt.</p>
                  <div className="mt-5 space-y-3">
                    <div>
                      <label htmlFor="card" className="field-label">Card number</label>
                      <input id="card" className="field t-num" inputMode="numeric" defaultValue="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="exp" className="field-label">Expiry</label>
                        <input id="exp" className="field t-num" defaultValue="12 / 29" />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="field-label">CVC</label>
                        <input id="cvc" className="field t-num" defaultValue="123" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-blue mt-6 w-full" disabled={stage === "processing"}>
                    {stage === "processing" ? "Processing…" : `Pay ${aed(total(paying))}`}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
