/**
 * Production-ready schema foundation (v2) for multi-tenant SaaS.
 *
 * Adds:
 *   - organizations / organization_members
 *   - organization_id, created_by, timestamps on all tenant tables
 *   - canonical status enums shared with domain types
 *
 * This file does NOT execute migrations. It is the authoritative
 * declaration used by future SQL generators and by the mapping layer.
 */

import type { Currency, InvoiceStatus, ProjectStatus, RequestStatus } from "@/lib/dashboard/types";

export const TABLES_V2 = {
  organizations: "organizations",
  organizationMembers: "organization_members",
  profiles: "profiles",
  projects: "projects",
  serviceRequests: "service_requests",
  conversations: "conversations",
  conversationMembers: "conversation_members",
  messages: "messages",
  invoices: "invoices",
  payments: "payments",
  paymentMethods: "payment_methods",
  billingAddresses: "billing_addresses",
  activityLogs: "activity_logs",
} as const;

export type TableV2 = (typeof TABLES_V2)[keyof typeof TABLES_V2];

export const STATUS_ENUMS = {
  project: ["pending", "in progress", "completed"] as const satisfies readonly ProjectStatus[],
  request: ["pending", "in progress", "completed"] as const satisfies readonly RequestStatus[],
  invoice: ["paid", "due", "overdue", "draft"] as const satisfies readonly InvoiceStatus[],
  payment: ["succeeded", "pending", "failed"] as const,
  currency: ["USD", "KES"] as const satisfies readonly Currency[],
  orgRole: ["owner", "admin", "member"] as const,
  orgPlan: ["free", "pro", "enterprise"] as const,
} as const;

/** Columns every tenant-scoped table MUST include. */
export interface TenantBaseColumns {
  id: string;
  organization_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Convenience helper for documentation / typed inserts. */
export type WithTenant<T> = T & {
  organization_id: string;
  created_by?: string | null;
};
