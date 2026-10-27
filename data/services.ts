// Service groups and sub-services — names and structure follow the Services
// menu on finaptgroup.com exactly (seven groups). `og` points at the original
// page whose full copy is rendered from data/og/pages.json.
// `engagement` links a sub-service to the portal stage model it runs on
// (data/service-types.ts). `blurb` is a one-line summary written for this
// concept (the original site has none).

import { photos, type Photo } from "./images";
import type { ServiceTypeId } from "./service-types";

export type SubService = {
  slug: string;
  name: string;
  blurb: string;
  engagement: ServiceTypeId;
  og: string;
  // In-page sections listed in the menu (Transaction Due Diligence).
  sections?: { label: string; anchor: string }[];
};

export type ServiceCategory = {
  slug: string;
  number: string;
  name: string;
  menuName: string; // exactly as in the original menu
  short: string;
  headline: [string, string]; // [plain, serif accent]
  intro: string;
  photo: Photo;
  subServices: SubService[];
  // Original overview page, when the group has one of its own.
  og?: string;
  defaultEngagement: ServiceTypeId;
};

export const categories: ServiceCategory[] = [
  {
    slug: "audit-assurance",
    number: "01",
    name: "Audit & Assurance",
    menuName: "Audit and Assurance",
    short: "Independent audits your shareholders, banks and regulators can rely on.",
    headline: ["Assurance that", "holds up."],
    intro:
      "Every audit is planned, executed and reviewed under a Partner. We test what matters, explain what we find, and deliver a report your stakeholders can rely on — without the surprises at the end.",
    photo: photos.towerFacade,
    og: "/audit-and-assurance/",
    defaultEngagement: "external-audit",
    subServices: [
      { slug: "external-audit", name: "External Audit", blurb: "Statutory audits of annual financial statements for mainland and free zone companies.", engagement: "external-audit", og: "/audit-and-assurance/external-audit-services-in-dubai/" },
      { slug: "tax-audit-assistance", name: "Tax Audit Assistance", blurb: "Support when the tax authority reviews your returns — preparing files, responses and reconciliations.", engagement: "advisory", og: "/audit-and-assurance/tax-audit-services-dubai/" },
      { slug: "ifrs-advisory", name: "IFRS Advisory Services", blurb: "Applying IFRS to complex transactions, first-time adoption and new standards.", engagement: "advisory", og: "/audit-and-assurance/ifrs-advisory-services/" },
      { slug: "liquidation-audit", name: "Liquidation Audit", blurb: "The audit and final accounts needed to close a company properly.", engagement: "liquidation-audit", og: "/audit-and-assurance/liquidation-audit-services-dubai/" },
      { slug: "stock-audit", name: "Stock Audit", blurb: "Independent counts and valuation of inventory for owners, lenders and insurers.", engagement: "advisory", og: "/audit-and-assurance/stock-audit-services-in-dubai/" },
      { slug: "agreed-upon-procedures", name: "Agreed Upon Procedures (AUP)", blurb: "Specific checks you define, reported factually — for lenders, partners or regulators.", engagement: "advisory", og: "/audit-and-assurance/agreed-upon-procedures-service-dubai/" },
    ],
  },
  {
    slug: "accounting-bookkeeping",
    number: "02",
    name: "Accounting & Bookkeeping",
    menuName: "Accounting and Bookkeeping",
    short: "Books that are always current, and numbers you can act on.",
    headline: ["Books that", "keep up."],
    intro:
      "From day-to-day bookkeeping to a part-time CFO, we keep your records current, reconciled and audit-ready — and turn them into monthly reporting you'll actually read.",
    photo: photos.szrTowers,
    og: "/accounting-and-bookkeeping/",
    defaultEngagement: "bookkeeping",
    subServices: [
      { slug: "bookkeeping", name: "Bookkeeping", blurb: "Monthly posting, reconciliation and month-end close.", engagement: "bookkeeping", og: "/accounting-and-bookkeeping/bookkeeping-services-in-dubai/" },
      { slug: "cloud-accounting", name: "Cloud Accounting", blurb: "Set-up and migration to cloud accounting, with bank feeds and approvals.", engagement: "bookkeeping", og: "/accounting-and-bookkeeping/cloud-accounting-services-in-dubai/" },
      { slug: "cfo-services", name: "CFO Services", blurb: "Senior finance leadership part-time: budgets, cash flow, board reporting.", engagement: "advisory", og: "/accounting-and-bookkeeping/cfo-services-in-dubai-uae/" },
      { slug: "fixed-assets-management", name: "Fixed Assets Management", blurb: "Registers, tagging, depreciation and periodic verification.", engagement: "advisory", og: "/accounting-and-bookkeeping/fixed-asset-management-services-dubai/" },
      { slug: "inventory-verification", name: "Inventory Verification", blurb: "Periodic counts reconciled to your books.", engagement: "advisory", og: "/accounting-and-bookkeeping/inventory-verification-services-in-dubai/" },
      { slug: "ar-ap-management", name: "(AR) & (AP) Management", blurb: "Invoicing, collections and supplier payments run on schedule.", engagement: "bookkeeping", og: "/accounting-and-bookkeeping/accounts-receivable-and-payable-management/" },
      { slug: "mis-reporting", name: "MIS Reporting", blurb: "Management packs tailored to how you run the business.", engagement: "bookkeeping", og: "/accounting-and-bookkeeping/mis-reporting-services-dubai/" },
      { slug: "financial-report-compilations", name: "Financial Report Compilations", blurb: "Financial statements compiled from your records, ready for audit or the bank.", engagement: "advisory", og: "/accounting-and-bookkeeping/financial-report-compilations-services-dubai/" },
    ],
  },
  {
    slug: "risk-compliance",
    number: "03",
    name: "Risk & Compliance",
    menuName: "Risk and Compliances",
    short: "Internal audit, governance, enterprise risk and regulatory compliance.",
    headline: ["Risk, seen", "early."],
    intro:
      "We help boards and management see risk clearly — through internal audit, governance frameworks, enterprise risk management, forensic work and regulatory compliance programmes.",
    photo: photos.perforatedTower,
    // The original group page repeats the Enterprise Risk Management page, so
    // the group shows its sub-services instead of duplicating that copy.
    defaultEngagement: "advisory",
    subServices: [
      { slug: "internal-audit", name: "Internal Audit — Risk Based Accounting & Reporting", blurb: "Risk-based internal audit, outsourced or co-sourced.", engagement: "advisory", og: "/internal-audit-services-dubai/" },
      { slug: "corporate-governance", name: "Corporate Governance Advisory — Policies & Process", blurb: "Policies, processes and board frameworks that fit your size.", engagement: "advisory", og: "/corporate-governance-advisory-in-uae/" },
      { slug: "enterprise-risk-management", name: "Enterprise Risk Management (ERM)", blurb: "Identify, rate and monitor the risks that matter.", engagement: "advisory", og: "/enterprise-risk-management-services-in-uae/" },
      { slug: "forensic-accounting", name: "Forensic Accounting & Fraud Risk Advisory", blurb: "Fraud risk reviews, investigations and forensic accounting.", engagement: "advisory", og: "/audit-and-assurance/forensic-audit-services-in-dubai/" },
      { slug: "regulatory-compliance", name: "Regulatory Compliance", blurb: "Mapping obligations and building the controls to meet them.", engagement: "advisory", og: "/regulatory-compliance-advisory-in-uae/" },
    ],
  },
  {
    slug: "tax",
    number: "04",
    name: "Tax Services",
    menuName: "Tax Services",
    short: "Corporate tax and VAT, handled from registration to filing.",
    headline: ["Tax, filed", "on time."],
    intro:
      "Corporate tax and VAT done properly: registration, implementation, returns and the advice in between. You'll see every return before it's filed, and every deadline before it's close.",
    photo: photos.futureMuseum,
    og: "/tax-services-in-dubai/",
    defaultEngagement: "vat-return",
    subServices: [
      { slug: "corporate-tax-implementation", name: "Corporate Tax Implementation", blurb: "Registration, impact on your structure and systems, and readiness for your first return.", engagement: "advisory", og: "/corporate-tax-implementation/" },
      { slug: "corporate-tax-vat-filing", name: "Corporate Tax and VAT Filing", blurb: "Returns prepared, reviewed with you, and filed on EmaraTax.", engagement: "vat-return", og: "/corporate-tax-and-vat-filing/" },
      { slug: "tax-impact-assessment", name: "Tax Impact Assessment", blurb: "What a new rule, structure or transaction means for your tax bill.", engagement: "advisory", og: "/tax-impact-assessment/" },
      { slug: "tax-training", name: "Tax Training for Finance Teams", blurb: "Practical sessions so your team handles day-to-day tax correctly.", engagement: "advisory", og: "/tax-training-for-finance-teams/" },
      { slug: "tax-health-check", name: "Tax Health Check", blurb: "A review of your tax position to find exposures before the authority does.", engagement: "advisory", og: "/tax-health-check/" },
      { slug: "complex-transactions", name: "Tax Advisory on Complex Transactions", blurb: "Tax structuring for restructurings, acquisitions and cross-border deals.", engagement: "advisory", og: "/tax-advisory-on-complex-transactions/" },
      { slug: "tax-refund", name: "Tax Refund Services", blurb: "Preparing and following up VAT refund claims.", engagement: "advisory", og: "/tax-refund-services/" },
      { slug: "excise-tax-registration", name: "Excise Tax Registration and Related Services", blurb: "Registration and ongoing excise compliance for designated goods.", engagement: "advisory", og: "/excise-tax-registration/" },
    ],
  },
  {
    slug: "financial-transaction-advisory",
    number: "05",
    name: "Financial & Transaction Advisory",
    menuName: "Financial and Transaction Advisory",
    short: "Due diligence, valuation and M&A support for decisions that matter.",
    headline: ["Deals, with", "eyes open."],
    intro:
      "Buying, selling, raising or planning: we test the numbers behind the decision. Due diligence, valuations, models and plans built for the people who have to sign.",
    photo: photos.burjDetail,
    defaultEngagement: "due-diligence",
    subServices: [
      {
        slug: "transaction-due-diligence",
        name: "Transaction Due Diligence",
        blurb: "Financial, tax, commercial, legal, operational and vendor due diligence.",
        engagement: "due-diligence",
        og: "/due-diligence/",
        sections: [
          { label: "Financial Due Diligence", anchor: "financial-due-diligence" },
          { label: "Tax Due Diligence", anchor: "tax-due-diligence" },
          { label: "Commercial Due Diligence", anchor: "commercial-due-diligence" },
          { label: "Legal Due Diligence", anchor: "legal-due-diligence" },
          { label: "Operational Due Diligence", anchor: "operational-due-diligence" },
          { label: "Vendor Due Diligence (Sell-side)", anchor: "vendor-due-diligence-sell-side" },
        ],
      },
      { slug: "valuation-modelling", name: "Valuation & Modelling", blurb: "Valuations and financial models for deals, disputes and planning.", engagement: "advisory", og: "/valuation-and-modelling-services/" },
      { slug: "strategic-business-planning", name: "Strategic and Business Planning", blurb: "Business plans and feasibility studies investors take seriously.", engagement: "advisory", og: "/strategic-business-planning/" },
      { slug: "ma-advisory", name: "M&A Advisory", blurb: "Support through the deal, from target to completion.", engagement: "advisory", og: "/ma-advisory/" },
    ],
  },
  {
    slug: "corporate-services",
    number: "06",
    name: "Corporate Services",
    menuName: "Corporate Services",
    short: "Company formation, licensing and visas — mainland, free zone or offshore.",
    headline: ["Set up,", "properly."],
    intro:
      "We set up and look after companies across the UAE: choosing the right jurisdiction, handling licensing and visas, and keeping everything renewed on time.",
    photo: photos.cityStreet,
    og: "/corporate-services/",
    defaultEngagement: "formation-freezone",
    subServices: [
      { slug: "mainland-company-formation", name: "Mainland Company Formation", blurb: "Licensing with the Department of Economy and Tourism, from trade name to visas.", engagement: "formation-mainland", og: "/mainland-company-formation/" },
      { slug: "free-zone-company-setup", name: "Free Zone Company Setup", blurb: "Setup in DMCC, IFZA, Meydan, RAKEZ, JAFZA and other free zones.", engagement: "formation-freezone", og: "/free-zone-company-setup/" },
      { slug: "offshore-company-setup", name: "Offshore Company Setup", blurb: "Offshore holding companies with RAK ICC, JAFZA and others.", engagement: "formation-offshore", og: "/offshore-company-setup/" },
      { slug: "local-sponsorship", name: "Local Sponsorship", blurb: "Local service agent and sponsor arrangements where required.", engagement: "advisory", og: "/local-sponsorship/" },
      { slug: "golden-visa", name: "Golden Visa Service", blurb: "Eligibility, applications and processing for long-term residence.", engagement: "golden-visa", og: "/golden-visa-service/" },
      { slug: "licensing-visa-services", name: "Licensing and Visa Services", blurb: "Renewals, amendments and employee visas.", engagement: "advisory", og: "/licensing-and-visa-services/" },
      { slug: "power-of-attorney", name: "Power of Attorney (POA) Services", blurb: "Drafting, notarisation and attestation of POAs.", engagement: "advisory", og: "/power-of-attorney-services/" },
    ],
  },
  {
    slug: "aml-cft-compliance",
    number: "07",
    name: "AML/CFT Compliance",
    menuName: "AML/CFT Compliance",
    short: "AML, CFT and CPF compliance advisory for designated businesses (DNFBPs).",
    headline: ["Compliance,", "inspection-ready."],
    intro:
      "End-to-end AML/CFT/CPF compliance advisory for Designated Non-Financial Businesses and Professions — from enterprise-wide risk assessment to goAML, training and inspection readiness.",
    photo: photos.dawnSkyline,
    og: "/aml-cft-compliance/",
    defaultEngagement: "advisory",
    subServices: [
      { slug: "aml-cft-advisory-dnfbps", name: "AML/CFT Compliance Advisory for DNFBPs", blurb: "Risk assessments, policies, goAML and inspection readiness for DNFBPs.", engagement: "advisory", og: "/aml-cft-compliance/" },
    ],
  },
];

export function getCategory(slug: string): ServiceCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubService(categorySlug: string, subSlug: string): { category: ServiceCategory; sub: SubService } | undefined {
  const category = getCategory(categorySlug);
  const sub = category?.subServices.find((s) => s.slug === subSlug);
  return category && sub ? { category, sub } : undefined;
}

/** A sub-service whose copy is the group page itself (AML/CFT) links to the group page. */
export function subHref(category: ServiceCategory, sub: SubService): string {
  return sub.og === category.og ? `/services/${category.slug}` : `/services/${category.slug}/${sub.slug}`;
}

export function findSubService(name: string): { category: ServiceCategory; sub: SubService } | undefined {
  for (const category of categories) {
    const sub = category.subServices.find((s) => s.name === name);
    if (sub) return { category, sub };
  }
  return undefined;
}

export const totalSubServices = categories.reduce((n, c) => n + c.subServices.length, 0);
