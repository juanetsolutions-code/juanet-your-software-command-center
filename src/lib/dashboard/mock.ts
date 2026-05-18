/**
 * Local mock data for the client dashboard.
 *
 * This module is the ONLY place that hard-codes demo content. Routes and
 * components must read data exclusively through `./api.ts`, so swapping
 * the mock layer for Supabase later is a one-file change.
 */

import type {
  ActivityItem,
  BillingAddress,
  Conversation,
  DashboardSummary,
  Invoice,
  Message,
  PaymentMethod,
  Project,
  ProjectTimelineEvent,
  ServiceRequest,
} from "./types";

export const mockProjects: Project[] = [
  {
    id: "cp-01",
    name: "Atlas Banking Core",
    client: "Atlas Financial",
    category: "FinTech",
    status: "in progress",
    progress: 64,
    dueAt: "2025-09-12T00:00:00.000Z",
    dueLabel: "Sep 12, 2025",
    leadName: "Marcus Otieno",
    updatedLabel: "12m ago",
  },
  {
    id: "cp-02",
    name: "MediTrack HMS",
    client: "Nairobi Health",
    category: "Healthcare",
    status: "in progress",
    progress: 88,
    dueAt: "2025-08-02T00:00:00.000Z",
    dueLabel: "Aug 02, 2025",
    leadName: "Aisha Kamau",
    updatedLabel: "1h ago",
  },
  {
    id: "cp-03",
    name: "Harvest ERP",
    client: "Greenfields",
    category: "Agritech",
    status: "pending",
    progress: 12,
    dueAt: "2025-11-20T00:00:00.000Z",
    dueLabel: "Nov 20, 2025",
    leadName: "Brian Mwangi",
    updatedLabel: "Yesterday",
  },
  {
    id: "cp-04",
    name: "Skyline LMS v2",
    client: "Skyline Academy",
    category: "Education",
    status: "completed",
    progress: 100,
    dueAt: "2025-06-30T00:00:00.000Z",
    dueLabel: "Jun 30, 2025",
    leadName: "Joy Wanjiru",
    updatedLabel: "3 days ago",
  },
  {
    id: "cp-05",
    name: "RetailOps CRM",
    client: "Urban Retail",
    category: "Retail",
    status: "in progress",
    progress: 48,
    dueAt: "2025-09-28T00:00:00.000Z",
    dueLabel: "Sep 28, 2025",
    leadName: "Kelvin Njoroge",
    updatedLabel: "4h ago",
  },
  {
    id: "cp-06",
    name: "Logix Fleet",
    client: "Logix",
    category: "Logistics",
    status: "pending",
    progress: 8,
    dueAt: "2025-12-10T00:00:00.000Z",
    dueLabel: "Dec 10, 2025",
    leadName: "Marcus Otieno",
    updatedLabel: "2 days ago",
  },
];

/**
 * Returns the canonical 6-step delivery timeline for a project,
 * with `done` derived from the project's progress / status.
 */
export function buildProjectTimeline(project: Project): ProjectTimelineEvent[] {
  return [
    { id: "t1", title: "Kickoff & discovery", dateLabel: "Apr 04", done: true },
    { id: "t2", title: "Design system & wireframes", dateLabel: "Apr 18", done: true },
    { id: "t3", title: "Sprint 1 — auth + core", dateLabel: "May 02", done: project.progress > 30 },
    { id: "t4", title: "Sprint 2 — features", dateLabel: "May 18", done: project.progress > 60 },
    { id: "t5", title: "QA & UAT", dateLabel: "Jun 02", done: project.progress > 85 },
    { id: "t6", title: "Production launch", dateLabel: project.dueLabel, done: project.status === "completed" },
  ];
}

export const mockRequests: ServiceRequest[] = [
  { id: "RQ-204", title: "Internal HR portal", status: "in progress", submittedLabel: "May 14" },
  { id: "RQ-203", title: "Stripe + M-Pesa checkout", status: "pending", submittedLabel: "May 10" },
  { id: "RQ-202", title: "Marketing site redesign", status: "completed", submittedLabel: "Apr 30" },
];

export const mockBudgetRanges = ["< $5k", "$5k – $15k", "$15k – $50k", "$50k+"];
export const mockTimelines = ["< 1 month", "1–3 months", "3–6 months", "6+ months"];

export const mockConversations: Conversation[] = [
  { id: "c-01", name: "Marcus Otieno", role: "Tech Lead — Atlas", preview: "Pushed the new auth flow to staging — could you take a look?", timeLabel: "12m", unread: 2, online: true },
  { id: "c-02", name: "Aisha Kamau", role: "PM — MediTrack", preview: "QA round 2 looks clean. Targeting Friday release.", timeLabel: "1h", unread: 0, online: true },
  { id: "c-03", name: "Joy Wanjiru", role: "Designer", preview: "Updated the dashboard tokens in Figma.", timeLabel: "3h", unread: 1, online: false },
  { id: "c-04", name: "Brian Mwangi", role: "Backend — Harvest", preview: "Schema draft attached. Ready for review.", timeLabel: "Yesterday", unread: 0, online: false },
  { id: "c-05", name: "Kelvin Njoroge", role: "DevOps", preview: "CI pipeline migrated to the new runner.", timeLabel: "2d", unread: 0, online: true },
];

export const mockMessagesByConversation: Record<string, Message[]> = {
  "c-01": [
    { id: "m-1", conversationId: "c-01", author: "them", text: "Morning! Pushed the new auth flow to staging.", timeLabel: "09:12" },
    { id: "m-2", conversationId: "c-01", author: "them", text: "Includes magic-link + Google OAuth.", timeLabel: "09:12" },
    { id: "m-3", conversationId: "c-01", author: "me", text: "Awesome — testing now. Did you wire the audit log?", timeLabel: "09:24" },
    { id: "m-4", conversationId: "c-01", author: "them", text: "Yes, every sign-in event lands in `auth_events`.", timeLabel: "09:26" },
    { id: "m-5", conversationId: "c-01", author: "me", text: "Perfect. Let's demo this on Thursday's call.", timeLabel: "09:31" },
    { id: "m-6", conversationId: "c-01", author: "them", text: "Sounds good. I'll prep a short walkthrough deck.", timeLabel: "09:33" },
  ],
};

export const mockInvoices: Invoice[] = [
  { id: "INV-1048", projectName: "Atlas Banking Core — Sprint 6", amount: 8400, currency: "USD", status: "due", issuedLabel: "May 02, 2026", dueLabel: "May 22, 2026" },
  { id: "INV-1047", projectName: "MediTrack HMS — QA Retainer", amount: 3200, currency: "USD", status: "paid", issuedLabel: "Apr 28, 2026", dueLabel: "May 10, 2026" },
  { id: "INV-1046", projectName: "Harvest ERP — Discovery", amount: 1800, currency: "USD", status: "paid", issuedLabel: "Apr 18, 2026", dueLabel: "Apr 28, 2026" },
  { id: "INV-1045", projectName: "Skyline LMS v2 — Final", amount: 12500, currency: "USD", status: "paid", issuedLabel: "Apr 02, 2026", dueLabel: "Apr 16, 2026" },
  { id: "INV-1044", projectName: "RetailOps CRM — Sprint 3", amount: 540000, currency: "KES", status: "overdue", issuedLabel: "Mar 22, 2026", dueLabel: "Apr 05, 2026" },
  { id: "INV-1043", projectName: "Logix Fleet — Kickoff", amount: 2200, currency: "USD", status: "draft", issuedLabel: "—", dueLabel: "—" },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "pm-1", brand: "VISA", last4: "4242", expiryLabel: "08/27", primary: true },
  { id: "pm-2", brand: "M-PESA", last4: "••• 7821", expiryLabel: "Active" },
];

export const mockBillingAddress: BillingAddress = {
  name: "Juanet Client — Jane Ndegwa",
  lines: ["Ngong Road, Suite 14", "Nairobi 00100, Kenya"],
};

export const mockActivity: ActivityItem[] = [
  { id: "a-1", kind: "deploy", text: "atlas-core deployed to staging", timeLabel: "12m ago" },
  { id: "a-2", kind: "message", text: "Marcus replied on Skyline LMS", timeLabel: "1h ago" },
  { id: "a-3", kind: "invoice", text: "INV-1042 paid via M-Pesa", timeLabel: "3h ago" },
  { id: "a-4", kind: "license", text: "Pulse CRM key issued", timeLabel: "Yesterday" },
];

export const mockSummary: DashboardSummary = {
  activeProjects: 4,
  openRequests: 7,
  unreadMessages: 3,
  outstandingAmount: { amount: 8400, currency: "USD" },
};

export const mockBillingOverview = {
  outstandingLabel: "$8,400",
  outstandingHint: "1 invoice due",
  paidYtdLabel: "$48,720",
  paidYtdHint: "+18% YoY",
  avgInvoiceLabel: "$4,180",
  avgInvoiceHint: "Across 12 projects",
  nextBillingLabel: "May 22",
  nextBillingHint: "Atlas Banking — Sprint 6",
};
