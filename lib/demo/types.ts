// Shape of the shared mock state behind onboarding, the portal and admin.

import type { ServiceTypeId } from "@/data/service-types";

export type Jurisdiction = "mainland" | "freezone" | "offshore";

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "client" | "staff";
  clientId?: string;
};

export type Client = {
  id: string;
  name: string;
  jurisdiction: Jurisdiction;
  authority: string; // DET, DMCC, IFZA…
  industry: string;
  size: string;
  trn?: string;
  licenceNo?: string;
  yearEnd: string; // "31 December"
  contact: { name: string; title: string; email: string; phone: string };
  since: string; // ISO
  primaryStaffId: string;
  kyc: { tradeLicence: boolean; passport: boolean; emiratesId: boolean };
};

export type Actor = { kind: "staff"; staffId: string } | { kind: "client" } | { kind: "system" };

export type Update = {
  id: string;
  at: string;
  by: Actor;
  kind: "created" | "stage" | "note" | "request" | "deliverable" | "upload" | "approval" | "completed";
  text: string;
};

export type Engagement = {
  id: string;
  clientId: string;
  type: ServiceTypeId;
  title: string;
  period?: string;
  stageIndex: number;
  status: "active" | "completed";
  staffId: string;
  startedAt: string;
  dueDate?: string;
  completedAt?: string;
  updates: Update[]; // newest first
};

export type Doc = {
  id: string;
  clientId: string;
  engagementId?: string;
  title: string;
  direction: "from-client" | "from-finapt";
  status: "requested" | "uploaded" | "accepted" | "delivered";
  fileName?: string;
  size?: string;
  note?: string;
  requestedAt?: string;
  uploadedAt?: string;
};

export type Message = { id: string; clientId: string; from: "client" | "staff"; staffId?: string; text: string; at: string };

export type Notification = {
  id: string;
  audience: "client" | "staff";
  clientId: string;
  at: string;
  text: string;
  href: string;
  read: boolean;
};

export type Invoice = {
  id: string;
  clientId: string;
  number: string;
  issuedAt: string;
  dueAt: string;
  items: { label: string; amount: number }[];
  status: "paid" | "due" | "overdue";
  paidAt?: string;
};

export type Deadline = {
  id: string;
  clientId: string;
  title: string;
  date: string;
  kind: "vat" | "ct" | "licence" | "audit" | "visa" | "other";
};

export type Booking = { id: string; clientId: string; at: string; staffId: string; topic: string };

export type DemoState = {
  version: number;
  seededAt: string;
  users: User[];
  clients: Client[];
  engagements: Engagement[];
  docs: Doc[];
  messages: Message[];
  notifications: Notification[];
  invoices: Invoice[];
  deadlines: Deadline[];
  bookings: Booking[];
};
