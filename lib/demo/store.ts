"use client";

// Shared mock state for onboarding, the client portal and the staff admin.
// Persisted in localStorage so the demo survives refreshes; a `storage`
// listener re-reads it when another window changes it, so an update made in
// the admin window shows up in the portal window straight away.
//
// The signed-in user lives in sessionStorage instead, so one window can be
// the client and another the staff member at the same time.

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSeed, SEED_VERSION } from "@/data/seed";
import { serviceTypes, type ServiceTypeId } from "@/data/service-types";
import { getMember } from "@/data/team";
import type { Actor, Client, DemoState, Doc, Engagement, Notification, Update, User } from "./types";

export const STORAGE_KEY = "finapt-demo";

const uid = (p: string) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const nowIso = () => new Date().toISOString();

// Friendlier client notifications for key moments.
const specialNotices: Partial<Record<ServiceTypeId, Record<string, string>>> = {
  "external-audit": { draft: "Your draft audit report is ready for review", mrl: "Your management representation letter is ready to sign", final: "Your final signed audit report has been issued" },
  "vat-return": { approval: "Your VAT return is ready for approval", filed: "Your VAT return has been filed on EmaraTax" },
  "ct-return": { approval: "Your corporate tax return is ready for approval", filed: "Your corporate tax return has been filed on EmaraTax" },
  "formation-freezone": { documents: "Your incorporation documents are ready to sign", licence: "Your licence has been issued" },
  "formation-mainland": { moa: "Your MOA is ready for signing at the notary", licence: "Your trade licence has been issued" },
  "golden-visa": { medical: "Please attend your medical fitness test", issued: "Your Golden Visa has been issued" },
  "due-diligence": { draft: "Draft due diligence findings are ready for review", final: "The final due diligence report is ready" },
  bookkeeping: { mis: "Your monthly MIS report is ready" },
};

function stageNotice(e: Engagement, stageIndex: number): string {
  const type = serviceTypes[e.type];
  const stage = type.stages[stageIndex];
  const special = specialNotices[e.type]?.[stage.id];
  if (special) return special;
  switch (stage.clientAction?.kind) {
    case "approve":
      return `${e.title}: ${stage.label.toLowerCase()} — ready for your review`;
    case "sign":
      return `${e.title}: ready for your signature`;
    case "upload":
      return `${e.title}: we need documents from you`;
    case "attend":
      return `${e.title}: ${stage.label.toLowerCase()} — action needed`;
    default:
      return `${e.title} moved to “${stage.label}”`;
  }
}

function nextPeriod(e: Engagement): { title: string; period: string } | null {
  const t = serviceTypes[e.type];
  if (!t.recurring || !e.period) return null;
  let period = e.period;
  if (t.recurring === "monthly") {
    const d = new Date(`1 ${e.period}`);
    if (!Number.isNaN(d.getTime())) {
      d.setMonth(d.getMonth() + 1);
      period = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
  } else if (t.recurring === "quarterly") {
    const m = /^Q(\d) (\d{4})$/.exec(e.period);
    if (m) {
      const q = Number(m[1]);
      const y = Number(m[2]);
      period = q === 4 ? `Q1 ${y + 1}` : `Q${q + 1} ${y}`;
    }
  } else {
    const m = /^FY(\d{4})$/.exec(e.period);
    if (m) period = `FY${Number(m[1]) + 1}`;
  }
  return { title: e.title.replace(e.period, period), period };
}

export type NewClientInput = {
  services: { type: ServiceTypeId; title: string }[];
  company: { name: string; jurisdiction: Client["jurisdiction"]; authority: string; industry: string; size: string; trn?: string };
  contact: { name: string; title: string; email: string; phone: string; password: string };
  kyc: { tradeLicence?: string; passport?: string; emiratesId?: string };
  booking: { at: string; staffId: string; topic: string };
};

type Actions = {
  reset: () => void;
  // client
  clientUpload: (docId: string, fileName: string, size: string) => void;
  clientAddDoc: (clientId: string, title: string, fileName: string, size: string) => void;
  clientCompleteAction: (engagementId: string) => void;
  clientMessage: (clientId: string, text: string) => void;
  payInvoice: (invoiceId: string) => void;
  addServices: (clientId: string, services: { type: ServiceTypeId; title: string }[], note?: string) => void;
  markRead: (audience: "client" | "staff", clientId?: string) => void;
  createClient: (input: NewClientInput) => User;
  // staff
  advanceStage: (engagementId: string, note?: string) => void;
  revertStage: (engagementId: string) => void;
  postUpdate: (engagementId: string, text: string) => void;
  requestDocument: (engagementId: string, title: string, note?: string) => void;
  uploadDeliverable: (engagementId: string, title: string, fileName: string, size: string) => void;
  acceptDoc: (docId: string) => void;
  staffMessage: (clientId: string, staffId: string, text: string) => void;
  createInvoice: (clientId: string, label: string, amount: number, dueInDays: number) => void;
  markInvoicePaid: (invoiceId: string) => void;
  remindInvoice: (invoiceId: string) => void;
};

export type DemoStore = DemoState & Actions;

const dataKeys: (keyof DemoState)[] = ["version", "seededAt", "users", "clients", "engagements", "docs", "messages", "notifications", "invoices", "deadlines", "bookings"];

export const useDemo = create<DemoStore>()(
  persist(
    (set, get) => {
      // Small helpers that write through `set`.
      const patchEngagement = (id: string, fn: (e: Engagement) => Engagement) =>
        set((s) => ({ engagements: s.engagements.map((e) => (e.id === id ? fn(e) : e)) }));
      const notify = (n: Omit<Notification, "id" | "at" | "read">) =>
        set((s) => ({ notifications: [{ ...n, id: uid("n"), at: nowIso(), read: false }, ...s.notifications] }));
      const addUpdate = (e: Engagement, by: Actor, kind: Update["kind"], text: string): Engagement => ({
        ...e,
        updates: [{ id: uid("u"), at: nowIso(), by, kind, text }, ...e.updates],
      });
      const clientName = (clientId: string) => get().clients.find((c) => c.id === clientId)?.name ?? "Client";
      const eng = (id: string) => get().engagements.find((e) => e.id === id);

      return {
        ...createSeed(),

        reset: () => set({ ...createSeed() }),

        // ------------------------------------------------------------ client
        clientUpload: (docId, fileName, size) => {
          const doc = get().docs.find((d) => d.id === docId);
          if (!doc) return;
          set((s) => ({ docs: s.docs.map((d) => (d.id === docId ? { ...d, status: "uploaded", fileName, size, uploadedAt: nowIso() } : d)) }));
          if (doc.engagementId) patchEngagement(doc.engagementId, (e) => addUpdate(e, { kind: "client" }, "upload", `Uploaded “${doc.title}”.`));
          notify({ audience: "staff", clientId: doc.clientId, text: `${clientName(doc.clientId)} uploaded ${doc.title}`, href: `/admin/clients/${doc.clientId}#documents` });
        },

        clientAddDoc: (clientId, title, fileName, size) => {
          const doc: Doc = { id: uid("d"), clientId, title, direction: "from-client", status: "uploaded", fileName, size, uploadedAt: nowIso() };
          set((s) => ({ docs: [doc, ...s.docs] }));
          notify({ audience: "staff", clientId, text: `${clientName(clientId)} uploaded ${title}`, href: `/admin/clients/${clientId}#documents` });
        },

        clientCompleteAction: (engagementId) => {
          const e = eng(engagementId);
          if (!e || e.status === "completed") return;
          const type = serviceTypes[e.type];
          const stage = type.stages[e.stageIndex];
          const verb = stage.clientAction?.kind === "sign" ? "Signed" : stage.clientAction?.kind === "approve" ? "Approved" : "Completed";
          const isLast = e.stageIndex >= type.stages.length - 1;
          patchEngagement(engagementId, (x) => {
            let next = addUpdate(x, { kind: "client" }, "approval", `${verb}: ${stage.label}.`);
            if (!isLast) next = { ...next, stageIndex: x.stageIndex + 1 };
            return next;
          });
          notify({ audience: "staff", clientId: e.clientId, text: `${clientName(e.clientId)} — ${verb.toLowerCase()} ${stage.label.toLowerCase()} (${e.title})`, href: `/admin/clients/${e.clientId}` });
        },

        clientMessage: (clientId, text) => {
          set((s) => ({ messages: [...s.messages, { id: uid("m"), clientId, from: "client", text, at: nowIso() }] }));
          notify({ audience: "staff", clientId, text: `New message from ${clientName(clientId)}`, href: `/admin/messages?client=${clientId}` });
        },

        payInvoice: (invoiceId) => {
          const inv = get().invoices.find((i) => i.id === invoiceId);
          set((s) => ({ invoices: s.invoices.map((i) => (i.id === invoiceId ? { ...i, status: "paid", paidAt: nowIso() } : i)) }));
          if (inv) notify({ audience: "staff", clientId: inv.clientId, text: `${clientName(inv.clientId)} paid ${inv.number}`, href: `/admin/invoices` });
        },

        addServices: (clientId, services, note) => {
          const client = get().clients.find((c) => c.id === clientId);
          const created: Engagement[] = services.map((sv) => {
            const t = serviceTypes[sv.type];
            const staffId = t.category === "audit-assurance" || t.category === "risk-compliance" ? "abdulla" : t.category === "financial-transaction-advisory" ? "saqib" : client?.primaryStaffId ?? "taha";
            return {
              id: uid("e"),
              clientId,
              type: sv.type,
              title: sv.title,
              stageIndex: 0,
              status: "active",
              staffId,
              startedAt: nowIso(),
              updates: [{ id: uid("u"), at: nowIso(), by: { kind: "system" }, kind: "created", text: note ?? "Requested from the client portal. A partner will confirm scope shortly." }],
            };
          });
          set((s) => ({ engagements: [...created, ...s.engagements] }));
          notify({ audience: "staff", clientId, text: `${clientName(clientId)} requested ${services.map((x) => x.title).join(", ")}`, href: `/admin/clients/${clientId}` });
        },

        markRead: (audience, clientId) =>
          set((s) => ({
            notifications: s.notifications.map((n) => (n.audience === audience && (!clientId || n.clientId === clientId) ? { ...n, read: true } : n)),
          })),

        createClient: (input) => {
          const clientId = uid("c");
          const user: User = { id: uid("usr"), email: input.contact.email.toLowerCase(), password: input.contact.password, name: input.contact.name, role: "client", clientId };
          const primaryStaffId = input.booking.staffId;
          const client: Client = {
            id: clientId,
            name: input.company.name,
            jurisdiction: input.company.jurisdiction,
            authority: input.company.authority,
            industry: input.company.industry,
            size: input.company.size,
            trn: input.company.trn || undefined,
            yearEnd: "31 December",
            contact: { name: input.contact.name, title: input.contact.title, email: input.contact.email, phone: input.contact.phone },
            since: nowIso(),
            primaryStaffId,
            kyc: { tradeLicence: !!input.kyc.tradeLicence, passport: !!input.kyc.passport, emiratesId: !!input.kyc.emiratesId },
          };
          const kycDocs: Doc[] = (
            [
              ["Trade licence", input.kyc.tradeLicence],
              ["Passport", input.kyc.passport],
              ["Emirates ID", input.kyc.emiratesId],
            ] as const
          )
            .filter(([, f]) => !!f)
            .map(([title, f]) => ({ id: uid("d"), clientId, title, direction: "from-client", status: "uploaded", fileName: f!, size: "—", uploadedAt: nowIso() }));
          set((s) => ({
            users: [...s.users, user],
            clients: [...s.clients, client],
            docs: [...kycDocs, ...s.docs],
            bookings: [...s.bookings, { id: uid("b"), clientId, ...input.booking }],
            messages: [
              ...s.messages,
              {
                id: uid("m"),
                clientId,
                from: "staff",
                staffId: primaryStaffId,
                text: `Welcome to FinApt, ${input.contact.name.split(" ")[0]}. I'll be your main contact — looking forward to our consultation on ${new Date(input.booking.at).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}.`,
                at: nowIso(),
              },
            ],
          }));
          get().addServices(clientId, input.services, "Opened at sign-up. Scope will be confirmed at your consultation.");
          notify({ audience: "client", clientId, text: `Consultation booked with ${getMember(primaryStaffId)?.name ?? "FinApt"}`, href: "/portal/calendar" });
          notify({ audience: "staff", clientId, text: `New client signed up: ${client.name}`, href: `/admin/clients/${clientId}` });
          return user;
        },

        // ------------------------------------------------------------- staff
        advanceStage: (engagementId, note) => {
          const e = eng(engagementId);
          if (!e || e.status === "completed") return;
          const type = serviceTypes[e.type];
          const by: Actor = { kind: "staff", staffId: e.staffId };
          if (e.stageIndex >= type.stages.length - 1) {
            // Final stage done: complete, and roll recurring work forward.
            patchEngagement(engagementId, (x) => ({ ...addUpdate(x, by, "completed", note || `${type.stages[x.stageIndex].label} — engagement complete.`), status: "completed", completedAt: nowIso() }));
            notify({ audience: "client", clientId: e.clientId, text: `${e.title} is complete`, href: `/portal/services/${e.id}` });
            const np = nextPeriod(e);
            if (np) {
              const fresh: Engagement = {
                id: uid("e"), clientId: e.clientId, type: e.type, title: np.title, period: np.period, stageIndex: 0, status: "active", staffId: e.staffId, startedAt: nowIso(),
                updates: [{ id: uid("u"), at: nowIso(), by: { kind: "system" }, kind: "created", text: `Next ${type.recurring === "monthly" ? "month" : "period"} opened automatically.` }],
              };
              set((s) => ({ engagements: [fresh, ...s.engagements] }));
            }
            return;
          }
          const to = e.stageIndex + 1;
          patchEngagement(engagementId, (x) => ({ ...addUpdate(x, by, "stage", `Moved to ${type.stages[to].label}.${note ? ` ${note}` : ""}`), stageIndex: to }));
          notify({ audience: "client", clientId: e.clientId, text: stageNotice(e, to), href: `/portal/services/${e.id}` });
        },

        revertStage: (engagementId) => {
          const e = eng(engagementId);
          if (!e) return;
          const type = serviceTypes[e.type];
          const to = Math.max(0, e.status === "completed" ? e.stageIndex : e.stageIndex - 1);
          patchEngagement(engagementId, (x) => ({ ...addUpdate(x, { kind: "staff", staffId: e.staffId }, "stage", `Moved back to ${type.stages[to].label}.`), stageIndex: to, status: "active", completedAt: undefined }));
        },

        postUpdate: (engagementId, text) => {
          const e = eng(engagementId);
          if (!e) return;
          patchEngagement(engagementId, (x) => addUpdate(x, { kind: "staff", staffId: e.staffId }, "note", text));
          notify({ audience: "client", clientId: e.clientId, text: `${getMember(e.staffId)?.name ?? "FinApt"} posted an update on ${e.title}`, href: `/portal/services/${e.id}` });
        },

        requestDocument: (engagementId, title, note) => {
          const e = eng(engagementId);
          if (!e) return;
          const doc: Doc = { id: uid("d"), clientId: e.clientId, engagementId, title, direction: "from-client", status: "requested", note, requestedAt: nowIso() };
          set((s) => ({ docs: [doc, ...s.docs] }));
          patchEngagement(engagementId, (x) => addUpdate(x, { kind: "staff", staffId: e.staffId }, "request", `Requested: ${title}.`));
          notify({ audience: "client", clientId: e.clientId, text: `Document requested: ${title}`, href: "/portal/documents" });
        },

        uploadDeliverable: (engagementId, title, fileName, size) => {
          const e = eng(engagementId);
          if (!e) return;
          const doc: Doc = { id: uid("d"), clientId: e.clientId, engagementId, title, direction: "from-finapt", status: "delivered", fileName, size, uploadedAt: nowIso() };
          set((s) => ({ docs: [doc, ...s.docs] }));
          patchEngagement(engagementId, (x) => addUpdate(x, { kind: "staff", staffId: e.staffId }, "deliverable", `Shared “${title}”.`));
          notify({ audience: "client", clientId: e.clientId, text: `New from FinApt: ${title}`, href: "/portal/documents" });
        },

        acceptDoc: (docId) => {
          const doc = get().docs.find((d) => d.id === docId);
          set((s) => ({ docs: s.docs.map((d) => (d.id === docId ? { ...d, status: "accepted" } : d)) }));
          if (doc) notify({ audience: "client", clientId: doc.clientId, text: `Received and checked: ${doc.title}`, href: "/portal/documents" });
        },

        staffMessage: (clientId, staffId, text) => {
          set((s) => ({ messages: [...s.messages, { id: uid("m"), clientId, from: "staff", staffId, text, at: nowIso() }] }));
          notify({ audience: "client", clientId, text: `New message from ${getMember(staffId)?.name ?? "FinApt"}`, href: "/portal/messages" });
        },

        createInvoice: (clientId, label, amount, dueInDays) => {
          const year = new Date().getFullYear();
          const next = get().invoices.reduce((max, i) => Math.max(max, Number(/-(\d+)$/.exec(i.number)?.[1] ?? 0)), 0) + 1;
          const number = `INV-${year}-${String(next).padStart(4, "0")}`;
          set((s) => ({
            invoices: [
              { id: uid("i"), clientId, number, issuedAt: nowIso(), dueAt: new Date(Date.now() + dueInDays * 86_400_000).toISOString(), items: [{ label, amount }], status: "due" },
              ...s.invoices,
            ],
          }));
          notify({ audience: "client", clientId, text: `New invoice ${number}: ${label}`, href: "/portal/invoices" });
        },

        markInvoicePaid: (invoiceId) =>
          set((s) => ({ invoices: s.invoices.map((i) => (i.id === invoiceId ? { ...i, status: "paid", paidAt: nowIso() } : i)) })),

        remindInvoice: (invoiceId) => {
          const inv = get().invoices.find((i) => i.id === invoiceId);
          if (inv) notify({ audience: "client", clientId: inv.clientId, text: `Payment reminder: ${inv.number} is ${inv.status === "overdue" ? "overdue" : "due soon"}`, href: "/portal/invoices" });
        },
      };
    },
    {
      name: STORAGE_KEY,
      version: SEED_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => Object.fromEntries(dataKeys.map((k) => [k, s[k]])) as unknown as DemoStore,
      // Any older saved shape is replaced with fresh seed data.
      migrate: () => createSeed() as unknown as DemoStore,
    },
  ),
);

// --- Session (per browser tab) -------------------------------------------

type SessionStore = { userId: string | null; signIn: (userId: string) => void; signOut: () => void };

export const useSession = create<SessionStore>()(
  persist(
    (set) => ({
      userId: null,
      signIn: (userId) => set({ userId }),
      signOut: () => set({ userId: null }),
    }),
    { name: "finapt-session", storage: createJSONStorage(() => sessionStorage), skipHydration: true },
  ),
);

// --- Hydration & cross-window sync ----------------------------------------

let started = false;
export function startDemoSync(onReady: () => void) {
  if (started) {
    onReady();
    return;
  }
  started = true;
  Promise.all([useDemo.persist.rehydrate(), useSession.persist.rehydrate()]).then(() => {
    // First visit: save the seed now so every other window shares it.
    if (!localStorage.getItem(STORAGE_KEY)) useDemo.setState({ seededAt: new Date().toISOString() });
    onReady();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) void useDemo.persist.rehydrate();
  });
}

export function signInWith(email: string, password: string): User | null {
  const user = useDemo.getState().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
  if (user) useSession.getState().signIn(user.id);
  return user ?? null;
}
