"use client";

// Every document across all clients: what clients uploaded, what's still
// requested, and what FinApt has shared. Staff can open, download and check.

import Link from "next/link";
import { useMemo, useState } from "react";
import { DocPreview, DocStatus } from "@/components/app/DocPreview";
import { Icon } from "@/components/app/AppShell";
import { Empty, PageHeader } from "@/components/app/ui";
import { fmtDate } from "@/lib/demo/format";
import { useDemo } from "@/lib/demo/store";

type Filter = "review" | "all" | "requested" | "finapt";

export default function AdminDocumentsPage() {
  const docs = useDemo((s) => s.docs);
  const clients = useDemo((s) => s.clients);
  const engagements = useDemo((s) => s.engagements);
  const acceptDoc = useDemo((s) => s.acceptDoc);
  const [filter, setFilter] = useState<Filter>("review");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "—";
  const engTitle = (id?: string) => engagements.find((e) => e.id === id)?.title;

  const counts = {
    review: docs.filter((d) => d.status === "uploaded").length,
    all: docs.length,
    requested: docs.filter((d) => d.status === "requested").length,
    finapt: docs.filter((d) => d.direction === "from-finapt").length,
  };

  const list = useMemo(() => {
    const byFilter = docs.filter((d) =>
      filter === "review" ? d.status === "uploaded" : filter === "requested" ? d.status === "requested" : filter === "finapt" ? d.direction === "from-finapt" : true,
    );
    const term = q.toLowerCase();
    const names = new Map(clients.map((c) => [c.id, c.name.toLowerCase()]));
    return byFilter
      .filter((d) => !term || d.title.toLowerCase().includes(term) || (names.get(d.clientId) ?? "").includes(term) || (d.fileName ?? "").toLowerCase().includes(term))
      .sort((a, b) => (b.uploadedAt ?? b.requestedAt ?? "").localeCompare(a.uploadedAt ?? a.requestedAt ?? ""));
  }, [docs, filter, q, clients]);

  const open = docs.find((d) => d.id === openId) ?? null;

  const tabs: { id: Filter; label: string }[] = [
    { id: "review", label: "To review" },
    { id: "all", label: "All documents" },
    { id: "requested", label: "Requested" },
    { id: "finapt", label: "Shared by FinApt" },
  ];

  return (
    <>
      <PageHeader eyebrow="Staff admin" title="Documents" />
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filter documents" className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.id} role="tab" type="button" aria-selected={filter === t.id} onClick={() => setFilter(t.id)} className={`btn btn-sm ${filter === t.id ? "btn-ink" : "btn-line"}`}>
              {t.label} <span className="t-num opacity-70">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <label htmlFor="doc-search" className="sr-only">Search documents</label>
        <input id="doc-search" className="field md:max-w-xs" placeholder="Search documents or clients…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {list.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="t-label border-b border-line-soft text-muted">
                <th className="p-4 text-start font-normal">Document</th>
                <th className="p-4 text-start font-normal">Client</th>
                <th className="p-4 text-start font-normal">Date</th>
                <th className="p-4 text-start font-normal">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {list.map((d) => (
                <tr key={d.id} className="hover:bg-paper/60">
                  <td className="p-4">
                    <button type="button" onClick={() => setOpenId(d.id)} className="flex items-center gap-3 text-start">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bone/70">
                        <Icon name={d.direction === "from-finapt" ? "upload" : "file"} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium hover:underline">{d.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {d.fileName ?? d.note ?? "Waiting for upload"}
                          {d.size && d.size !== "—" ? ` · ${d.size}` : ""}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/clients/${d.clientId}`} className="link-draw">{clientName(d.clientId)}</Link>
                    {engTitle(d.engagementId) ? <span className="block text-xs text-muted">{engTitle(d.engagementId)}</span> : null}
                  </td>
                  <td className="whitespace-nowrap p-4 text-muted">{d.uploadedAt ? fmtDate(d.uploadedAt) : d.requestedAt ? `Requested ${fmtDate(d.requestedAt)}` : "—"}</td>
                  <td className="p-4"><DocStatus doc={d} /></td>
                  <td className="whitespace-nowrap p-4 text-end">
                    <div className="flex justify-end gap-2">
                      {d.fileName ? (
                        <button type="button" className="btn btn-line btn-sm" onClick={() => setOpenId(d.id)}>
                          Open
                        </button>
                      ) : null}
                      {d.status === "uploaded" ? (
                        <button type="button" className="btn btn-ink btn-sm" onClick={() => acceptDoc(d.id)}>
                          Mark as checked
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>{filter === "review" ? "Nothing to review — all client uploads have been checked." : "No documents match."}</Empty>
      )}

      <DocPreview
        doc={open}
        meta={open ? [clientName(open.clientId), engTitle(open.engagementId)].filter(Boolean).join(" · ") : undefined}
        onClose={() => setOpenId(null)}
        actions={
          open?.status === "uploaded" ? (
            <button type="button" className="btn btn-ink btn-sm" onClick={() => acceptDoc(open.id)}>
              Mark as checked
            </button>
          ) : null
        }
      />
    </>
  );
}
