/**
 * Client Dashboard service layer — Supabase-backed.
 * Owner-scoped via auth.uid() RLS on requests/projects/invoices/notifications.
 * Org-scoped for downloads / licenses.
 */
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";
import { ensureOrganization } from "@/lib/tenant/bootstrap";

// ---------- types (UI-friendly) ----------
export interface ClientProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  category: string | null;
  dueAt: string | null;
  leadName: string | null;
  updatedAt: string;
}
export interface ClientRequest {
  id: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  budgetRange: string | null;
  timeline: string | null;
  deadlineAt: string | null;
  serviceSlug: string | null;
  createdAt: string;
}
export interface ClientInvoice {
  id: string;
  number: string;
  projectName: string | null;
  amount: number;
  currency: string;
  status: string;
  dueAt: string | null;
  createdAt: string;
}
export interface ClientNotification {
  id: string;
  title: string;
  body: string | null;
  category: string | null;
  priority: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}
export interface ClientDownload {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  version: string | null;
  sizeBytes: number;
  url: string;
  createdAt: string;
}
export interface ClientApiToken {
  id: string;
  name: string;
  tokenPrefix: string;
  lastFour: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}
export interface ClientLicense {
  id: string;
  productName: string;
  licenseKey: string;
  seats: number;
  seatsUsed: number;
  status: string;
  expiresAt: string | null;
}

async function currentUserId(): Promise<string | null> {
  if (!SUPABASE_READY) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ============ PROJECTS ============
export async function listMyProjects(): Promise<ClientProject[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", uid)
    .order("updated_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    progress: r.progress ?? 0,
    category: r.category,
    dueAt: r.due_at,
    leadName: r.lead_name,
    updatedAt: r.updated_at,
  }));
}

// ============ REQUESTS ============
export async function listMyRequests(): Promise<ClientRequest[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("requests")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    subject: r.subject,
    description: r.description,
    status: r.status,
    priority: r.priority,
    budgetRange: r.budget_range,
    timeline: r.timeline,
    deadlineAt: r.deadline_at,
    serviceSlug: r.service_slug,
    createdAt: r.created_at,
  }));
}
export async function updateRequest(
  id: string,
  patch: Partial<{
    subject: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
    budgetRange: string;
    timeline: string;
    deadlineAt: string | null;
    status: string;
  }>,
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.subject !== undefined) row.subject = patch.subject;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.priority !== undefined) row.priority = patch.priority;
  if (patch.budgetRange !== undefined) row.budget_range = patch.budgetRange;
  if (patch.timeline !== undefined) row.timeline = patch.timeline;
  if (patch.deadlineAt !== undefined) row.deadline_at = patch.deadlineAt;
  if (patch.status !== undefined) row.status = patch.status;
  const { error } = await supabase.from("requests").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteRequest(id: string): Promise<void> {
  const { error } = await supabase.from("requests").delete().eq("id", id);
  if (error) throw error;
}

export async function createRequest(input: {
  subject: string;
  description?: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  budgetRange?: string;
  timeline?: string;
  deadlineAt?: string | null;
  serviceSlug?: string;
}): Promise<ClientRequest | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("requests")
    .insert({
      user_id: uid,
      subject: input.subject,
      description: input.description ?? null,
      category: input.category ?? null,
      priority: input.priority ?? "medium",
      budget_range: input.budgetRange ?? null,
      timeline: input.timeline ?? null,
      deadline_at: input.deadlineAt ?? null,
      service_slug: input.serviceSlug ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    subject: data.subject,
    description: data.description,
    status: data.status,
    priority: data.priority,
    budgetRange: data.budget_range,
    timeline: data.timeline,
    deadlineAt: data.deadline_at,
    serviceSlug: data.service_slug,
    createdAt: data.created_at,
  };
}

// ============ INVOICES ============
export async function listMyInvoices(): Promise<ClientInvoice[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    number: r.invoice_number,
    projectName: r.project_name,
    amount: Number(r.amount ?? 0),
    currency: r.currency ?? "USD",
    status: r.status,
    dueAt: r.due_date,
    createdAt: r.created_at,
  }));
}
export async function markInvoicePaid(id: string): Promise<void> {
  await supabase.from("invoices").update({ status: "paid" }).eq("id", id);
}

// ============ NOTIFICATIONS ============
export async function listMyNotifications(): Promise<ClientNotification[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    category: r.category,
    priority: r.priority,
    read: r.read,
    link: r.link,
    createdAt: r.created_at,
  }));
}
export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}
export async function markAllNotificationsRead(): Promise<void> {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", uid)
    .eq("read", false);
}
export async function deleteNotification(id: string): Promise<void> {
  await supabase.from("notifications").delete().eq("id", id);
}

// ============ DOWNLOADS ============
export async function listDownloads(): Promise<ClientDownload[]> {
  if (!SUPABASE_READY) return [];
  const { data } = await supabase
    .from("downloads")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    kind: r.kind,
    version: r.version,
    sizeBytes: Number(r.size_bytes ?? 0),
    url: r.url,
    createdAt: r.created_at,
  }));
}

// ============ API TOKENS ============
function randomToken(): { full: string; lastFour: string; hash: string } {
  const buf = new Uint8Array(24);
  crypto.getRandomValues(buf);
  const body = Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
  return { full: `jnt_live_${body}`, lastFour: body.slice(-4), hash: body };
}
export async function listApiTokens(): Promise<ClientApiToken[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("api_tokens")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    tokenPrefix: r.token_prefix,
    lastFour: r.last_four,
    lastUsedAt: r.last_used_at,
    revokedAt: r.revoked_at,
    createdAt: r.created_at,
  }));
}
export async function createApiToken(name: string): Promise<{ token: string; record: ClientApiToken } | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const t = randomToken();
  const { data, error } = await supabase
    .from("api_tokens")
    .insert({
      user_id: uid,
      name,
      token_prefix: "jnt_live_",
      token_hash: t.hash,
      last_four: t.lastFour,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    token: t.full,
    record: {
      id: data.id,
      name: data.name,
      tokenPrefix: data.token_prefix,
      lastFour: data.last_four,
      lastUsedAt: null,
      revokedAt: null,
      createdAt: data.created_at,
    },
  };
}
export async function revokeApiToken(id: string): Promise<void> {
  await supabase.from("api_tokens").update({ revoked_at: new Date().toISOString() }).eq("id", id);
}

// ============ LICENSES (org-scoped) ============
export async function listMyLicenses(): Promise<ClientLicense[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data } = await supabase
    .from("licenses")
    .select("*")
    .eq("organization_id", orgId)
    .order("issued_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    productName: r.product_name,
    licenseKey: r.license_key,
    seats: r.seats ?? 0,
    seatsUsed: r.seats_used ?? 0,
    status: r.status,
    expiresAt: r.expires_at,
  }));
}

// ============ BILLING ADDRESS ============
export interface BillingAddressRow {
  fullName: string;
  line1: string;
  line2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}
export async function getBillingAddress(): Promise<BillingAddressRow | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("billing_addresses")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();
  if (!data) return null;
  return {
    fullName: data.full_name,
    line1: data.line1,
    line2: data.line2,
    city: data.city,
    region: data.region,
    postalCode: data.postal_code,
    country: data.country,
  };
}
export async function upsertBillingAddress(input: BillingAddressRow): Promise<void> {
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("billing_addresses").upsert({
    user_id: uid,
    full_name: input.fullName,
    line1: input.line1,
    line2: input.line2 ?? null,
    city: input.city ?? null,
    region: input.region ?? null,
    postal_code: input.postalCode ?? null,
    country: input.country ?? null,
    updated_at: new Date().toISOString(),
  });
}
