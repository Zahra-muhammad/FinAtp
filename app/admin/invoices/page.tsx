"use client";

// All client invoices: what's outstanding, overdue and paid, plus creating
// an invoice, recording a payment and sending a reminder.

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { NewInvoice } from "@/components/app/NewInvoice";
import { Empty, PageHeader, Pill } from "@/components/app/ui";
import { EXPO } from "@/components/motion/primitives";
import { aed, dueLabel, fmtDate, invoiceTotal } from "@/lib/demo/format";
import { useDemo } from "@/lib/demo/store";

type Filter = "open" | "overdue" | "paid" | "all";

export default function AdminInvoicesPage() {
  const invoices = useDemo((s) => s.invoices);
  const clients = useDemo((s) => s.clients);
  const markPaid = useDemo((s) => s.markInvoicePaid);
  const remind = useDemo((s) => s.remindInvoice);
  const createInvoice = useDemo((s) => s.createInvoice);
  const [filter, setFilter] = useState<Filter>("open");
  const [creating, setCreating] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "—";
  const list = useMemo(
    () =>
      invoices
        .filter((i) => (filter === "open" ? i.status !== "paid" : filter === "all" ? true : i.status === filter))
        .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)),
    [invoices, filter],
  );
  const sum = (xs: typeof invoices) => xs.reduce((s, i) => s + invoiceTotal(i), 0);
  const outstanding = invoices.filter((i) => i.status !== "paid");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const paid = invoices.filter((i) => i.status === "paid");

  function done(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3200);
  }

  return (
    <>
      <PageHeader eyebrow="Staff admin" title="Invoices">
        <button type="button" className="btn btn-ink btn-sm" onClick={() => setCreating(true)}>
          + New invoice
        </button>
      </PageHeader>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="t-label text-muted">Outstanding ({outstanding.length})</p>
          <p className="t-num mt-2 text-2xl font-medium">{aed(sum(outstanding))}</p>
        </div>
        <div className="card p-5">
          <p className="t-label text-muted">Overdue ({overdue.length})</p>
          <p className="t-num mt-2 text-2xl font-medium text-signal-text">{aed(sum(overdue))}</p>
        </div>
        <div className="card p-5">
          <p className="t-label text-muted">Collected ({paid.length})</p>
          <p className="t-num mt-2 text-2xl font-medium">{aed(sum(paid))}</p>
        </div>
      </div>

      <div role="tablist" aria-label="Filter invoices" className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["open", "Outstanding"],
            ["overdue", "Overdue"],
            ["paid", "Paid"],
            ["all", "All"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} role="tab" type="button" aria-selected={filter === id} onClick={() => setFilter(id)} className={`btn btn-sm ${filter === id ? "btn-ink" : "btn-line"}`}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {flash ? (
          <motion.p role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EXPO }} className="mb-4 rounded-lg bg-success-wash p-3 text-sm text-success">
            ✓ {flash}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {list.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="t-label border-b border-line-soft text-muted">
                <th className="p-4 text-start font-normal">Invoice</th>
                <th className="p-4 text-start font-normal">Client</th>
                <th className="p-4 text-start font-normal">Description</th>
                <th className="p-4 text-start font-normal">Issued</th>
                <th className="p-4 text-end font-normal">Total incl. VAT</th>
                <th className="p-4 text-start font-normal">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {list.map((i) => (
                <tr key={i.id}>
                  <td className="t-num whitespace-nowrap p-4">{i.number}</td>
                  <td className="p-4">
                    <Link href={`/admin/clients/${i.clientId}`} className="link-draw">{clientName(i.clientId)}</Link>
                  </td>
                  <td className="p-4">{i.items.map((x) => x.label).join(", ")}</td>
                  <td className="whitespace-nowrap p-4 text-muted">{fmtDate(i.issuedAt)}</td>
                  <td className="t-num whitespace-nowrap p-4 text-end">{aed(invoiceTotal(i))}</td>
                  <td className="p-4">
                    {i.status === "paid" ? <Pill tone="success">Paid {i.paidAt ? fmtDate(i.paidAt, { day: "numeric", month: "short" }) : ""}</Pill> : i.status === "overdue" ? <Pill tone="signal">Overdue</Pill> : <Pill tone="blue">Due {dueLabel(i.dueAt)}</Pill>}
                  </td>
                  <td className="whitespace-nowrap p-4 text-end">
                    {i.status !== "paid" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn btn-line btn-sm"
                          onClick={() => {
                            remind(i.id);
                            done(`Reminder sent to ${clientName(i.clientId)} for ${i.number}.`);
                          }}
                        >
                          Send reminder
                        </button>
                        <button
                          type="button"
                          className="btn btn-ink btn-sm"
                          onClick={() => {
                            markPaid(i.id);
                            done(`${i.number} marked as paid.`);
                          }}
                        >
                          Mark paid
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>No invoices here.</Empty>
      )}

      <NewInvoice
        open={creating}
        onClose={() => setCreating(false)}
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        onCreate={(clientId, label, amount, days) => {
          createInvoice(clientId, label, amount, days);
          setCreating(false);
          setFilter("open");
          done(`Invoice created and sent to ${clientName(clientId)}.`);
        }}
      />
    </>
  );
}
