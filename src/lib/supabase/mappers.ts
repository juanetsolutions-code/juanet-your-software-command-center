/**
 * Adapter functions between Postgres rows and UI domain types.
 *
 * These are pure functions. When the API layer is promoted from the
 * mock store to real Supabase calls, the only change inside each
 * `listX` / `getX` function will be:
 *
 *   const { data } = await supabase.from(TABLES.projects).select(...);
 *   return data.map(toProject);
 *
 * The mappers below own all formatting concerns (date labels,
 * currency-agnostic preservation, etc.) so UI components stay
 * presentational.
 */

import type {
  ActivityItem,
  Conversation,
  Invoice,
  Message,
  PaymentMethod,
  Project,
  ServiceRequest,
} from "@/lib/dashboard/types";
import type {
  ActivityLogRow,
  ConversationRow,
  InvoiceRow,
  MessageRow,
  PaymentMethodRow,
  ProjectRow,
  ServiceRequestRow,
} from "./rows";

// ---------- Date / time helpers ----------

const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const CLOCK = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return SHORT_DATE.format(new Date(iso));
}

function formatClock(iso: string): string {
  return CLOCK.format(new Date(iso));
}

function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return formatDate(iso);
}

// ---------- Row → Domain ----------

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    client: row.client,
    category: row.category,
    status: row.status,
    progress: row.progress,
    dueAt: row.due_at,
    dueLabel: formatDate(row.due_at),
    leadName: row.lead?.full_name ?? "Unassigned",
    updatedLabel: formatRelative(row.updated_at),
  };
}

export function toServiceRequest(row: ServiceRequestRow): ServiceRequest {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    serviceSlug: row.service_slug ?? undefined,
    budgetRange: row.budget_range ?? undefined,
    timeline: row.timeline ?? undefined,
    deadlineAt: row.deadline_at,
    status: row.status,
    submittedLabel: formatDate(row.created_at),
  };
}

export function toConversation(
  row: ConversationRow,
  meta: { preview: string; unread: number; online: boolean },
): Conversation {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    preview: meta.preview,
    timeLabel: formatRelative(row.last_message_at),
    unread: meta.unread,
    online: meta.online,
  };
}

export function toMessage(row: MessageRow, currentProfileId: string): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    author: row.author_profile_id === currentProfileId ? "me" : "them",
    text: row.text,
    timeLabel: formatClock(row.created_at),
  };
}

export function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    projectName: row.project_name,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    issuedLabel: formatDate(row.issued_at),
    dueLabel: formatDate(row.due_at),
  };
}

export function toPaymentMethod(row: PaymentMethodRow): PaymentMethod {
  return {
    id: row.id,
    brand: row.brand,
    last4: row.last4,
    expiryLabel: row.expiry_label,
    primary: row.is_primary,
  };
}

export function toActivityItem(row: ActivityLogRow): ActivityItem {
  return {
    id: row.id,
    kind: row.kind,
    text: row.text,
    timeLabel: formatRelative(row.created_at),
  };
}

// ---------- Domain → Row (insert payloads) ----------

import type { ServiceRequestDraft } from "@/lib/dashboard/types";

export function fromServiceRequestDraft(
  draft: ServiceRequestDraft,
  requestedByProfileId: string,
): Omit<ServiceRequestRow, "id" | "created_at" | "status"> & {
  status: ServiceRequestRow["status"];
} {
  return {
    title: draft.title,
    description: draft.description || null,
    service_slug: draft.serviceSlug || null,
    budget_range: draft.budgetRange || null,
    timeline: draft.timeline || null,
    deadline_at: draft.deadlineAt,
    requested_by_profile_id: requestedByProfileId,
    status: "pending",
  };
}

export function fromMessageDraft(
  conversationId: string,
  text: string,
  authorProfileId: string,
): Omit<MessageRow, "id" | "created_at"> {
  return {
    conversation_id: conversationId,
    author_profile_id: authorProfileId,
    text,
  };
}
