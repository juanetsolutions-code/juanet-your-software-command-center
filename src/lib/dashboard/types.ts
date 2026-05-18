/**
 * Dashboard domain types.
 *
 * These interfaces describe the shape of every entity rendered by the
 * client dashboard. They are intentionally backend-agnostic so the same
 * shapes can be returned by either the local mock layer or a future
 * Supabase-backed `createServerFn`.
 *
 * Field naming follows snake_case-friendly camelCase: `created_at` from
 * Postgres maps to `createdAt` here via a thin mapper at the data-access
 * boundary (see `./api.ts`). UI code never deals with raw DB rows.
 */

// ---------- Shared ----------

export type ISODateString = string; // e.g. "2026-05-22T12:00:00.000Z"
export type Currency = "USD" | "KES";

export interface Money {
  amount: number;
  currency: Currency;
}

// ---------- Projects ----------

export type ProjectStatus = "pending" | "in progress" | "completed";

export interface Project {
  id: string;
  name: string;
  client: string;
  category: string;
  status: ProjectStatus;
  progress: number; // 0-100
  dueAt: ISODateString;
  /** Pre-formatted due date string for display (e.g. "Sep 12, 2025"). */
  dueLabel: string;
  leadName: string;
  /** Pre-formatted "12m ago" / "Yesterday" string. */
  updatedLabel: string;
}

export interface ProjectTimelineEvent {
  id: string;
  title: string;
  /** Pre-formatted date label (e.g. "Apr 04"). */
  dateLabel: string;
  done: boolean;
}

// ---------- Service Requests ----------

export type RequestStatus = "pending" | "in progress" | "completed";

export interface ServiceRequest {
  id: string;
  title: string;
  description?: string;
  serviceSlug?: string;
  budgetRange?: string;
  timeline?: string;
  deadlineAt?: ISODateString | null;
  status: RequestStatus;
  /** Pre-formatted submission label (e.g. "May 14"). */
  submittedLabel: string;
}

export interface ServiceRequestDraft {
  title: string;
  description: string;
  serviceSlug: string;
  budgetRange: string;
  timeline: string;
  deadlineAt: ISODateString | null;
}

// ---------- Messaging ----------

export interface Conversation {
  id: string;
  /** Counterparty display name. */
  name: string;
  /** Counterparty role / title. */
  role: string;
  preview: string;
  /** Pre-formatted recency ("12m", "1h", "Yesterday"). */
  timeLabel: string;
  unread: number;
  online: boolean;
}

export type MessageAuthor = "me" | "them";

export interface Message {
  id: string;
  conversationId: string;
  author: MessageAuthor;
  text: string;
  /** Pre-formatted clock time ("09:12"). */
  timeLabel: string;
}

// ---------- Payments & Invoices ----------

export type InvoiceStatus = "paid" | "due" | "overdue" | "draft";

export interface Invoice {
  id: string;
  projectName: string;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  /** Pre-formatted issued date ("May 02, 2026") or "—" for drafts. */
  issuedLabel: string;
  /** Pre-formatted due date or "—" for drafts. */
  dueLabel: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryLabel: string;
  primary?: boolean;
}

export interface BillingAddress {
  name: string;
  lines: string[];
}

// ---------- Activity feed ----------

export type ActivityKind = "deploy" | "message" | "invoice" | "license" | "request";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  text: string;
  /** Pre-formatted recency ("12m ago"). */
  timeLabel: string;
}

// ---------- Dashboard summary ----------

export interface DashboardSummary {
  activeProjects: number;
  openRequests: number;
  unreadMessages: number;
  outstandingAmount: Money;
}

// ---------- Generic data-access result shape ----------

/**
 * Every data-access function returns this envelope so UI code can stay
 * unchanged when the backend layer is swapped to async Supabase calls.
 * In the mock layer `loading` is always `false` and `error` is `null`.
 */
export interface QueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}
