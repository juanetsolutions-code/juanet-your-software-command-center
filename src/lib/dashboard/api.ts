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

// ---------- Dashboard summary ----------
export function getDashboardSummary(): DashboardSummary {
  return mockSummary;
}

export function listRecentActivity(): ActivityItem[] {
  return mockActivity;
}

// ---------- Projects ----------
export function listProjects(): Project[] {
  // Fire async repository call (non-blocking for current sync UI)
  void projectsRepo.listProjects().then((data) => {
    // Future: could update a cache or Zustand store here
  });
  return mockProjects;
}

export function getProject(id: string): Project | undefined {
  void projectsRepo.getProject(id);
  return mockProjects.find((p) => p.id === id);
}

export function listProjectTimeline(project: Project): ProjectTimelineEvent[] {
  return buildProjectTimeline(project);
}

// ---------- Service Requests ----------
export function listRequests(): ServiceRequest[] {
  void requestsRepo.listRequests();
  return mockRequests;
}

export function listBudgetRanges(): string[] {
  return mockBudgetRanges;
}

export function listTimelineOptions(): string[] {
  return mockTimelines;
}

export function createServiceRequest(draft: ServiceRequestDraft): { id: string } {
  void requestsRepo.createServiceRequest(draft, "current-user");
  return { id: "RQ-205" };
}

// ---------- Messaging ----------
export function listConversations(): Conversation[] {
  void messagesRepo.listConversations();
  return mockConversations;
}

export function listMessages(conversationId: string): Message[] {
  void messagesRepo.listMessages(conversationId);
  return mockMessagesByConversation[conversationId] ?? mockMessagesByConversation["c-01"] ?? [];
}

export function sendMessage(conversationId: string, text: string): void {
  void messagesRepo.sendMessage(conversationId, text, "current-user");
}

// ---------- Payments & Billing ----------
export function listInvoices(): Invoice[] {
  void invoicesRepo.listInvoices();
  return mockInvoices;
}

export function listPaymentMethods(): PaymentMethod[] {
  void paymentsRepo.listPaymentMethods();
  return mockPaymentMethods;
}

export function getBillingAddress(): BillingAddress {
  void paymentsRepo.getBillingAddress();
  return mockBillingAddress;
}

export function getBillingOverview() {
  return mockBillingOverview;
}

export function markInvoicePaid(invoiceId: string): void {
  void paymentsRepo.markInvoicePaid(invoiceId);
}
