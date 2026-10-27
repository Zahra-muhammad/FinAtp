"use client";

// Staff view of one client: move stages, post updates, request documents,
// share deliverables, review uploads and reply to messages. Every change is
// written to the shared demo state and appears in the client's portal window.

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { DocPreview, DocStatus } from "@/components/app/DocPreview";
import { FileDrop } from "@/components/app/FileDrop";
import { NewInvoice } from "@/components/app/NewInvoice";
import { StageTracker } from "@/components/app/StageTracker";
import { Empty, engagementState, PageHeader, Pill, Timeline } from "@/components/app/ui";
import { EXPO } from "@/components/motion/primitives";
import { getMember, team } from "@/data/team";
import { aed, dueLabel, fmtDate, fmtDateTime, invoiceTotal } from "@/lib/demo/format";
import { useDemo } from "@/lib/demo/store";
import type { Engagement } from "@/lib/demo/types";

export default function AdminClientPage() {
  const { id } = useParams<{ id: string }>();
  const clients = useDemo((s) => s.clients);
  const allEng = useDemo((s) => s.engagements);
  const allDocs = useDemo((s) => s.docs);
  const allMsgs = useDemo((s) => s.messages);
  const acceptDoc = useDemo((s) => s.acceptDoc);
  const staffMessage = useDemo((s) => s.staffMessage);
  const allInvoices = useDemo((s) => s.invoices);
  const createInvoice = useDemo((s) => s.createInvoice);
  const markInvoicePaid = useDemo((s) => s.markInvoicePaid);
  const remindInvoice = useDemo((s) => s.remindInvoice);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  const client = clients.find((c) => c.id === id);
  const engagements = useMemo(() => allEng.filter((e) => e.clientId === id), [allEng, id]);
  const docs = useMemo(() => allDocs.filter((d) => d.clientId === id), [allDocs, id]);
  const messages = useMemo(() => allMsgs.filter((m) => m.clientId === id), [allMsgs, id]);
  const invoices = useMemo(() => allInvoices.filter((i) => i.clientId === id).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)), [allInvoices, id]);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replyAs, setReplyAs] = useState(client?.primaryStaffId ?? "taha");

  if (!client) return <Empty>Client not found. <Link href="/admin" className="text-blue underline">Back to clients</Link></Empty>;

  const active = engagements.filter((e) => e.status === "active");
  const current = engagements.find((e) => e.id === selected) ?? active[0] ?? engagements[0];
  const toReview = docs.filter((d) => d.status === "uploaded");

  return (
    <>
      <nav aria-label="Breadcrumb" className="t-label mb-4 text-muted">
        <Link href="/admin" className="link-draw">Clients</Link> / {client.name}
      </nav>
      <PageHeader eyebrow={`${client.authority} · ${client.industry} · client since ${fmtDate(client.since, { month: "short", year: "numeric" })}`} title={client.name}>
        <Pill>{client.contact.name}, {client.contact.title}</Pill>
        {client.trn ? <Pill>TRN {client.trn}</Pill> : null}
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        {/* Engagement picker */}
        <aside aria-label="Engagements" className="space-y-2">
          <p className="t-label text-muted">Engagements</p>
          {engagements.map((e) => {
            const s = engagementState(e);
            const on = current?.id === e.id;
            return (
              <button key={e.id} type="button" onClick={() => setSelected(e.id)} aria-pressed={on} className={`card w-full p-4 text-start transition-colors ${on ? "border-ink ring-1 ring-ink" : "hover:border-ink"} ${s.completed ? "opacity-60" : ""}`}>
                <span className="flex items-start justify-between gap-2">
                  <span className="font-medium leading-tight">{e.title}</span>
                  <span className="t-num text-xs text-muted">{s.progress}%</span>
                </span>
                <span className="mt-1 block text-xs text-muted">{s.completed ? "Completed" : s.stage.label}</span>
                <span className="mt-3 block">
                  <StageTracker stages={s.type.stages} current={e.stageIndex} completed={s.completed} size="sm" />
                </span>
              </button>
            );
          })}
        </aside>

        <div className="min-w-0 space-y-6">
          {current ? <EngagementControls key={current.id} e={current} clientLabel={client.contact.name} /> : null}

          {/* Documents */}
          <section id="documents" aria-labelledby="docs-title" className="card p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="docs-title" className="text-lg font-medium">Documents ({docs.length})</h2>
              {toReview.length ? <Pill tone="ink">{toReview.length} to review</Pill> : <span className="text-sm text-muted">All uploads checked</span>}
            </div>
            <ul className="divide-y divide-line-soft">
              {[...docs]
                .sort((a, b) => Number(b.status === "uploaded") - Number(a.status === "uploaded") || (b.uploadedAt ?? b.requestedAt ?? "").localeCompare(a.uploadedAt ?? a.requestedAt ?? ""))
                .map((d) => (
                  <li key={d.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => setOpenDoc(d.id)} className="min-w-0 text-start">
                      <span className="block truncate text-sm font-medium hover:underline">{d.title}</span>
                      <span className="block truncate text-xs text-muted">
                        {d.fileName ?? d.note ?? "Waiting for upload"}
                        {d.uploadedAt ? ` · ${fmtDateTime(d.uploadedAt)}` : d.requestedAt ? ` · requested ${fmtDate(d.requestedAt)}` : ""}
                      </span>
                    </button>
                    <span className="flex shrink-0 items-center gap-2">
                      <DocStatus doc={d} />
                      {d.fileName ? (
                        <button type="button" className="btn btn-line btn-sm" onClick={() => setOpenDoc(d.id)}>
                          Open
                        </button>
                      ) : null}
                      {d.status === "uploaded" ? (
                        <button type="button" className="btn btn-ink btn-sm" onClick={() => acceptDoc(d.id)}>
                          Mark as checked
                        </button>
                      ) : null}
                    </span>
                  </li>
                ))}
              {!docs.length ? <li className="py-3 text-sm text-muted">No documents yet.</li> : null}
            </ul>
          </section>

          {/* Invoices */}
          <section id="invoices" aria-labelledby="inv-title" className="card p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="inv-title" className="text-lg font-medium">Invoices ({invoices.length})</h2>
              <button type="button" className="btn btn-line btn-sm" onClick={() => setCreatingInvoice(true)}>
                + New invoice
              </button>
            </div>
            <ul className="divide-y divide-line-soft">
              {invoices.map((i) => (
                <li key={i.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      <span className="t-num">{i.number}</span> · {aed(invoiceTotal(i))}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {i.items.map((x) => x.label).join(", ")} · issued {fmtDate(i.issuedAt)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {i.status === "paid" ? <Pill tone="success">Paid</Pill> : i.status === "overdue" ? <Pill tone="signal">Overdue</Pill> : <Pill tone="blue">Due {dueLabel(i.dueAt)}</Pill>}
                    {i.status !== "paid" ? (
                      <>
                        <button type="button" className="btn btn-line btn-sm" onClick={() => remindInvoice(i.id)}>
                          Remind
                        </button>
                        <button type="button" className="btn btn-ink btn-sm" onClick={() => markInvoicePaid(i.id)}>
                          Mark paid
                        </button>
                      </>
                    ) : null}
                  </span>
                </li>
              ))}
              {!invoices.length ? <li className="py-3 text-sm text-muted">No invoices yet.</li> : null}
            </ul>
          </section>

          <DocPreview
            doc={docs.find((d) => d.id === openDoc) ?? null}
            meta={client.name}
            onClose={() => setOpenDoc(null)}
            actions={
              docs.find((d) => d.id === openDoc)?.status === "uploaded" ? (
                <button type="button" className="btn btn-ink btn-sm" onClick={() => acceptDoc(openDoc!)}>
                  Mark as checked
                </button>
              ) : null
            }
          />
          <NewInvoice
            open={creatingInvoice}
            onClose={() => setCreatingInvoice(false)}
            clients={[{ id: client.id, name: client.name }]}
            defaultClientId={client.id}
            onCreate={(cid, label, amount, days) => {
              createInvoice(cid, label, amount, days);
              setCreatingInvoice(false);
            }}
          />

          {/* Messages */}
          <section id="messages" aria-labelledby="msgs-title" className="card p-5">
            <h2 id="msgs-title" className="mb-4 text-lg font-medium">Messages</h2>
            <ul className="max-h-80 space-y-3 overflow-y-auto pe-1">
              {messages.map((m) => (
                <li key={m.id} className={`rounded-xl p-3 text-sm ${m.from === "client" ? "bg-bone/60" : "bg-blue-wash"}`}>
                  <p>{m.text}</p>
                  <p className="mt-1 text-xs text-muted">
                    {m.from === "client" ? client.contact.name : getMember(m.staffId ?? "")?.name} · {fmtDateTime(m.at)}
                  </p>
                </li>
              ))}
            </ul>
            <form
              className="mt-4 grid gap-2 md:grid-cols-[10rem_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                staffMessage(client.id, replyAs, reply.trim());
                setReply("");
              }}
            >
              <label htmlFor="reply-as" className="sr-only">Reply as</label>
              <select id="reply-as" className="field" value={replyAs} onChange={(e) => setReplyAs(e.target.value)}>
                {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <label htmlFor="reply" className="sr-only">Reply</label>
              <input id="reply" className="field" placeholder={`Reply to ${client.contact.name.split(" ")[0]}…`} value={reply} onChange={(e) => setReply(e.target.value)} />
              <button type="submit" className="btn btn-ink" disabled={!reply.trim()}>Send</button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

function EngagementControls({ e, clientLabel }: { e: Engagement; clientLabel: string }) {
  const advance = useDemo((s) => s.advanceStage);
  const revert = useDemo((s) => s.revertStage);
  const postUpdate = useDemo((s) => s.postUpdate);
  const requestDocument = useDemo((s) => s.requestDocument);
  const uploadDeliverable = useDemo((s) => s.uploadDeliverable);
  const { type, stage, completed, progress } = engagementState(e);
  const next = type.stages[e.stageIndex + 1];
  const owner = getMember(e.staffId);

  const [tab, setTab] = useState<"stage" | "note" | "request" | "deliver">("stage");
  const [note, setNote] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docNote, setDocNote] = useState("");
  const [delTitle, setDelTitle] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  function done(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3200);
  }

  return (
    <section aria-labelledby="eng-title" className="card overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="t-label text-muted">{type.name}{e.period ? ` · ${e.period}` : ""} · {owner?.name}</p>
            <h2 id="eng-title" className="mt-1 text-2xl font-medium tracking-[-0.02em]">{e.title}</h2>
          </div>
          <p className="t-num text-4xl font-medium text-blue">{progress}%</p>
        </div>
        <div className="mt-6">
          <StageTracker key={`${e.stageIndex}-${e.status}`} stages={type.stages} current={e.stageIndex} completed={completed} showLabels />
        </div>
      </div>

      <div role="tablist" aria-label="Staff actions" className="flex gap-1 overflow-x-auto border-y border-line-soft bg-paper/60 px-3">
        {(
          [
            ["stage", "Move stage"],
            ["note", "Post update"],
            ["request", "Request document"],
            ["deliver", "Upload deliverable"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={`shrink-0 border-b-2 px-3 py-3 text-sm ${tab === k ? "border-ink font-medium" : "border-transparent text-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        {tab === "stage" && (
          <div>
            <p className="text-sm text-muted-2">
              Now: <strong className="text-ink">{completed ? "Complete" : stage.label}</strong>
              {!completed ? <> → Next: <strong className="text-ink">{next ? next.label : "Complete engagement"}</strong></> : null}
              {!completed && next?.clientAction ? <span className="ms-2 text-signal-text">(client will be asked to: {next.clientAction.label.toLowerCase()})</span> : null}
            </p>
            <label htmlFor="stage-note" className="field-label mt-4">Note to client (optional)</label>
            <input id="stage-note" className="field" placeholder="e.g. Licence issued by DMCC today." value={note} onChange={(ev) => setNote(ev.target.value)} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-blue"
                disabled={completed}
                onClick={() => {
                  advance(e.id, note.trim() || undefined);
                  setNote("");
                  done(next ? `Moved to “${next.label}” — client notified.` : "Engagement completed — client notified.");
                }}
              >
                {next ? `Move to “${next.label}”` : "Complete engagement"} →
              </button>
              <button type="button" className="btn btn-line" disabled={e.stageIndex === 0 && !completed} onClick={() => revert(e.id)}>
                ← Back a stage
              </button>
            </div>
          </div>
        )}

        {tab === "note" && (
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              if (!note.trim()) return;
              postUpdate(e.id, note.trim());
              setNote("");
              done("Update posted to the client's timeline.");
            }}
          >
            <label htmlFor="upd" className="field-label">Update for the client</label>
            <textarea id="upd" rows={3} className="field" placeholder="e.g. Stock count completed at the Jebel Ali warehouse — no exceptions." value={note} onChange={(ev) => setNote(ev.target.value)} />
            <button type="submit" className="btn btn-blue mt-3" disabled={!note.trim()}>Post update</button>
          </form>
        )}

        {tab === "request" && (
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              if (!docTitle.trim()) return;
              requestDocument(e.id, docTitle.trim(), docNote.trim() || undefined);
              setDocTitle("");
              setDocNote("");
              done("Request sent — it's now in the client's document centre.");
            }}
            className="grid gap-3 md:grid-cols-2"
          >
            <div>
              <label htmlFor="rq-title" className="field-label">Document</label>
              <input id="rq-title" className="field" placeholder="e.g. Fixed asset register" value={docTitle} onChange={(ev) => setDocTitle(ev.target.value)} list="doc-suggestions" />
              <datalist id="doc-suggestions">
                {["Bank statements", "Fixed asset register", "Signed engagement letter", "Customs declarations", "Payroll summary", "Tenancy contract (Ejari)", "Shareholder passport copy"].map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="rq-note" className="field-label">Note (optional)</label>
              <input id="rq-note" className="field" placeholder="Format, period, which accounts…" value={docNote} onChange={(ev) => setDocNote(ev.target.value)} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-blue" disabled={!docTitle.trim()}>Request from client</button>
            </div>
          </form>
        )}

        {tab === "deliver" && (
          <div className="grid gap-3">
            <div>
              <label htmlFor="dl-title" className="field-label">Deliverable title</label>
              <input id="dl-title" className="field" placeholder={`e.g. ${e.type === "external-audit" ? "Final signed audit report" : e.type === "bookkeeping" ? "MIS report" : "Final report"}`} value={delTitle} onChange={(ev) => setDelTitle(ev.target.value)} />
            </div>
            <FileDrop
              label={delTitle || "Choose the file to share"}
              compact
              onDone={(f, size) => {
                uploadDeliverable(e.id, delTitle.trim() || f, f, size);
                setDelTitle("");
                done("Shared with the client.");
              }}
            />
          </div>
        )}

        <AnimatePresence>
          {flash ? (
            <motion.p role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EXPO }} className="mt-4 rounded-lg bg-success-wash p-3 text-sm text-success">
              ✓ {flash}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="border-t border-line-soft p-5 md:p-6">
        <h3 className="mb-5 text-sm font-medium">Timeline</h3>
        <Timeline updates={e.updates} limit={8} clientLabel={clientLabel} />
      </div>
    </section>
  );
}
