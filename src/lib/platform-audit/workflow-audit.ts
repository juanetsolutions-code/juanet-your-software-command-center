/**
 * Workflow Audit - User Journey Analysis
 */

export interface WorkflowStep {
  id: string;
  label: string;
  required: boolean;
}

export interface WorkflowAudit {
  module: string;
  workflow: string;
  steps: WorkflowStep[];
  complete: boolean;
  missingSteps: string[];
}

export const WORKFLOW_AUDITS: WorkflowAudit[] = [
  {
    module: "projects",
    workflow: "Project Lifecycle",
    steps: [
      { id: "view-list", label: "View project list", required: true },
      { id: "filter-search", label: "Filter and search projects", required: true },
      { id: "view-detail", label: "View project details", required: true },
      { id: "track-progress", label: "Track project progress", required: true },
      { id: "message-team", label: "Message project team", required: false },
    ],
    complete: true,
    missingSteps: [],
  },
  {
    module: "requests",
    workflow: "Service Request",
    steps: [
      { id: "create-request", label: "Create service request", required: true },
      { id: "view-requests", label: "View request history", required: true },
      { id: "request-detail", label: "View request details", required: true },
      { id: "track-status", label: "Track request status", required: true },
      { id: "upload-attachments", label: "Upload attachments", required: false },
    ],
    complete: false,
    missingSteps: ["request-detail", "track-status"],
  },
  {
    module: "messages",
    workflow: "Messaging",
    steps: [
      { id: "view-conversations", label: "View conversation list", required: true },
      { id: "select-conversation", label: "Select conversation", required: true },
      { id: "send-message", label: "Send message", required: true },
      { id: "receive-realtime", label: "Receive realtime messages", required: false },
      { id: "empty-state", label: "Handle no conversations", required: true },
    ],
    complete: false,
    missingSteps: ["empty-state"],
  },
  {
    module: "payments",
    workflow: "Billing & Payments",
    steps: [
      { id: "view-invoices", label: "View invoice list", required: true },
      { id: "pay-invoice", label: "Pay invoice", required: true },
      { id: "view-history", label: "View payment history", required: false },
      { id: "add-payment-method", label: "Add payment method", required: true },
      { id: "view-billing-address", label: "View billing address", required: true },
      { id: "empty-invoices", label: "Handle no invoices", required: true },
    ],
    complete: false,
    missingSteps: ["empty-invoices"],
  },
  {
    module: "admin",
    workflow: "Admin Operations",
    steps: [
      { id: "platform-overview", label: "Platform overview", required: true },
      { id: "tenant-management", label: "Tenant management", required: true },
      { id: "subscription-overview", label: "Subscription overview", required: true },
      { id: "audit-logs", label: "Audit activity", required: true },
      { id: "platform-health", label: "Platform health", required: true },
      { id: "integrations-status", label: "Integrations status", required: true },
      { id: "ai-operations", label: "AI operations", required: true },
    ],
    complete: false,
    missingSteps: [
      "tenant-management",
      "subscription-overview",
      "audit-logs",
      "platform-health",
      "integrations-status",
      "ai-operations",
    ],
  },
];

export const NAVIGATION_ISSUES = [
  { from: "/dashboard/downloads", to: "Missing page - on nav but no route", severity: "high" },
  { from: "/dashboard/licenses", to: "Missing page - on nav but no route", severity: "high" },
  { from: "/admin/users", to: "Missing page - on nav but no route", severity: "high" },
  { from: "/admin/services", to: "Missing page - on nav but no route", severity: "medium" },
  { from: "/admin/orders", to: "Missing page - on nav but no route", severity: "medium" },
  { from: "/admin/shop", to: "Missing page - on nav but no route", severity: "medium" },
  { from: "/admin/licenses", to: "Missing page - on nav but no route", severity: "medium" },
  { from: "/admin/payments", to: "Missing page - on nav but no route", severity: "medium" },
  { from: "/admin/cms", to: "Missing page - on nav but no route", severity: "low" },
  { from: "/admin/settings", to: "Missing page - on nav but no route", severity: "medium" },
];
