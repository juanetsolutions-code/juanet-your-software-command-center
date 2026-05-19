/**
 * Raw Postgres row shapes as they will come back from Supabase.
 *
 * These mirror the column declarations in `./schema.ts` and exist
 * purely so the mapper functions in `./mappers.ts` have something
 * typed on the database side. UI code should NEVER import these —
 * it consumes the domain types in `src/lib/dashboard/types.ts`.
 */

import type {
  Currency,
  InvoiceStatus,
  ProjectStatus,
  RequestStatus,
  ActivityKind,
} from "@/lib/dashboard/types";

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: "client" | "admin" | "staff";
  avatar_url: string | null;
  created_at: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  client: string;
  category: string;
  status: ProjectStatus;
  progress: number;
  due_at: string;
  lead_profile_id: string | null;
  owner_profile_id: string | null;
  created_at: string;
  updated_at: string;
  /** Optional joined relation, e.g. `select('*, lead:profiles(*)')`. */
  lead?: ProfileRow | null;
}

export interface ServiceRequestRow {
  id: string;
  title: string;
  description: string | null;
  service_slug: string | null;
  budget_range: string | null;
  timeline: string | null;
  deadline_at: string | null;
  status: RequestStatus;
  requested_by_profile_id: string;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  name: string;
  role: string;
  project_id: string | null;
  last_message_at: string | null;
  created_at: string;
}

export interface ConversationMemberRow {
  conversation_id: string;
  profile_id: string;
  unread_count: number;
  last_read_at: string | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  author_profile_id: string;
  text: string;
  created_at: string;
}

export interface InvoiceRow {
  id: string;
  project_id: string | null;
  project_name: string;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  issued_at: string | null;
  due_at: string | null;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  invoice_id: string;
  payment_method_id: string | null;
  amount: number;
  currency: Currency;
  status: "succeeded" | "pending" | "failed";
  processor: "stripe" | "mpesa" | "manual";
  processor_ref: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface PaymentMethodRow {
  id: string;
  owner_profile_id: string;
  brand: string;
  last4: string;
  expiry_label: string;
  is_primary: boolean;
  created_at: string;
}

export interface BillingAddressRow {
  id: string;
  owner_profile_id: string;
  name: string;
  lines: string[];
  created_at: string;
}

export interface ActivityLogRow {
  id: string;
  kind: ActivityKind;
  text: string;
  actor_profile_id: string | null;
  subject_table: string | null;
  subject_id: string | null;
  created_at: string;
}
