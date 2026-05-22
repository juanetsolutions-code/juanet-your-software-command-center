/**
 * Unified Application Facade
 *
 * Single entry point for the entire application.
 * All high-level operations should go through here.
 *
 * This layer orchestrates:
 * - Auth
 * - Dashboard data (projects, requests, messages, invoices, payments)
 * - Future services layer
 *
 * IMPORTANT: All public methods must remain stable for UI compatibility.
 */

import * as authApi from "@/lib/auth/api";
import * as dashboardApi from "@/lib/dashboard/api";
import * as projectsRepo from "@/lib/dashboard/repositories/projects";
import * as requestsRepo from "@/lib/dashboard/repositories/requests";
import * as messagesRepo from "@/lib/dashboard/repositories/messages";
import * as invoicesRepo from "@/lib/dashboard/repositories/invoices";
import * as paymentsRepo from "@/lib/dashboard/repositories/payments";

// Re-export stable auth surface
export const auth = {
  signIn: authApi.signIn,
  signUp: authApi.signUp,
  signOut: authApi.signOut,
  requestPasswordReset: authApi.requestPasswordReset,
};

// Dashboard data (currently still mostly mock at public layer, real via repos)
export const dashboard = {
  getDashboardSummary: dashboardApi.getDashboardSummary,
  listRecentActivity: dashboardApi.listRecentActivity,
  listProjects: dashboardApi.listProjects,
  getProject: dashboardApi.getProject,
  listRequests: dashboardApi.listRequests,
  listConversations: dashboardApi.listConversations,
  listMessages: dashboardApi.listMessages,
  listInvoices: dashboardApi.listInvoices,
  listPaymentMethods: dashboardApi.listPaymentMethods,
  getBillingAddress: dashboardApi.getBillingAddress,
  markInvoicePaid: dashboardApi.markInvoicePaid,
};

// Direct repository access for advanced use (still safe)
export const repositories = {
  projects: projectsRepo,
  requests: requestsRepo,
  messages: messagesRepo,
  invoices: invoicesRepo,
  payments: paymentsRepo,
};

// High-level convenience methods (the ones mentioned in the task)
export async function signIn(payload: Parameters<typeof authApi.signIn>[0]) {
  return authApi.signIn(payload);
}

export async function signOut() {
  return authApi.signOut();
}

export function getDashboardData() {
  return {
    summary: dashboardApi.getDashboardSummary(),
    activity: dashboardApi.listRecentActivity(),
    projects: dashboardApi.listProjects(),
    requests: dashboardApi.listRequests(),
  };
}

export function createRequest(draft: Parameters<typeof dashboardApi.createServiceRequest>[0]) {
  return dashboardApi.createServiceRequest(draft);
}

export function sendMessage(conversationId: string, text: string) {
  return dashboardApi.sendMessage(conversationId, text);
}

export function getInvoices() {
  return dashboardApi.listInvoices();
}

export function markInvoicePaid(invoiceId: string): void {
  // Delegates to payments repository via facade
  void paymentsRepo.markInvoicePaid(invoiceId);
}

// Silent wiring of notifications + analytics (no UI impact)
import "@/lib/services/notification-service";
import "@/lib/services/analytics";

// Future: This is where we would inject services, events, jobs, etc.
export const app = {
  auth,
  dashboard,
  repositories,
  signIn,
  signOut,
  getDashboardData,
  createRequest,
  sendMessage,
  getInvoices,
  markInvoicePaid,
};

export default app;
