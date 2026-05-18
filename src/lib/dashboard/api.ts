/**
 * Dashboard data-access layer.
 *
 * Every function here is the boundary between UI and persistence. The
 * current implementation reads from the local mock layer in `./mock.ts`,
 * but the signatures are designed so each function maps 1:1 to a Supabase
 * call (or `createServerFn`) without touching component code.
 *
 * When wiring Supabase later:
 *   - Promote each function to `async` and replace the body with a
 *     `supabase.from(...).select(...)` query.
 *   - Move write helpers (`createServiceRequest`, `sendMessage`,
 *     `markInvoicePaid`, ...) into `createServerFn` handlers and call
 *     them via `useServerFn`.
 *   - UI stays unchanged: components already accept typed props.
 */

import {
  buildProjectTimeline,
  mockActivity,
  mockBillingAddress,
  mockBillingOverview,
  mockBudgetRanges,
  mockConversations,
  mockInvoices,
  mockMessagesByConversation,
  mockPaymentMethods,
  mockProjects,
  mockRequests,
  mockSummary,
  mockTimelines,
} from "./mock";
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
  ServiceRequestDraft,
} from "./types";

// ---------- Dashboard summary ----------

export function getDashboardSummary(): DashboardSummary {
  return mockSummary;
}

export function listRecentActivity(): ActivityItem[] {
  return mockActivity;
}

// ---------- Projects ----------

export function listProjects(): Project[] {
  return mockProjects;
}

export function getProject(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function listProjectTimeline(project: Project): ProjectTimelineEvent[] {
  return buildProjectTimeline(project);
}

// ---------- Service Requests ----------

export function listRequests(): ServiceRequest[] {
  return mockRequests;
}

export function listBudgetRanges(): string[] {
  return mockBudgetRanges;
}

export function listTimelineOptions(): string[] {
  return mockTimelines;
}

/**
 * Stubbed write. Returns a synthesized request id so the UI can show a
 * confirmation state without touching persistence.
 *
 * Replace with a `createServerFn` POST when Supabase is wired.
 */
export function createServiceRequest(_draft: ServiceRequestDraft): { id: string } {
  return { id: "RQ-205" };
}

// ---------- Messaging ----------

export function listConversations(): Conversation[] {
  return mockConversations;
}

export function listMessages(conversationId: string): Message[] {
  return (
    mockMessagesByConversation[conversationId] ??
    mockMessagesByConversation["c-01"] ??
    []
  );
}

/** Stubbed write — see `createServiceRequest`. */
export function sendMessage(_conversationId: string, _text: string): void {
  /* no-op until backend lands */
}

// ---------- Payments ----------

export function listInvoices(): Invoice[] {
  return mockInvoices;
}

export function listPaymentMethods(): PaymentMethod[] {
  return mockPaymentMethods;
}

export function getBillingAddress(): BillingAddress {
  return mockBillingAddress;
}

export function getBillingOverview() {
  return mockBillingOverview;
}

/** Stubbed write — UI uses optimistic local state today. */
export function markInvoicePaid(_invoiceId: string): void {
  /* no-op until backend lands */
}
