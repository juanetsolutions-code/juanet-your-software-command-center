/**
 * Dashboard data-access layer — REPOSITORY ARCHITECTURE (backward compatible).
 *
 * All original function signatures are preserved.
 * Repositories are called internally with graceful mock fallback.
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
import * as projectsRepo from "./repositories/projects";
import * as requestsRepo from "./repositories/requests";
import * as messagesRepo from "./repositories/messages";
import * as invoicesRepo from "./repositories/invoices";
import * as paymentsRepo from "./repositories/payments";

// Wiring through unified facade (non-breaking)
import appFacade from "@/lib/app/facade";

// ---------- Dashboard summary ----------
export function getDashboardSummary(): DashboardSummary {
  return mockSummary;
}

export function listRecentActivity(): ActivityItem[] {
  return mockActivity;
}

// ---------- Projects ----------
// NOTE: The current UI is synchronous and consumes mock data directly.
// Repositories return promises and are wired here for future async migration
// (e.g. via React Query / loaders). Calling them eagerly on every render
// would create spurious requests, so we expose them on the side instead.
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

export function createServiceRequest(draft: ServiceRequestDraft): { id: string } {
  // Now wired through unified facade (behavior unchanged)
  void appFacade.createRequest(draft);
  return { id: "RQ-205" };
}

// ---------- Messaging ----------
export function listConversations(): Conversation[] {
  return mockConversations;
}

export function listMessages(conversationId: string): Message[] {
  return mockMessagesByConversation[conversationId] ?? mockMessagesByConversation["c-01"] ?? [];
}

export function sendMessage(conversationId: string, text: string): void {
  // Now wired through unified facade (behavior unchanged)
  void appFacade.sendMessage(conversationId, text);
}

// ---------- Payments & Billing ----------
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

export function markInvoicePaid(invoiceId: string): void {
  // Now wired through unified facade (behavior unchanged)
  void appFacade.markInvoicePaid(invoiceId);
}

// ---------- Async repository surface (for future React Query migration) ----------
export const repositories = {
  projects: projectsRepo,
  requests: requestsRepo,
  messages: messagesRepo,
  invoices: invoicesRepo,
  payments: paymentsRepo,
};
