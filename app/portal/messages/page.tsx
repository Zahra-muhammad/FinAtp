"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app/ui";
import { EXPO } from "@/components/motion/primitives";
import { Portrait } from "@/components/ui/bits";
import { getMember } from "@/data/team";
import { fmtDateTime } from "@/lib/demo/format";
import { useClientData } from "@/lib/demo/hooks";
import { useDemo } from "@/lib/demo/store";

export default function MessagesPage() {
  const { client, messages } = useClientData();
  const send = useDemo((s) => s.clientMessage);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const contact = getMember(client!.primaryStaffId)!;

  // Scroll the message list (not the window) to the newest message.
  useEffect(() => {
    const list = endRef.current?.parentElement;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  return (
    <>
      <PageHeader eyebrow="Messages" title="Your FinApt team" />
      <div className="card flex h-[min(70dvh,720px)] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line-soft p-4">
          <Portrait member={contact} className="w-11 shrink-0 rounded-full" sizes="44px" />
          <div>
            <p className="font-medium">{contact.name}</p>
            <p className="text-xs text-muted">{contact.role} · usually replies within a few hours</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-paper/60 p-4 md:p-6" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const mineMsg = m.from === "client";
              const who = mineMsg ? "You" : getMember(m.staffId ?? "")?.name ?? "FinApt";
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EXPO }} className={`flex ${mineMsg ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[65%] ${mineMsg ? "rounded-ee-md bg-ink text-paper" : "rounded-es-md border border-line bg-white"}`}>
                    <p className="text-[0.95rem] leading-relaxed">{m.text}</p>
                    <p className={`mt-1.5 text-[11px] ${mineMsg ? "text-mist" : "text-muted"}`}>
                      {who} · {fmtDateTime(m.at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
        <form
          className="flex gap-2 border-t border-line-soft p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            send(client!.id, text.trim());
            setText("");
          }}
        >
          <label htmlFor="msg" className="sr-only">Message</label>
          <input id="msg" className="field" placeholder={`Message ${contact.name.split(" ")[0]}…`} value={text} onChange={(e) => setText(e.target.value)} />
          <button type="submit" className="btn btn-ink" disabled={!text.trim()}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
