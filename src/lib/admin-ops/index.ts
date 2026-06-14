/**
 * Admin Operations service layer.
 * Thin wrappers over Supabase, org-scoped via bootstrap.
 */
import { supabase } from "@/lib/supabase/client";
import { ensureOrganization } from "@/lib/tenant/bootstrap";

// ---------- Products ----------
export interface Product {
  id: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  priceCents: number;
  currency: string;
  isActive: boolean;
}

export async function listProducts(): Promise<Product[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    sku: r.sku,
    description: r.description,
    priceCents: r.price_cents ?? 0,
    currency: r.currency ?? "USD",
    isActive: r.is_active ?? true,
  }));
}

export async function createProduct(input: {
  name: string;
  sku?: string;
  priceCents: number;
  currency?: string;
  description?: string;
}): Promise<Product | null> {
  const orgId = await ensureOrganization();
  if (!orgId) return null;
  const { data, error } = await supabase
    .from("products")
    .insert({
      organization_id: orgId,
      name: input.name,
      sku: input.sku ?? null,
      price_cents: input.priceCents,
      currency: input.currency ?? "USD",
      description: input.description ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    sku: data.sku,
    description: data.description,
    priceCents: data.price_cents,
    currency: data.currency,
    isActive: data.is_active,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  await supabase.from("products").delete().eq("id", id);
}

// ---------- Orders ----------
export interface Order {
  id: string;
  orderNumber: string | null;
  customerName: string;
  customerEmail?: string | null;
  totalCents: number;
  currency: string;
  status: string;
  createdAt: string;
}

export async function listOrders(): Promise<Order[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    orderNumber: r.order_number,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    totalCents: r.total_cents ?? 0,
    currency: r.currency ?? "USD",
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function createOrder(input: {
  customerName: string;
  customerEmail?: string;
  totalCents: number;
  status?: string;
}): Promise<Order | null> {
  const orgId = await ensureOrganization();
  if (!orgId) return null;
  const { data, error } = await supabase
    .from("orders")
    .insert({
      organization_id: orgId,
      customer_name: input.customerName,
      customer_email: input.customerEmail ?? null,
      total_cents: input.totalCents,
      status: input.status ?? "pending",
      order_number: `ORD-${Date.now().toString().slice(-6)}`,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    orderNumber: data.order_number,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    totalCents: data.total_cents,
    currency: data.currency,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function updateOrderStatus(id: string, status: string) {
  await supabase.from("orders").update({ status }).eq("id", id);
}

// ---------- Licenses ----------
export interface License {
  id: string;
  licenseKey: string;
  productName: string;
  customerName: string;
  customerEmail?: string | null;
  seats: number;
  seatsUsed: number;
  status: string;
  expiresAt?: string | null;
  issuedAt: string;
}

function genLicenseKey() {
  const segment = () =>
    Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

export async function listLicenses(): Promise<License[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data } = await supabase
    .from("licenses")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    licenseKey: r.license_key,
    productName: r.product_name,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    seats: r.seats,
    seatsUsed: r.seats_used,
    status: r.status,
    expiresAt: r.expires_at,
    issuedAt: r.issued_at,
  }));
}

export async function issueLicense(input: {
  productName: string;
  customerName: string;
  customerEmail?: string;
  seats: number;
  expiresAt?: string | null;
}): Promise<License | null> {
  const orgId = await ensureOrganization();
  if (!orgId) return null;
  const { data, error } = await supabase
    .from("licenses")
    .insert({
      organization_id: orgId,
      license_key: genLicenseKey(),
      product_name: input.productName,
      customer_name: input.customerName,
      customer_email: input.customerEmail ?? null,
      seats: input.seats,
      expires_at: input.expiresAt ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    licenseKey: data.license_key,
    productName: data.product_name,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    seats: data.seats,
    seatsUsed: data.seats_used,
    status: data.status,
    expiresAt: data.expires_at,
    issuedAt: data.issued_at,
  };
}

export async function revokeLicense(id: string) {
  await supabase.from("licenses").update({ status: "revoked" }).eq("id", id);
}

// ---------- Support tickets ----------
export interface SupportTicket {
  id: string;
  subject: string;
  description?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  priority: string;
  status: string;
  createdAt: string;
}

export async function listTickets(): Promise<SupportTicket[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    subject: r.subject,
    description: r.description,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    priority: r.priority,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function createTicket(input: {
  subject: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  priority?: string;
}): Promise<SupportTicket | null> {
  const orgId = await ensureOrganization();
  if (!orgId) return null;
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      organization_id: orgId,
      subject: input.subject,
      description: input.description ?? null,
      customer_name: input.customerName ?? null,
      customer_email: input.customerEmail ?? null,
      priority: input.priority ?? "normal",
      created_by: userData.user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    subject: data.subject,
    description: data.description,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    priority: data.priority,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function updateTicketStatus(id: string, status: string) {
  await supabase.from("support_tickets").update({ status }).eq("id", id);
}

// ---------- Org members (admin users page) ----------
export interface OrgMember {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  email?: string | null;
  fullName?: string | null;
}

export async function listOrgMembers(): Promise<OrgMember[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data: members } = await supabase
    .from("organization_members")
    .select("id, user_id, role, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });
  if (!members?.length) return [];
  const ids = members.map((m: any) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, email")
    .in("user_id", ids);
  const map = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
  return members.map((m: any) => {
    const p = map.get(m.user_id) as any;
    return {
      id: m.id,
      userId: m.user_id,
      role: m.role,
      joinedAt: m.created_at,
      email: p?.email ?? null,
      fullName: p?.full_name ?? null,
    };
  });
}

// ---------- Audit events ----------
export interface AuditEvent {
  id: string;
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  actorId?: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export async function listAuditEvents(limit = 100): Promise<AuditEvent[]> {
  const orgId = await ensureOrganization();
  if (!orgId) return [];
  const { data } = await supabase
    .from("audit_events")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((r: any) => ({
    id: r.id,
    action: r.action,
    resourceType: r.resource_type,
    resourceId: r.resource_id,
    actorId: r.actor_id,
    createdAt: r.created_at,
    metadata: r.metadata ?? {},
  }));
}

// ---------- Helpers ----------
export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    (cents ?? 0) / 100,
  );
}
