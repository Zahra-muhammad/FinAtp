"use client";

// Mock document viewer: files in the demo have no real content, so this
// shows a page-style preview with the file's details and the actions
// available to whoever is looking at it.

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EXPO } from "@/components/motion/primitives";
import { fmtDateTime } from "@/lib/demo/format";
import type { Doc } from "@/lib/demo/types";
import { Icon } from "./AppShell";
import { Pill } from "./ui";

export function DocPreview({
  doc,
  meta,
  onClose,
  actions,
}: {
  doc: Doc | null;
  meta?: string; // e.g. client name · engagement
  onClose: () => void;
  actions?: React.ReactNode;
}) {
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => {
    setNote(null);
  }, [doc?.id]);
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [doc, onClose]);

  const ext = doc?.fileName?.split(".").pop()?.toLowerCase();
  const isSheet = ext === "xlsx" || ext === "xls" || ext === "csv";

  return (
    <AnimatePresence>
      {doc ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="doc-title"
            className="card flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EXPO }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line-soft p-5">
              <div className="min-w-0">
                <p id="doc-title" className="text-lg font-medium">{doc.title}</p>
                <p className="mt-1 truncate text-sm text-muted">
                  {doc.fileName ?? "Not uploaded yet"}
                  {doc.size ? ` · ${doc.size}` : ""}
                  {doc.uploadedAt ? ` · ${fmtDateTime(doc.uploadedAt)}` : ""}
                </p>
                {meta ? <p className="mt-1 text-sm text-muted-2">{meta}</p> : null}
              </div>
              <button type="button" onClick={onClose} aria-label="Close preview" className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-bone/60">
                <span aria-hidden className="text-2xl leading-none">×</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-bone/40 p-5 md:p-8">
              {doc.fileName ? (
                <div className="mx-auto max-w-xl rounded-md bg-white p-8 shadow-lg" aria-label="Document preview">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold tracking-[-0.03em]">{doc.direction === "from-finapt" ? "FinApt." : doc.title}</span>
                    <span className="t-label text-muted">{ext?.toUpperCase()}</span>
                  </div>
                  <p className="mt-6 text-lg font-medium">{doc.title}</p>
                  {isSheet ? (
                    <div className="mt-6 grid grid-cols-4 gap-px overflow-hidden rounded border border-line-soft bg-line-soft text-[11px]">
                      {Array.from({ length: 32 }, (_, i) => (
                        <span key={i} className={`bg-white px-2 py-1.5 ${i < 4 ? "font-semibold" : "t-num text-muted-2"}`}>
                          {i < 4 ? ["Account", "Description", "Debit", "Credit"][i] : i % 4 === 0 ? 1000 + i * 10 : i % 4 === 1 ? "—" : ((i * 7919) % 90000).toLocaleString("en")}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-2.5" aria-hidden>
                      {[100, 92, 96, 70, 0, 88, 94, 60, 0, 97, 83].map((w, i) => (w ? <div key={i} className="h-2 rounded bg-line-soft" style={{ width: `${w}%` }} /> : <div key={i} className="h-3" />))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-sm text-muted">Waiting for the client to upload this document.{doc.note ? ` Note: ${doc.note}` : ""}</p>
              )}
            </div>

            {note ? (
              <p role="status" className="border-t border-line-soft px-4 pt-3 text-sm text-muted">
                {note}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft p-4">
              <DocStatus doc={doc} />
              <div className="flex flex-wrap gap-2">
                {doc.fileName ? (
                  <button type="button" className="btn btn-line btn-sm" onClick={() => setNote(`Downloading ${doc.fileName}…`)}>
                    <Icon name="download" className="h-4 w-4" /> Download
                  </button>
                ) : null}
                {actions}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function DocStatus({ doc }: { doc: Doc }) {
  if (doc.status === "requested") return <Pill tone="signal">Requested from client</Pill>;
  if (doc.direction === "from-finapt") return <Pill tone="blue">Shared by FinApt</Pill>;
  if (doc.status === "accepted") return <Pill tone="success">Checked</Pill>;
  return <Pill tone="ink">To review</Pill>;
}
