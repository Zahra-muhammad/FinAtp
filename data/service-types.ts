// How each kind of engagement runs, stage by stage. Modelled on typical UAE
// practice (DET/free zone licensing, ISA-based audits, EmaraTax filing, ICP/GDRFA
// residence) — illustrative for the demo; FinApt should confirm.
//
// `clientAction` marks stages where the client has something to do; the
// portal shows that stage as "Action needed" and offers the button.

export type ServiceTypeId =
  | "formation-mainland"
  | "formation-freezone"
  | "formation-offshore"
  | "external-audit"
  | "liquidation-audit"
  | "vat-return"
  | "ct-return"
  | "bookkeeping"
  | "golden-visa"
  | "due-diligence"
  | "advisory";

export type Stage = {
  id: string;
  label: string;
  detail: string;
  clientAction?: { kind: "approve" | "upload" | "sign" | "attend"; label: string };
};

export type ServiceType = {
  id: ServiceTypeId;
  name: string;
  category: string; // data/services.ts slug
  recurring?: "monthly" | "quarterly" | "annual";
  typicalDuration: string;
  stages: Stage[];
};

export const serviceTypes: Record<ServiceTypeId, ServiceType> = {
  "formation-mainland": {
    id: "formation-mainland",
    name: "Mainland company formation",
    category: "corporate-services",
    typicalDuration: "3–6 weeks",
    stages: [
      { id: "activity", label: "Activity & legal form", detail: "Business activities and legal form confirmed with you." },
      { id: "name", label: "Trade name reserved", detail: "Trade name checked and reserved with the Department of Economy and Tourism." },
      { id: "initial", label: "Initial approval", detail: "Initial approval issued, confirming the activity can be licensed." },
      { id: "moa", label: "MOA signed", detail: "Memorandum of Association drafted and signed before a notary.", clientAction: { kind: "sign", label: "Sign the MOA" } },
      { id: "ejari", label: "Office & Ejari", detail: "Tenancy contract registered on Ejari for the licence address.", clientAction: { kind: "upload", label: "Upload tenancy contract" } },
      { id: "licence", label: "Licence issued", detail: "Trade licence issued." },
      { id: "establishment", label: "Establishment card", detail: "Immigration establishment card issued so the company can sponsor visas." },
      { id: "visas", label: "Visas", detail: "Entry permits, medical tests, Emirates ID biometrics and residence visas.", clientAction: { kind: "attend", label: "Attend medical & biometrics" } },
      { id: "bank", label: "Bank account", detail: "Corporate bank account opened.", clientAction: { kind: "attend", label: "Meet the bank" } },
    ],
  },
  "formation-freezone": {
    id: "formation-freezone",
    name: "Free zone company setup",
    category: "corporate-services",
    typicalDuration: "2–4 weeks",
    stages: [
      { id: "jurisdiction", label: "Free zone chosen", detail: "Free zone, licence type and activities chosen." },
      { id: "kyc", label: "Application & KYC", detail: "Application submitted with shareholder KYC documents.", clientAction: { kind: "upload", label: "Upload shareholder documents" } },
      { id: "name", label: "Name approval", detail: "Company name approved by the free zone authority." },
      { id: "documents", label: "Documents signed", detail: "Incorporation documents and lease signed.", clientAction: { kind: "sign", label: "Sign incorporation documents" } },
      { id: "licence", label: "Licence issued", detail: "Licence and certificate of incorporation issued." },
      { id: "establishment", label: "Establishment card", detail: "Immigration establishment card issued." },
      { id: "visas", label: "Visas", detail: "Investor and employee visas, medical tests and Emirates ID.", clientAction: { kind: "attend", label: "Attend medical & biometrics" } },
      { id: "bank", label: "Bank account", detail: "Corporate bank account opened.", clientAction: { kind: "attend", label: "Meet the bank" } },
    ],
  },
  "formation-offshore": {
    id: "formation-offshore",
    name: "Offshore company setup",
    category: "corporate-services",
    typicalDuration: "1–3 weeks",
    stages: [
      { id: "registry", label: "Registry chosen", detail: "Offshore registry and structure agreed." },
      { id: "kyc", label: "KYC & name", detail: "Shareholder KYC submitted and name approved.", clientAction: { kind: "upload", label: "Upload KYC documents" } },
      { id: "documents", label: "Documents signed", detail: "Memorandum and Articles signed.", clientAction: { kind: "sign", label: "Sign constitutional documents" } },
      { id: "incorporated", label: "Incorporated", detail: "Certificate of incorporation issued." },
      { id: "bank", label: "Bank account", detail: "Bank account opened.", clientAction: { kind: "attend", label: "Meet the bank" } },
    ],
  },
  "external-audit": {
    id: "external-audit",
    name: "External audit",
    category: "audit-assurance",
    recurring: "annual",
    typicalDuration: "4–8 weeks",
    stages: [
      { id: "engagement", label: "Engagement letter", detail: "Scope, timing and fees agreed and the engagement letter signed.", clientAction: { kind: "sign", label: "Sign engagement letter" } },
      { id: "planning", label: "Planning", detail: "Understanding the business, assessing risks and setting materiality." },
      { id: "pbc", label: "Document request", detail: "The 'prepared by client' list: trial balance, ledgers, confirmations, contracts.", clientAction: { kind: "upload", label: "Upload requested documents" } },
      { id: "fieldwork", label: "Fieldwork", detail: "Testing balances and transactions, confirmations and stock observation." },
      { id: "queries", label: "Queries", detail: "Questions and adjustments raised with management.", clientAction: { kind: "upload", label: "Respond to queries" } },
      { id: "draft", label: "Draft report", detail: "Draft financial statements and audit report shared for review.", clientAction: { kind: "approve", label: "Review & approve draft" } },
      { id: "mrl", label: "Representation letter", detail: "Management representation letter signed.", clientAction: { kind: "sign", label: "Sign representation letter" } },
      { id: "final", label: "Final signed report", detail: "Audited financial statements signed and issued." },
    ],
  },
  "liquidation-audit": {
    id: "liquidation-audit",
    name: "Liquidation audit",
    category: "audit-assurance",
    typicalDuration: "3–6 weeks",
    stages: [
      { id: "engagement", label: "Engagement letter", detail: "Engagement agreed and signed.", clientAction: { kind: "sign", label: "Sign engagement letter" } },
      { id: "records", label: "Records collected", detail: "Final books, bank statements and settlement evidence.", clientAction: { kind: "upload", label: "Upload final records" } },
      { id: "fieldwork", label: "Fieldwork", detail: "Assets realised, liabilities settled and balances verified." },
      { id: "draft", label: "Draft liquidation report", detail: "Draft report shared for review.", clientAction: { kind: "approve", label: "Review draft" } },
      { id: "final", label: "Final report issued", detail: "Signed liquidation report issued for the authority." },
      { id: "deregistration", label: "Deregistration support", detail: "Report submitted with the deregistration file." },
    ],
  },
  "vat-return": {
    id: "vat-return",
    name: "VAT return",
    category: "tax",
    recurring: "quarterly",
    typicalDuration: "Due 28 days after each period",
    stages: [
      { id: "data", label: "Data collection", detail: "Sales and purchase registers, invoices and import records.", clientAction: { kind: "upload", label: "Upload period records" } },
      { id: "prepared", label: "Return prepared", detail: "Return prepared and reconciled to your books." },
      { id: "approval", label: "Your approval", detail: "You review the figures and approve the return.", clientAction: { kind: "approve", label: "Approve return" } },
      { id: "filed", label: "Filed on EmaraTax", detail: "Return submitted to the Federal Tax Authority." },
      { id: "paid", label: "Payment confirmed", detail: "VAT payable settled (or refund position recorded)." },
    ],
  },
  "ct-return": {
    id: "ct-return",
    name: "Corporate tax return",
    category: "tax",
    recurring: "annual",
    typicalDuration: "Due 9 months after year-end",
    stages: [
      { id: "data", label: "Data collection", detail: "Audited or final financial statements and tax adjustments.", clientAction: { kind: "upload", label: "Upload financial statements" } },
      { id: "computation", label: "Tax computation", detail: "Taxable income computed, reliefs and elections considered." },
      { id: "approval", label: "Your approval", detail: "You review and approve the return.", clientAction: { kind: "approve", label: "Approve return" } },
      { id: "filed", label: "Filed on EmaraTax", detail: "Return submitted to the Federal Tax Authority." },
      { id: "paid", label: "Payment confirmed", detail: "Corporate tax payable settled." },
    ],
  },
  bookkeeping: {
    id: "bookkeeping",
    name: "Bookkeeping",
    category: "accounting-bookkeeping",
    recurring: "monthly",
    typicalDuration: "Monthly cycle",
    stages: [
      { id: "docs", label: "Documents received", detail: "Bank statements, invoices and receipts for the month.", clientAction: { kind: "upload", label: "Upload this month's documents" } },
      { id: "posted", label: "Transactions posted", detail: "Transactions coded and posted." },
      { id: "reconciled", label: "Reconciled & closed", detail: "Bank and control accounts reconciled; month closed." },
      { id: "mis", label: "MIS report delivered", detail: "Management report and commentary delivered." },
    ],
  },
  "golden-visa": {
    id: "golden-visa",
    name: "Golden Visa",
    category: "corporate-services",
    typicalDuration: "2–6 weeks",
    stages: [
      { id: "eligibility", label: "Eligibility check", detail: "Category confirmed (investor, entrepreneur, professional, property)." },
      { id: "documents", label: "Documents", detail: "Passport, photo, proof of eligibility and supporting documents.", clientAction: { kind: "upload", label: "Upload eligibility documents" } },
      { id: "application", label: "Application submitted", detail: "Application lodged with the residency authority." },
      { id: "permit", label: "Entry permit / status change", detail: "Entry permit issued or status changed in-country." },
      { id: "medical", label: "Medical test", detail: "Medical fitness test completed.", clientAction: { kind: "attend", label: "Attend medical test" } },
      { id: "eid", label: "Emirates ID biometrics", detail: "Biometrics captured for Emirates ID.", clientAction: { kind: "attend", label: "Attend biometrics" } },
      { id: "issued", label: "Visa issued", detail: "Ten-year residence visa issued." },
    ],
  },
  "due-diligence": {
    id: "due-diligence",
    name: "Due diligence",
    category: "financial-transaction-advisory",
    typicalDuration: "3–6 weeks",
    stages: [
      { id: "nda", label: "NDA & engagement", detail: "Confidentiality and engagement terms signed.", clientAction: { kind: "sign", label: "Sign NDA & engagement" } },
      { id: "request", label: "Information request", detail: "Information request list issued to the target." },
      { id: "dataroom", label: "Data room access", detail: "Virtual data room opened and documents indexed." },
      { id: "meetings", label: "Management meetings", detail: "Sessions with the target's management." },
      { id: "analysis", label: "Analysis", detail: "Quality of earnings, net debt, working capital and risk areas." },
      { id: "draft", label: "Draft findings", detail: "Red-flag findings shared and discussed.", clientAction: { kind: "approve", label: "Review draft findings" } },
      { id: "final", label: "Final report", detail: "Final due diligence report issued." },
    ],
  },
  advisory: {
    id: "advisory",
    name: "Advisory engagement",
    category: "risk-compliance",
    typicalDuration: "Agreed per engagement",
    stages: [
      { id: "engagement", label: "Engagement letter", detail: "Scope and timing agreed.", clientAction: { kind: "sign", label: "Sign engagement letter" } },
      { id: "scoping", label: "Scoping", detail: "Information gathered and approach agreed.", clientAction: { kind: "upload", label: "Upload requested information" } },
      { id: "work", label: "Fieldwork", detail: "The work itself." },
      { id: "draft", label: "Draft deliverable", detail: "Draft shared for your comments.", clientAction: { kind: "approve", label: "Review draft" } },
      { id: "final", label: "Final deliverable", detail: "Final report or deliverable issued." },
    ],
  },
};

export function stageProgress(typeId: ServiceTypeId, stageIndex: number, completed: boolean): number {
  const n = serviceTypes[typeId].stages.length;
  if (completed) return 100;
  return Math.round((stageIndex / n) * 100);
}
