"use client";

// Staff inbox: every client conversation in one place.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/app/ui";
import { EXPO } from "@/components/motion/primitives";
import { getMember, team } from "@/data/team";
import { fmtDateTime, timeAgo } from "@/lib/demo/format";
import { useDemo } from "@/lib/demo/store";

function Inbox() {
  const router = useRouter();
  const search = useSearchParams();
  const clients = useDemo((s) => s.clients);
  const messages = useDemo((s) => s.messages);
  const staffMessage = useDemo((s) => s.staffMessage);
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const threads = useMemo(
    () =>
      clients
        .map((c) => {
          const msgs = messages.filter((m) => m.clientId === c.id);
          return { client: c, msgs, last: msgs[msgs.length - 1] };
        })
        .filter((t) => t.client.name.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (b.last?.at ?? "").localeCompare(a.last?.at ?? "")),
    [clients, messages, q],
  );

  const selectedId = search.get("client") ?? threads[0]?.client.id;
  const thread = threads.find((t) => t.client.id === selectedId) ?? threads[0];
  // Reply as the client's main FinApt contact by default.
  const [replyAs, setReplyAs] = useState("taha");
  const primaryStaffId = thread?.client.primaryStaffId;
  useEffect(() => {
    if (primaryStaffId) setReplyAs(primaryStaffId);
  }, [thread?.client.id, primaryStaffId]);

  const endRef = useRef<HTMLDivElement>(null);
  // Scroll the conversation (not the window) to the newest message.
  useEffect(() => {
    const list = endRef.current?.parentElement;
    if (list) list.scrollTop = list.scrollHeight;
  }, [thread?.msgs.length, thread?.client.id]);

  return (
    <>
      <PageHeader eyebrow="Staff admin" title="Messages" />
      <div className="card grid min-h-[min(72dvh,760px)] overflow-hidden md:grid-cols-[20rem_1fr]">
        {/* Thread list */}
        <aside aria-label="Conversations" className={`min-w-0 flex-col border-line-soft md:flex md:border-e ${search.get("client") ? "hidden" : "flex"}`}>
          <div className="border-b border-line-soft p-3">
            <label htmlFor="thread-search" className="sr-only">Search conversations</label>
            <input id="thread-search" className="field !min-h-10 !py-2" placeholder="Search clients…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {threads.map((t) => {
              const unread = t.last?.from === "client";
              const on = t.client.id === thread?.client.id;
              return (
                <li key={t.client.id}>
                  <button
                    type="button"
                    onClick={() => router.replace(`/admin/messages?client=${t.client.id}`, { scroll: false })}
                    aria-current={on ? "true" : undefined}
                    className={`flex w-full gap-3 border-b border-line-soft p-4 text-start transition-colors ${on ? "bg-blue-wash" : "hover:bg-paper"}`}
                  >
                    <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${unread ? "bg-signal" : "bg-transparent"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate ${unread ? "font-semibold" : "font-medium"}`}>{t.client.name}</span>
                        <span className="shrink-0 text-xs text-muted">{t.last ? timeAgo(t.last.at) : ""}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-muted">
                        {t.last ? `${t.last.from === "client" ? t.client.contact.name.split(" ")[0] : getMember(t.last.staffId ?? "")?.name.split(" ")[0]}: ${t.last.text}` : "No messages yet"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Conversation */}
        {thread ? (
          <section aria-label={`Conversation with ${thread.client.name}`} className={`min-w-0 flex-col md:flex ${search.get("client") ? "flex" : "hidden"}`}>
            <div className="flex items-center justify-between gap-3 border-b border-line-soft p-4">
              <div className="min-w-0">
                <button type="button" onClick={() => router.replace("/admin/messages")} className="mb-1 text-sm text-blue md:hidden">
                  ← All conversations
                </button>
                <p className="truncate font-medium">{thread.client.name}</p>
                <p className="truncate text-xs text-muted">
                  {thread.client.contact.name}, {thread.client.contact.title} · {thread.client.contact.email}
                </p>
              </div>
              <Link href={`/admin/clients/${thread.client.id}`} className="btn btn-line btn-sm shrink-0">
                Client file
              </Link>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-paper/60 p-4 md:p-6" aria-live="polite">
              <AnimatePresence initial={false}>
                {thread.msgs.map((m) => {
                  const staff = m.from === "staff";
                  return (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EXPO }} className={`flex ${staff ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[70%] ${staff ? "rounded-ee-md bg-ink text-paper" : "rounded-es-md border border-line bg-white"}`}>
                        <p className="text-[0.95rem] leading-relaxed">{m.text}</p>
                        <p className={`mt-1.5 text-[11px] ${staff ? "text-mist" : "text-muted"}`}>
                          {staff ? getMember(m.staffId ?? "")?.name ?? "FinApt" : thread.client.contact.name} · {fmtDateTime(m.at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {!thread.msgs.length ? <p className="py-10 text-center text-sm text-muted">No messages yet — start the conversation.</p> : null}
              <div ref={endRef} />
            </div>
            <form
              className="grid gap-2 border-t border-line-soft p-3 sm:grid-cols-[11rem_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                staffMessage(thread.client.id, replyAs, reply.trim());
                setReply("");
              }}
            >
              <label htmlFor="inbox-as" className="sr-only">Reply as</label>
              <select id="inbox-as" className="field" value={replyAs} onChange={(e) => setReplyAs(e.target.value)}>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <label htmlFor="inbox-reply" className="sr-only">Reply</label>
              <input id="inbox-reply" className="field" placeholder={`Reply to ${thread.client.contact.name.split(" ")[0]}…`} value={reply} onChange={(e) => setReply(e.target.value)} />
              <button type="submit" className="btn btn-ink" disabled={!reply.trim()}>
                Send
              </button>
            </form>
          </section>
        ) : null}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span aria-hidden className="h-2 w-2 rounded-full bg-signal" /> The client wrote last — waiting for a reply.
      </p>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Inbox />
    </Suspense>
  );
}
