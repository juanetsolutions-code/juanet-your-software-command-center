/**
 * Dashboard data-access layer — ADAPTER-READY.
 *
 * Every function is the boundary between UI and persistence. The body
 * currently reads from the local mock store (`./mock.ts`); the comment
 * above each function shows the exact Supabase call that will replace
 * it once Lovable Cloud is enabled.
 *
 * Promotion checklist (per function):
 *   1. Change signature to `async`.
 *   2. Replace mock read with the documented `supabase.from(...)` call.
 *   3. Pipe rows through the mapper in `@/lib/supabase/mappers`.
 *   4. For writes, move the body into a `createServerFn` handler and
 *      call it via `useServerFn` from the component.
 *
 * UI stays unchanged: components consume the same domain types
 * declared in `./types.ts`.
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
// Imported eagerly so tree-shakers keep the mapping layer reachable; the
// schema constants document the exact tables each function will hit.
import { TABLES } from "@/lib/supabase/schema";

void TABLES;

// ---------- Dashboard summary ----------

/**
 * SUPABASE:
 *   const [{ count: activeProjects }, { count: openRequests },
 *          { count: unreadMessages }, { data: outstanding }] = await Promise.all([
 *     supabase.from(TABLES.projects).select('*', { count: 'exact', head: true })
 *       .eq('status', 'in progress'),
 *     supabase.from(TABLES.serviceRequests).select('*', { count: 'exact', head: true })
 *       .neq('status', 'completed'),
 *     supabase.from(TABLES.conversationMembers).select('unread_count')
 *       .eq('profile_id', userId),
 *     supabase.from(TABLES.invoices).select('amount, currency')
 *       .in('status', ['due', 'overdue']),
 *   ]);
 */
export function getDashboardSummary(): DashboardSummary {
  return mockSummary;
}

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.activityLogs)
 *     .select('*')
 *     .order(COLUMNS.activityLogs.createdAt, { ascending: false })
 *     .limit(20);
 *   return data.map(toActivityItem);
 */
export function listRecentActivity(): ActivityItem[] {
  return mockActivity;
}

// ---------- Projects ----------

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.projects)
 *     .select('*, lead:profiles!lead_profile_id(*)')
 *     .order('updated_at', { ascending: false });
 *   return data.map(toProject);
 */
export function listProjects(): Project[] {
  return mockProjects;
}

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.projects)
 *     .select('*, lead:profiles!lead_profile_id(*)')
 *     .eq('id', id).maybeSingle();
 *   return data ? toProject(data) : undefined;
 */
export function getProject(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

/**
 * SUPABASE:
 *   Derived from a `project_timeline_events` table or computed from
 *   sprint milestones — see `buildProjectTimeline` for the canonical
 *   6-step shape.
 */
export function listProjectTimeline(project: Project): ProjectTimelineEvent[] {
  return buildProjectTimeline(project);
}

// ---------- Service Requests ----------

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.serviceRequests)
 *     .select('*')
 *     .order('created_at', { ascending: false });
 *   return data.map(toServiceRequest);
 */
export function listRequests(): ServiceRequest[] {
  return mockRequests;
}

/** Static enums — will remain in code (not in a table). */
export function listBudgetRanges(): string[] {
  return mockBudgetRanges;
}
export function listTimelineOptions(): string[] {
  return mockTimelines;
}

/**
 * SUPABASE — write, must become a `createServerFn` handler:
 *
 *   const { data } = await supabase
 *     .from(TABLES.serviceRequests)
 *     .insert(fromServiceRequestDraft(draft, userId))
 *     .select('id').single();
 *   return { id: data.id };
 */
export function createServiceRequest(_draft: ServiceRequestDraft): { id: string } {
  return { id: "RQ-205" };
}

// ---------- Messaging ----------

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.conversations)
 *     .select('*, members:conversation_members(unread_count), last:messages(text)')
 *     .order('last_message_at', { ascending: false });
 *   return data.map((row) => toConversation(row, { ... }));
 */
export function listConversations(): Conversation[] {
  return mockConversations;
}

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.messages)
 *     .select('*')
 *     .eq('conversation_id', conversationId)
 *     .order('created_at', { ascending: true });
 *   return data.map((m) => toMessage(m, currentProfileId));
 */
export function listMessages(conversationId: string): Message[] {
  return (
    mockMessagesByConversation[conversationId] ??
    mockMessagesByConversation["c-01"] ??
    []
  );
}

/**
 * SUPABASE — write, will live in a `createServerFn`:
 *
 *   await supabase.from(TABLES.messages)
 *     .insert(fromMessageDraft(conversationId, text, userId));
 */
export function sendMessage(_conversationId: string, _text: string): void {
  /* no-op until backend lands */
}

// ---------- Payments ----------

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.invoices)
 *     .select('*')
 *     .order('issued_at', { ascending: false });
 *   return data.map(toInvoice);
 */
export function listInvoices(): Invoice[] {
  return mockInvoices;
}

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.paymentMethods)
 *     .select('*')
 *     .eq('owner_profile_id', userId)
 *     .order('is_primary', { ascending: false });
 *   return data.map(toPaymentMethod);
 */
export function listPaymentMethods(): PaymentMethod[] {
  return mockPaymentMethods;
}

/**
 * SUPABASE:
 *   const { data } = await supabase
 *     .from(TABLES.billingAddresses)
 *     .select('*')
 *     .eq('owner_profile_id', userId).maybeSingle();
 */
export function getBillingAddress(): BillingAddress {
  return mockBillingAddress;
}

/**
 * SUPABASE — aggregate view, likely backed by a Postgres VIEW or RPC:
 *   await supabase.rpc('get_billing_overview', { p_profile_id: userId });
 */
export function getBillingOverview() {
  return mockBillingOverview;
}

/**
 * SUPABASE — write, server-fn:
 *   await supabase.from(TABLES.payments).insert({
 *     invoice_id: invoiceId, amount, currency, status: 'succeeded', processor,
 *   });
 *   await supabase.from(TABLES.invoices)
 *     .update({ status: 'paid' }).eq('id', invoiceId);
 */
export function markInvoicePaid(_invoiceId: string): void {
  /* no-op until backend lands */
}
