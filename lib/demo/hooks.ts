"use client";

import { useEffect, useMemo, useState } from "react";
import { startDemoSync, useDemo, useSession } from "./store";

/** True once the demo state has loaded from localStorage in this window. */
export function useDemoReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    startDemoSync(() => setReady(true));
  }, []);
  return ready;
}

export function useCurrentUser() {
  const userId = useSession((s) => s.userId);
  const users = useDemo((s) => s.users);
  return useMemo(() => users.find((u) => u.id === userId) ?? null, [users, userId]);
}

/** The signed-in client's company and everything that belongs to it. */
export function useClientData() {
  const user = useCurrentUser();
  const clients = useDemo((s) => s.clients);
  const engagements = useDemo((s) => s.engagements);
  const docs = useDemo((s) => s.docs);
  const messages = useDemo((s) => s.messages);
  const notifications = useDemo((s) => s.notifications);
  const invoices = useDemo((s) => s.invoices);
  const deadlines = useDemo((s) => s.deadlines);
  const bookings = useDemo((s) => s.bookings);
  const clientId = user?.clientId;
  return useMemo(() => {
    const mine = <T extends { clientId: string }>(xs: T[]) => xs.filter((x) => x.clientId === clientId);
    return {
      user,
      client: clients.find((c) => c.id === clientId) ?? null,
      engagements: mine(engagements),
      docs: mine(docs),
      messages: mine(messages),
      notifications: mine(notifications).filter((n) => n.audience === "client"),
      invoices: mine(invoices),
      deadlines: mine(deadlines),
      bookings: mine(bookings),
    };
  }, [user, clientId, clients, engagements, docs, messages, notifications, invoices, deadlines, bookings]);
}
