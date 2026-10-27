// Display helpers for the portal and admin.

export function aed(n: number): string {
  return `AED ${n.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return new Date(iso).toLocaleDateString("en-GB", opts);
}

export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(iso: string, now: number = Date.now()): string {
  const s = Math.round((now - new Date(iso).getTime()) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "yesterday";
  if (d < 30) return `${d} days ago`;
  return fmtDate(iso);
}

export function daysUntil(iso: string, now: number = Date.now()): number {
  const a = new Date(new Date(now).toDateString()).getTime();
  const b = new Date(new Date(iso).toDateString()).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function dueLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d < 0) return `${-d} day${d === -1 ? "" : "s"} overdue`;
  if (d === 0) return "due today";
  if (d === 1) return "due tomorrow";
  return `in ${d} days`;
}

export const VAT_RATE = 0.05;

/** Invoice total including 5% VAT. */
export function invoiceTotal(i: { items: { amount: number }[] }): number {
  return i.items.reduce((a, b) => a + b.amount, 0) * (1 + VAT_RATE);
}

/** Pretend file size for mock uploads. */
export function fakeSize(file?: File): string {
  const bytes = file?.size ?? 200_000 + Math.random() * 2_000_000;
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}
