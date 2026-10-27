"use client";

// Modal for staff to raise an invoice (used on Invoices and the client page).

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EXPO } from "@/components/motion/primitives";
import { aed } from "@/lib/demo/format";

export function NewInvoice({
  open,
  onClose,
  clients,
  defaultClientId,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  clients: { id: string; name: string }[];
  defaultClientId?: string;
  onCreate: (clientId: string, label: string, amount: number, dueInDays: number) => void;
}) {
  const [clientId, setClientId] = useState(defaultClientId ?? clients[0]?.id ?? "");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("30");
  const value = Number(amount.replace(/,/g, ""));
  const valid = clientId && label.trim() && value > 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-inv-title"
            className="card w-full max-w-md p-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EXPO }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!valid) return;
              onCreate(clientId, label.trim(), value, Number(days));
              setLabel("");
              setAmount("");
            }}
          >
            <p id="new-inv-title" className="text-xl font-medium">New invoice</p>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="ni-client" className="field-label">Client</label>
                <select id="ni-client" className="field" value={clientId} onChange={(e) => setClientId(e.target.value)} disabled={!!defaultClientId}>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ni-label" className="field-label">Description</label>
                <input id="ni-label" className="field" placeholder="e.g. External audit FY2025 — final 50%" value={label} onChange={(e) => setLabel(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ni-amount" className="field-label">Amount (AED, excl. VAT)</label>
                  <input id="ni-amount" className="field t-num" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ni-days" className="field-label">Due in</label>
                  <select id="ni-days" className="field" value={days} onChange={(e) => setDays(e.target.value)}>
                    {["7", "14", "30", "45"].map((d) => (
                      <option key={d} value={d}>{d} days</option>
                    ))}
                  </select>
                </div>
              </div>
              {value > 0 ? <p className="text-sm text-muted">Total incl. 5% VAT: <span className="t-num text-ink">{aed(value * 1.05)}</span></p> : null}
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" className="btn btn-line flex-1" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-ink flex-1" disabled={!valid}>Create & send</button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
