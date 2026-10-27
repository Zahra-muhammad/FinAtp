"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { AppShell, type NavItem } from "@/components/app/AppShell";
import { Loading } from "@/components/app/ui";
import { useCurrentUser, useDemoReady } from "@/lib/demo/hooks";
import { useDemo } from "@/lib/demo/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const ready = useDemoReady();
  const router = useRouter();
  const user = useCurrentUser();
  const all = useDemo((s) => s.notifications);
  const docs = useDemo((s) => s.docs);
  const messages = useDemo((s) => s.messages);
  const invoices = useDemo((s) => s.invoices);
  const notifications = useMemo(() => all.filter((n) => n.audience === "staff"), [all]);

  // Badges: threads whose last message came from the client, uploads to
  // review, and overdue invoices.
  const badges = useMemo(() => {
    const last = new Map<string, string>();
    for (const m of messages) last.set(m.clientId, m.from);
    return {
      messages: [...last.values()].filter((f) => f === "client").length,
      docs: docs.filter((d) => d.status === "uploaded").length,
      invoices: invoices.filter((i) => i.status === "overdue").length,
    };
  }, [messages, docs, invoices]);

  useEffect(() => {
    if (ready && (!user || user.role !== "staff")) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "staff") return <Loading />;

  const nav: NavItem[] = [
    { href: "/admin", label: "Clients", icon: "users" },
    { href: "/admin/messages", label: "Messages", icon: "chat", badge: badges.messages || undefined },
    { href: "/admin/documents", label: "Documents", icon: "file", badge: badges.docs || undefined },
    { href: "/admin/invoices", label: "Invoices", icon: "receipt", badge: badges.invoices || undefined },
  ];
  return (
    <AppShell nav={nav} orgName="FinApt Group — staff view" orgMeta="Staff admin" userName="FinApt Team" notifications={notifications} audience="staff">
      {children}
    </AppShell>
  );
}
