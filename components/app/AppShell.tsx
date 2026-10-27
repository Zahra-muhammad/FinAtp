"use client";

// Shared frame for the client portal and the staff admin: sidebar (tabs on
// mobile), notification bell, and live toasts.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { EXPO } from "@/components/motion/primitives";
import { Logo } from "@/components/ui/bits";
import { timeAgo } from "@/lib/demo/format";
import { useDemo, useSession } from "@/lib/demo/store";
import type { Notification } from "@/lib/demo/types";

export type NavItem = { href: string; label: string; icon: IconName; badge?: number };

export function AppShell({
  nav,
  orgName,
  orgMeta,
  userName,
  notifications,
  audience,
  clientId,
  children,
}: {
  nav: NavItem[];
  orgName: string;
  orgMeta: string;
  userName: string;
  notifications: Notification[];
  audience: "client" | "staff";
  clientId?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // The first item (Dashboard / Clients) is active unless another item matches.
  const isActive = (href: string) => (href === nav[0].href ? !nav.slice(1).some((n) => pathname.startsWith(n.href)) : pathname.startsWith(href));

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="on-ink sticky top-0 hidden h-dvh flex-col bg-ink px-4 py-6 text-paper lg:flex">
        <Link href={nav[0].href} className="px-3" aria-label={audience === "client" ? "Client portal dashboard" : "Staff admin home"}>
          <Logo tone="white" className="h-10 w-auto" />
        </Link>
        <p className="t-label mt-3 px-3 text-mist">{audience === "client" ? "Client portal" : "Staff admin"}</p>
        <nav aria-label="Primary" className="mt-10 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.95rem] transition-colors ${isActive(n.href) ? "text-paper" : "text-mist-2 hover:text-paper"}`}
            >
              {isActive(n.href) ? <motion.span layoutId={`nav-${audience}`} className="absolute inset-0 rounded-lg bg-ink-3" transition={{ duration: 0.5, ease: EXPO }} /> : null}
              <Icon name={n.icon} className="relative h-[18px] w-[18px]" />
              <span className="relative flex-1">{n.label}</span>
              {n.badge ? <span className="relative rounded-full bg-signal px-2 py-0.5 text-[11px] font-semibold text-ink">{n.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-auto flex min-h-11 items-center gap-3 rounded-lg px-3 text-[0.95rem] text-mist-2 transition-colors hover:text-paper">
          <Icon name="home" className="h-[18px] w-[18px]" />
          FinApt website
        </Link>
        <div className="mt-3 rounded-xl border border-ink-line p-4">
          <p className="text-sm font-medium">{orgName}</p>
          <p className="t-label mt-1 text-mist">{orgMeta}</p>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-8">
            <Link href={nav[0].href} className="shrink-0 lg:hidden" aria-label={audience === "client" ? "Client portal dashboard" : "Staff admin home"}>
              <Logo tone="blue" className="h-8 w-auto" />
            </Link>
            <p className="hidden truncate text-sm text-muted lg:block">{orgName}</p>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/" className="grid h-11 w-11 place-items-center rounded-full hover:bg-bone/60 lg:hidden" aria-label="FinApt website" title="FinApt website">
                <Icon name="home" className="h-5 w-5" />
              </Link>
              <Bell notifications={notifications} audience={audience} clientId={clientId} />
              <UserMenu name={userName} />
            </div>
          </div>
          {/* Tabs (mobile) */}
          <nav aria-label="Primary" className="-mb-px flex gap-1 overflow-x-auto px-3 lg:hidden">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm ${isActive(n.href) ? "border-ink font-medium text-ink" : "border-transparent text-muted"}`}
              >
                {n.label}
                {n.badge ? <span className="rounded-full bg-signal px-1.5 text-[10px] font-semibold text-ink">{n.badge}</span> : null}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main" className="px-4 pb-24 pt-8 md:px-8 md:pt-10">
          <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EXPO }}>
            {children}
          </motion.div>
        </main>
      </div>

      <Toasts notifications={notifications} />
    </div>
  );
}

// --- Notification bell ------------------------------------------------------

function Bell({ notifications, audience, clientId }: { notifications: Notification[]; audience: "client" | "staff"; clientId?: string }) {
  const [open, setOpen] = useState(false);
  const markRead = useDemo((s) => s.markRead);
  const unread = notifications.filter((n) => !n.read).length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-bone/60">
        <Icon name="bell" className="h-5 w-5" />
        {unread ? <span className="absolute end-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-signal px-1 text-[10px] font-semibold text-ink">{unread}</span> : null}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EXPO }}
            className="card absolute end-0 top-12 z-40 w-[min(92vw,380px)] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line-soft p-4">
              <p className="font-medium">Notifications</p>
              {unread ? (
                <button type="button" onClick={() => markRead(audience, clientId)} className="text-sm text-blue link-draw">
                  Mark all read
                </button>
              ) : null}
            </div>
            <ul className="max-h-[60vh] overflow-y-auto">
              {notifications.slice(0, 12).map((n) => (
                <li key={n.id}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="flex gap-3 border-b border-line-soft p-4 last:border-0 hover:bg-paper">
                    <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-line" : "bg-signal"}`} />
                    <span>
                      <span className={`block text-sm ${n.read ? "text-muted-2" : "font-medium"}`}>{n.text}</span>
                      <span className="block text-xs text-muted">{timeAgo(n.at)}</span>
                    </span>
                  </Link>
                </li>
              ))}
              {!notifications.length ? <li className="p-6 text-center text-sm text-muted">Nothing yet.</li> : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// --- Live toasts: new notifications that arrive while the page is open ------

function Toasts({ notifications }: { notifications: Notification[] }) {
  const reduce = useReducedMotion();
  const seen = useRef<Set<string> | null>(null);
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    if (!seen.current) {
      seen.current = new Set(notifications.map((n) => n.id));
      return;
    }
    const fresh = notifications.filter((n) => !seen.current!.has(n.id));
    fresh.forEach((n) => seen.current!.add(n.id));
    if (!fresh.length) return;
    setToasts((t) => [...fresh, ...t].slice(0, 3));
    const ids = fresh.map((f) => f.id);
    const timer = setTimeout(() => setToasts((t) => t.filter((x) => !ids.includes(x.id))), 6500);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className="pointer-events-none fixed bottom-4 end-4 start-4 z-50 flex flex-col items-end gap-2 sm:start-auto" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: reduce ? 0 : 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: reduce ? 0 : 40 }}
            transition={{ duration: 0.6, ease: EXPO }}
            className="on-ink pointer-events-auto w-full max-w-sm rounded-xl bg-ink p-4 text-paper shadow-2xl sm:w-96"
          >
            <Link href={t.href} className="flex gap-3">
              <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-signal" />
              <span>
                <span className="block text-sm font-medium">{t.text}</span>
                <span className="t-label mt-1 block text-mist">Live update · just now</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- User menu -------------------------------------------------------------

function UserMenu({ name }: { name: string }) {
  const router = useRouter();
  const signOut = useSession((s) => s.signOut);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <button
      type="button"
      onClick={() => {
        signOut();
        router.push("/login");
      }}
      className="group flex h-11 items-center gap-2 rounded-full ps-1 pe-3 hover:bg-bone/60"
      title="Sign out"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{initials}</span>
      <span className="hidden text-sm sm:block">
        <span className="group-hover:hidden">{name.split(" ")[0]}</span>
        <span className="hidden group-hover:inline">Sign out</span>
      </span>
    </button>
  );
}

// --- Icons -----------------------------------------------------------------

export type IconName = "home" | "layers" | "file" | "calendar" | "chat" | "receipt" | "plus" | "bell" | "users" | "upload" | "download" | "check";

const iconPaths: Record<IconName, string> = {
  home: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  file: "M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zM14 3v5h5",
  calendar: "M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z",
  chat: "M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  plus: "M12 5v14M5 12h14",
  bell: "M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0",
  users: "M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zM22 19v-1a4 4 0 00-3-3.9M16 4.1a3 3 0 010 5.8",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  check: "M5 13l4 4L19 7",
};

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={iconPaths[name]} />
    </svg>
  );
}
