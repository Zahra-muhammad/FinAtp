// Seed data for the demo: fictional UAE clients at different stages, so the
// portal and admin look lived-in. All companies and people here are made up
// except the FinApt team (data/team.ts). Dates are relative to "now" so the
// demo always looks current.

import { serviceTypes, type ServiceTypeId } from "./service-types";
import type { Deadline, DemoState, Doc, Engagement, Invoice, Message, Notification, Update } from "@/lib/demo/types";

export const SEED_VERSION = 4;

export const demoAccounts = [
  { email: "rania@gulfstone.demo", password: "demo123", label: "Established client", who: "Rania Haddad — Gulfstone Logistics LLC", note: "Audit, quarterly VAT, monthly bookkeeping and corporate tax" },
  { email: "omar@alnoor.demo", password: "demo123", label: "New client", who: "Omar Al Mansoori — Al Noor Trading DMCC", note: "Company formation in progress" },
  { email: "staff@finapt.demo", password: "demo123", label: "FinApt staff (admin)", who: "FinApt team view", note: "Move stages, post updates, request documents" },
] as const;

let counter = 0;
const id = (p: string) => `${p}_${(++counter).toString(36)}`;

export function createSeed(nowMs: number = Date.now()): DemoState {
  counter = 0;
  const day = 86_400_000;
  // d days and h hours before now.
  const ago = (d: number, h = 0) => new Date(nowMs - d * day - h * 3_600_000).toISOString();
  const ahead = (d: number) => new Date(nowMs + d * day).toISOString();
  const now = new Date(nowMs);
  const year = now.getUTCFullYear();

  // Most recent quarter end (Mar/Jun/Sep/Dec) and the VAT due date after it.
  const qEndMonth = Math.floor(now.getUTCMonth() / 3) * 3; // 0-based month the current quarter started
  const lastQEnd = new Date(Date.UTC(year, qEndMonth, 0)); // last day of previous quarter
  const vatDue = new Date(lastQEnd.getTime() + 28 * day);
  const nextQEnd = new Date(Date.UTC(year, qEndMonth + 3, 0));
  const nextVatDue = new Date(nextQEnd.getTime() + 28 * day);
  const qLabel = (d: Date) => `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${d.getUTCFullYear()}`;
  const monthLabel = (d: Date) => d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const thisMonth = new Date(Date.UTC(year, now.getUTCMonth() - 1, 1));
  const prevMonth = new Date(Date.UTC(year, now.getUTCMonth() - 2, 1));
  const fy = year - 1;

  const upd = (at: string, by: Update["by"], kind: Update["kind"], text: string): Update => ({ id: id("u"), at, by, kind, text });
  const staff = (staffId: string) => ({ kind: "staff" as const, staffId });
  const client = { kind: "client" as const };
  const stageName = (t: ServiceTypeId, i: number) => serviceTypes[t].stages[i].label;

  const engagements: Engagement[] = [];
  const docs: Doc[] = [];
  const messages: Message[] = [];
  const notifications: Notification[] = [];
  const invoices: Invoice[] = [];
  const deadlines: Deadline[] = [];

  // --- 1. Gulfstone Logistics LLC — established client ------------------
  const g = "c_gulfstone";
  const gAudit = id("e");
  engagements.push({
    id: gAudit, clientId: g, type: "external-audit", title: `External audit — FY${fy}`, period: `FY${fy}`, stageIndex: 5, status: "active", staffId: "abdulla", startedAt: ago(48), dueDate: ahead(30),
    updates: [
      upd(ago(0, 2), staff("abdulla"), "deliverable", "Draft audited financial statements uploaded for your review."),
      upd(ago(0, 2), staff("abdulla"), "stage", `Moved to ${stageName("external-audit", 5)}.`),
      upd(ago(6), staff("abdulla"), "note", "All three queries on revenue cut-off and related-party balances are now closed. Thank you for the quick responses."),
      upd(ago(9), client, "upload", "Uploaded responses to audit queries."),
      upd(ago(12), staff("abdulla"), "stage", `Moved to ${stageName("external-audit", 4)} — 3 queries raised.`),
      upd(ago(22), staff("abdulla"), "stage", `Moved to ${stageName("external-audit", 3)}. Stock count observed at the Jebel Ali warehouse.`),
      upd(ago(30), client, "upload", "Uploaded trial balance, general ledger and bank confirmations."),
      upd(ago(40), staff("abdulla"), "request", "Document request list issued (14 items)."),
      upd(ago(46), client, "approval", "Engagement letter signed."),
      upd(ago(48), { kind: "system" }, "created", "Engagement opened."),
    ],
  });
  const gVat = id("e");
  engagements.push({
    id: gVat, clientId: g, type: "vat-return", title: `VAT return — ${qLabel(lastQEnd)}`, period: qLabel(lastQEnd), stageIndex: 1, status: "active", staffId: "taha", startedAt: ago(20), dueDate: vatDue.toISOString(),
    updates: [
      upd(ago(2), staff("taha"), "stage", `Moved to ${stageName("vat-return", 1)}. Reconciling input VAT on imports.`),
      upd(ago(4), client, "upload", "Uploaded sales and purchase registers."),
      upd(ago(20), { kind: "system" }, "created", "New VAT period opened."),
    ],
  });
  const gBook = id("e");
  engagements.push({
    id: gBook, clientId: g, type: "bookkeeping", title: `Bookkeeping — ${monthLabel(thisMonth)}`, period: monthLabel(thisMonth), stageIndex: 0, status: "active", staffId: "taha", startedAt: ago(3),
    updates: [
      upd(ago(1), staff("taha"), "request", "Requested: bank statements for the month (Emirates NBD current and USD accounts)."),
      upd(ago(3), { kind: "system" }, "created", "Monthly cycle opened."),
    ],
  });
  engagements.push({
    id: id("e"), clientId: g, type: "bookkeeping", title: `Bookkeeping — ${monthLabel(prevMonth)}`, period: monthLabel(prevMonth), stageIndex: 3, status: "completed", staffId: "taha", startedAt: ago(34), completedAt: ago(8),
    updates: [upd(ago(8), staff("taha"), "completed", "MIS report delivered. Month closed."), upd(ago(34), { kind: "system" }, "created", "Monthly cycle opened.")],
  });
  engagements.push({
    id: id("e"), clientId: g, type: "ct-return", title: `Corporate tax return — FY${fy}`, period: `FY${fy}`, stageIndex: 4, status: "completed", staffId: "taha", startedAt: ago(70), completedAt: ago(26),
    updates: [upd(ago(26), staff("taha"), "completed", "Return filed on EmaraTax and payment confirmed."), upd(ago(70), { kind: "system" }, "created", "Engagement opened.")],
  });

  docs.push(
    { id: id("d"), clientId: g, engagementId: gAudit, title: `Draft audited financial statements FY${fy}`, direction: "from-finapt", status: "delivered", fileName: `Gulfstone_FS_FY${fy}_DRAFT.pdf`, size: "1.8 MB", uploadedAt: ago(0, 2) },
    { id: id("d"), clientId: g, engagementId: gAudit, title: `Trial balance & general ledger FY${fy}`, direction: "from-client", status: "accepted", fileName: `TB_GL_FY${fy}.xlsx`, size: "4.2 MB", requestedAt: ago(40), uploadedAt: ago(30) },
    { id: id("d"), clientId: g, engagementId: gAudit, title: "Responses to audit queries", direction: "from-client", status: "accepted", fileName: "Audit_query_responses.pdf", size: "640 KB", requestedAt: ago(12), uploadedAt: ago(9) },
    { id: id("d"), clientId: g, engagementId: gVat, title: `Sales & purchase registers ${qLabel(lastQEnd)}`, direction: "from-client", status: "accepted", fileName: `VAT_registers_${qLabel(lastQEnd).replace(" ", "_")}.xlsx`, size: "980 KB", requestedAt: ago(18), uploadedAt: ago(4) },
    { id: id("d"), clientId: g, engagementId: gBook, title: `Bank statements — ${monthLabel(thisMonth)}`, direction: "from-client", status: "requested", note: "Emirates NBD current account and USD account, PDF or CSV.", requestedAt: ago(1) },
    { id: id("d"), clientId: g, title: `MIS report — ${monthLabel(prevMonth)}`, direction: "from-finapt", status: "delivered", fileName: `Gulfstone_MIS_${monthLabel(prevMonth).replace(" ", "_")}.pdf`, size: "720 KB", uploadedAt: ago(8) },
    { id: id("d"), clientId: g, title: `Corporate tax return acknowledgement FY${fy}`, direction: "from-finapt", status: "delivered", fileName: `CT_return_ack_FY${fy}.pdf`, size: "210 KB", uploadedAt: ago(26) },
    { id: id("d"), clientId: g, title: "Trade licence", direction: "from-client", status: "accepted", fileName: "Trade_Licence_2026.pdf", size: "350 KB", uploadedAt: ago(400) },
  );
  messages.push(
    { id: id("m"), clientId: g, from: "staff", staffId: "taha", text: "Good morning Rania — we've started on this quarter's VAT return. Could you confirm whether the two import shipments in the last month cleared customs before quarter end?", at: ago(3, 5) },
    { id: id("m"), clientId: g, from: "client", text: "Morning Taha. Yes, both cleared on the 28th — I'll forward the customs declarations.", at: ago(3, 3) },
    { id: id("m"), clientId: g, from: "staff", staffId: "taha", text: "Perfect, thank you. We'll pick them up from the registers you uploaded.", at: ago(3, 2) },
    { id: id("m"), clientId: g, from: "staff", staffId: "abdulla", text: "Rania, the draft audited financial statements are now in your documents. Shall we walk through them on a call this week?", at: ago(0, 2) },
  );
  notifications.push(
    { id: id("n"), audience: "client", clientId: g, at: ago(0, 2), text: "Your draft audit report is ready for review", href: `/portal/services/${gAudit}`, read: false },
    { id: id("n"), audience: "client", clientId: g, at: ago(1), text: "We need your bank statements for this month", href: "/portal/documents", read: false },
    { id: id("n"), audience: "client", clientId: g, at: ago(2), text: "VAT return: return is being prepared", href: `/portal/services/${gVat}`, read: true },
    { id: id("n"), audience: "staff", clientId: g, at: ago(4), text: "Gulfstone Logistics uploaded VAT registers", href: `/admin/clients/${g}`, read: true },
  );
  invoices.push(
    { id: id("i"), clientId: g, number: `INV-${year}-0412`, issuedAt: ago(46), dueAt: ago(16), items: [{ label: `External audit FY${fy} — 50% on engagement`, amount: 17500 }], status: "paid", paidAt: ago(20) },
    { id: id("i"), clientId: g, number: `INV-${year}-0507`, issuedAt: ago(8), dueAt: ahead(22), items: [{ label: `Bookkeeping & MIS — ${monthLabel(prevMonth)}`, amount: 4500 }], status: "due" },
    { id: id("i"), clientId: g, number: `INV-${year}-0398`, issuedAt: ago(70), dueAt: ago(40), items: [{ label: `Corporate tax return FY${fy}`, amount: 6500 }], status: "paid", paidAt: ago(41) },
    { id: id("i"), clientId: g, number: `INV-${year}-0455`, issuedAt: ago(38), dueAt: ago(8), items: [{ label: `Bookkeeping & MIS — ${monthLabel(new Date(Date.UTC(year, now.getUTCMonth() - 3, 1)))}`, amount: 4500 }], status: "overdue" },
  );
  deadlines.push(
    { id: id("k"), clientId: g, title: `VAT return ${qLabel(lastQEnd)}`, date: vatDue.toISOString(), kind: "vat" },
    { id: id("k"), clientId: g, title: `VAT return ${qLabel(nextQEnd)}`, date: nextVatDue.toISOString(), kind: "vat" },
    { id: id("k"), clientId: g, title: `Audit sign-off target FY${fy}`, date: ahead(30), kind: "audit" },
    { id: id("k"), clientId: g, title: "Trade licence renewal (DET)", date: ahead(81), kind: "licence" },
    { id: id("k"), clientId: g, title: `Corporate tax return FY${year}`, date: new Date(Date.UTC(year + 1, 8, 30)).toISOString(), kind: "ct" },
    { id: id("k"), clientId: g, title: "Employee visa renewals (3)", date: ahead(46), kind: "visa" },
  );

  // --- 2. Al Noor Trading DMCC — new client, formation in progress -------
  const a = "c_alnoor";
  const aForm = id("e");
  engagements.push({
    id: aForm, clientId: a, type: "formation-freezone", title: "Company setup — DMCC", stageIndex: 3, status: "active", staffId: "taha", startedAt: ago(9), dueDate: ahead(16),
    updates: [
      upd(ago(0, 1), staff("taha"), "request", "Incorporation documents and lease agreement ready for signature."),
      upd(ago(0, 1), staff("taha"), "stage", `Moved to ${stageName("formation-freezone", 3)}.`),
      upd(ago(2), staff("taha"), "stage", "Company name “Al Noor Trading DMCC” approved by DMCC."),
      upd(ago(5), client, "upload", "Uploaded passport and proof of address."),
      upd(ago(7), staff("taha"), "stage", "Application submitted to DMCC with shareholder KYC."),
      upd(ago(9), { kind: "system" }, "created", "Engagement opened after consultation."),
    ],
  });
  const aTax = id("e");
  engagements.push({
    id: aTax, clientId: a, type: "advisory", title: "Corporate tax & VAT registration", stageIndex: 0, status: "active", staffId: "taha", startedAt: ago(9),
    updates: [upd(ago(9), { kind: "system" }, "created", "Starts once the licence is issued.")],
  });
  docs.push(
    { id: id("d"), clientId: a, engagementId: aForm, title: "Incorporation documents (for signature)", direction: "from-finapt", status: "delivered", fileName: "AlNoor_DMCC_incorporation_pack.pdf", size: "2.4 MB", uploadedAt: ago(0, 1) },
    { id: id("d"), clientId: a, engagementId: aForm, title: "Signed incorporation documents", direction: "from-client", status: "requested", note: "Sign each page marked and upload one PDF.", requestedAt: ago(0, 1) },
    { id: id("d"), clientId: a, engagementId: aForm, title: "Shareholder passport", direction: "from-client", status: "accepted", fileName: "Passport_OAlMansoori.pdf", size: "1.1 MB", uploadedAt: ago(5) },
    { id: id("d"), clientId: a, engagementId: aForm, title: "Proof of address", direction: "from-client", status: "accepted", fileName: "Utility_bill.pdf", size: "420 KB", uploadedAt: ago(5) },
  );
  messages.push(
    { id: id("m"), clientId: a, from: "staff", staffId: "taha", text: "Welcome to FinApt, Omar. DMCC has approved the company name — next we just need your signature on the incorporation pack.", at: ago(2, 4) },
    { id: id("m"), clientId: a, from: "client", text: "Great news, thank you! How long until the licence is issued after signing?", at: ago(2, 2) },
    { id: id("m"), clientId: a, from: "staff", staffId: "taha", text: "Usually a few working days after DMCC receives the signed documents. You'll see it move here as soon as it's issued.", at: ago(1, 1) },
  );
  notifications.push(
    { id: id("n"), audience: "client", clientId: a, at: ago(0, 1), text: "Your incorporation documents are ready to sign", href: `/portal/services/${aForm}`, read: false },
    { id: id("n"), audience: "client", clientId: a, at: ago(2), text: "Company name approved by DMCC", href: `/portal/services/${aForm}`, read: true },
  );
  invoices.push({ id: id("i"), clientId: a, number: `INV-${year}-0521`, issuedAt: ago(9), dueAt: ahead(5), items: [{ label: "DMCC company setup — professional fees", amount: 9500 }], status: "due" });
  deadlines.push({ id: id("k"), clientId: a, title: "Target licence issue date", date: ahead(16), kind: "licence" }, { id: id("k"), clientId: a, title: "Corporate tax registration (after licence)", date: ahead(45), kind: "ct" });

  // --- 3–6. Other clients (admin view) -------------------------------
  const others: { cid: string; type: ServiceTypeId; title: string; stage: number; staffId: string; started: number; note: string }[] = [
    { cid: "c_meridian", type: "golden-visa", title: "Golden Visa — Dr. Leila Farah", stage: 4, staffId: "taha", started: 18, note: "Entry permit approved. Medical test booked." },
    { cid: "c_meridian", type: "ct-return", title: `Corporate tax return — FY${fy}`, stage: 2, staffId: "taha", started: 25, note: "Computation shared for approval." },
    { cid: "c_sablecrest", type: "due-diligence", title: "Financial & tax due diligence — Project Falcon", stage: 4, staffId: "saqib", started: 21, note: "Quality of earnings analysis under way with Swati Parashar." },
    { cid: "c_desertbloom", type: "liquidation-audit", title: "Liquidation audit", stage: 2, staffId: "abdulla", started: 15, note: "Fieldwork on final settlements." },
    { cid: "c_oasis", type: "bookkeeping", title: `Bookkeeping — ${monthLabel(thisMonth)}`, stage: 2, staffId: "taha", started: 6, note: "Bank reconciliation in progress." },
    { cid: "c_oasis", type: "vat-return", title: `VAT return — ${qLabel(lastQEnd)}`, stage: 2, staffId: "taha", started: 14, note: "Return ready for client approval." },
  ];
  for (const o of others) {
    engagements.push({
      id: id("e"), clientId: o.cid, type: o.type, title: o.title, stageIndex: o.stage, status: "active", staffId: o.staffId, startedAt: ago(o.started),
      updates: [upd(ago(1), staff(o.staffId), "stage", `Moved to ${stageName(o.type, o.stage)}. ${o.note}`), upd(ago(o.started), { kind: "system" }, "created", "Engagement opened.")],
    });
  }
  notifications.push(
    { id: id("n"), audience: "staff", clientId: "c_oasis", at: ago(0, 3), text: "Oasis Interiors: VAT return still awaiting client approval", href: "/admin/clients/c_oasis", read: false },
    { id: id("n"), audience: "staff", clientId: "c_meridian", at: ago(1), text: "Meridian Health uploaded eligibility documents", href: "/admin/clients/c_meridian", read: false },
  );

  return {
    version: SEED_VERSION,
    seededAt: new Date(nowMs).toISOString(),
    users: [
      { id: "u_rania", email: "rania@gulfstone.demo", password: "demo123", name: "Rania Haddad", role: "client", clientId: g },
      { id: "u_omar", email: "omar@alnoor.demo", password: "demo123", name: "Omar Al Mansoori", role: "client", clientId: a },
      { id: "u_staff", email: "staff@finapt.demo", password: "demo123", name: "FinApt team", role: "staff" },
    ],
    clients: [
      { id: g, name: "Gulfstone Logistics LLC", jurisdiction: "mainland", authority: "Dubai DET", industry: "Logistics & freight", size: "51–200 employees", trn: "100384572900003", licenceNo: "784512", yearEnd: "31 December", contact: { name: "Rania Haddad", title: "Finance Director", email: "rania@gulfstone.demo", phone: "+971 50 000 0001" }, since: ago(900), primaryStaffId: "taha", kyc: { tradeLicence: true, passport: true, emiratesId: true } },
      { id: a, name: "Al Noor Trading DMCC", jurisdiction: "freezone", authority: "DMCC", industry: "General trading", size: "1–10 employees", yearEnd: "31 December", contact: { name: "Omar Al Mansoori", title: "Founder", email: "omar@alnoor.demo", phone: "+971 50 000 0002" }, since: ago(9), primaryStaffId: "taha", kyc: { tradeLicence: false, passport: true, emiratesId: true } },
      { id: "c_meridian", name: "Meridian Health FZ-LLC", jurisdiction: "freezone", authority: "IFZA", industry: "Healthcare services", size: "11–50 employees", trn: "100527781400003", yearEnd: "31 March", contact: { name: "Dr. Leila Farah", title: "Managing Director", email: "leila@meridian.demo", phone: "+971 50 000 0003" }, since: ago(420), primaryStaffId: "taha", kyc: { tradeLicence: true, passport: true, emiratesId: true } },
      { id: "c_sablecrest", name: "Sable Crest Holdings Ltd", jurisdiction: "offshore", authority: "RAK ICC", industry: "Investment holding", size: "1–10 employees", yearEnd: "31 December", contact: { name: "James Whitford", title: "Investment Director", email: "james@sablecrest.demo", phone: "+971 50 000 0004" }, since: ago(60), primaryStaffId: "saqib", kyc: { tradeLicence: true, passport: true, emiratesId: false } },
      { id: "c_desertbloom", name: "Desert Bloom Trading LLC", jurisdiction: "mainland", authority: "Dubai DET", industry: "Retail", size: "11–50 employees", trn: "100219934500003", yearEnd: "31 December", contact: { name: "Priya Menon", title: "Director", email: "priya@desertbloom.demo", phone: "+971 50 000 0005" }, since: ago(700), primaryStaffId: "abdulla", kyc: { tradeLicence: true, passport: true, emiratesId: true } },
      { id: "c_oasis", name: "Oasis Interiors LLC", jurisdiction: "mainland", authority: "Sharjah SEDD", industry: "Interior fit-out", size: "11–50 employees", trn: "100662318700003", yearEnd: "30 June", contact: { name: "Karim Nassar", title: "Owner", email: "karim@oasis.demo", phone: "+971 50 000 0006" }, since: ago(300), primaryStaffId: "taha", kyc: { tradeLicence: true, passport: true, emiratesId: true } },
    ],
    engagements,
    docs,
    messages,
    notifications,
    invoices,
    deadlines,
    bookings: [{ id: id("b"), clientId: a, at: ahead(3), staffId: "taha", topic: "Bank account opening — what to prepare" }],
  };
}
