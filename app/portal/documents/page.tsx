"use client";

import { useState } from "react";
import { FileDrop } from "@/components/app/FileDrop";
import { Icon } from "@/components/app/AppShell";
import { Empty, PageHeader, Pill } from "@/components/app/ui";
import { fmtDate } from "@/lib/demo/format";
import { useClientData } from "@/lib/demo/hooks";
import { useDemo } from "@/lib/demo/store";

export default function DocumentsPage() {
  const { client, docs, engagements } = useClientData();
  const clientUpload = useDemo((s) => s.clientUpload);
  const clientAddDoc = useDemo((s) => s.clientAddDoc);
  const [tab, setTab] = useState<"requested" | "finapt" | "mine">("requested");
  const [notice, setNotice] = useState<string | null>(null);
  const [extraTitle, setExtraTitle] = useState("");

  const requested = docs.filter((d) => d.status === "requested");
  const fromFinapt = docs.filter((d) => d.direction === "from-finapt");
  const mine = docs.filter((d) => d.direction === "from-client" && d.status !== "requested");
  const engTitle = (id?: string) => engagements.find((e) => e.id === id)?.title;

  const tabs = [
    { id: "requested" as const, label: "Requested from you", count: requested.length },
    { id: "finapt" as const, label: "From FinApt", count: fromFinapt.length },
    { id: "mine" as const, label: "Your uploads", count: mine.length },
  ];

  return (
    <>
      <PageHeader eyebrow="Document centre" title="Documents" />
      <div role="tablist" aria-label="Documents" className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`btn btn-sm ${tab === t.id ? "btn-ink" : "btn-line"}`}>
            {t.label} <span className="t-num opacity-70">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "requested" && (
        <section className="space-y-3">
          {requested.length ? (
            requested.map((d) => (
              <div key={d.id}>
                <p className="mb-2 text-xs text-muted">
                  {engTitle(d.engagementId) ?? "General"} · requested {d.requestedAt ? fmtDate(d.requestedAt) : ""}
                </p>
                <FileDrop label={d.title} hint={d.note} onDone={(f, s) => clientUpload(d.id, f, s)} />
              </div>
            ))
          ) : (
            <Empty>You&apos;re all caught up — nothing is waiting on you.</Empty>
          )}
          <div className="card mt-8 p-5">
            <p className="font-medium">Send us something else</p>
            <p className="mt-1 text-sm text-muted">Invoices, contracts, letters from the authorities — anything your team should see.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
              <input aria-label="What is this document?" placeholder="What is it? e.g. Supplier contract — Aramex" className="field" value={extraTitle} onChange={(e) => setExtraTitle(e.target.value)} />
            </div>
            <div className="mt-3">
              <FileDrop
                label={extraTitle || "Choose a file"}
                compact
                onDone={(f, s) => {
                  clientAddDoc(client!.id, extraTitle || f, f, s);
                  setExtraTitle("");
                  setNotice("Uploaded — your team has been notified.");
                }}
              />
            </div>
            {notice ? <p role="status" className="mt-3 text-sm text-success">{notice}</p> : null}
          </div>
        </section>
      )}

      {tab !== "requested" && (
        <section className="card overflow-hidden">
          <ul className="divide-y divide-line-soft">
            {(tab === "finapt" ? fromFinapt : mine).map((d) => (
              <li key={d.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-bone/70">
                    <Icon name="file" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{d.title}</span>
                    <span className="block truncate text-xs text-muted">
                      {d.fileName} · {d.size} · {d.uploadedAt ? fmtDate(d.uploadedAt) : ""}
                      {engTitle(d.engagementId) ? ` · ${engTitle(d.engagementId)}` : ""}
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {tab === "mine" ? d.status === "accepted" ? <Pill tone="success">Checked by FinApt</Pill> : <Pill>Awaiting review</Pill> : null}
                  {tab === "finapt" ? (
                    <button type="button" onClick={() => setNotice(`Downloading ${d.fileName}…`)} className="btn btn-line btn-sm">
                      <Icon name="download" className="h-4 w-4" /> Download
                    </button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          {notice && tab === "finapt" ? <p role="status" className="border-t border-line-soft p-4 text-sm text-muted">{notice}</p> : null}
        </section>
      )}
    </>
  );
}
