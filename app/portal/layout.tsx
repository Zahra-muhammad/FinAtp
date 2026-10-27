"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell, type NavItem } from "@/components/app/AppShell";
import { Loading } from "@/components/app/ui";
import { useClientData, useDemoReady } from "@/lib/demo/hooks";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const ready = useDemoReady();
  const router = useRouter();
  const { user, client, docs, messages, notifications, invoices } = useClientData();

  useEffect(() => {
    if (ready && (!user || user.role !== "client")) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user || !client) return <Loading />;

  const requested = docs.filter((d) => d.status === "requested").length;
  const unpaid = invoices.filter((i) => i.status !== "paid").length;
  const lastMsg = messages[messages.length - 1];

  const nav: NavItem[] = [
    { href: "/portal", label: "Dashboard", icon: "home" },
    { href: "/portal/services", label: "Services", icon: "layers" },
    { href: "/portal/documents", label: "Documents", icon: "file", badge: requested || undefined },
    { href: "/portal/calendar", label: "Calendar", icon: "calendar" },
    { href: "/portal/messages", label: "Messages", icon: "chat", badge: lastMsg?.from === "staff" ? 1 : undefined },
    { href: "/portal/invoices", label: "Invoices", icon: "receipt", badge: unpaid || undefined },
    { href: "/portal/add", label: "Add a service", icon: "plus" },
  ];

  return (
    <AppShell nav={nav} orgName={client.name} orgMeta={`${client.authority}${client.trn ? ` · TRN ${client.trn}` : ""}`} userName={user.name} notifications={notifications} audience="client" clientId={client.id}>
      {children}
    </AppShell>
  );
}
