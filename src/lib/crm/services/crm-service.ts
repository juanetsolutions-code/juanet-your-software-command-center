/**
 * Supabase-backed Contact service exposed under crmService.contacts
 * (keeps existing import shape used by routes).
 */
import { supabase } from "@/lib/supabase/client";
import type { Contact } from "../core/crm-entities";
import type { ContactType } from "../core/crm-types";

export type ContactCreateParams = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  type?: ContactType | string;
  description?: string;
  accountId?: string;
  leadId?: string;
  tenantId?: string;
};

function rowToContact(r: any): Contact {
  return {
    id: r.id,
    tenantId: r.organization_id,
    leadId: r.lead_id ?? undefined,
    accountId: r.account_id ?? undefined,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    phone: r.phone ?? undefined,
    title: r.title ?? undefined,
    type: (r.type ?? "customer") as ContactType,
    description: r.description ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function createContact(params: ContactCreateParams, orgId: string): Promise<Contact> {
  const { data, error } = await supabase
    .from("crm_contacts")
    .insert({
      organization_id: orgId,
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
      phone: params.phone ?? null,
      title: params.title ?? null,
      type: params.type ?? "customer",
      description: params.description ?? null,
      account_id: params.accountId ?? null,
      lead_id: params.leadId ?? null,
    })
    .select("*")
    .single();
  if (error || !data) throw error ?? new Error("Failed to create contact");
  return rowToContact(data);
}

async function queryContacts(args: { tenantId: string; search?: string }) {
  let q = supabase
    .from("crm_contacts")
    .select("*", { count: "exact" })
    .eq("organization_id", args.tenantId)
    .order("created_at", { ascending: false });
  if (args.search) {
    q = q.or(
      `first_name.ilike.%${args.search}%,last_name.ilike.%${args.search}%,email.ilike.%${args.search}%`,
    );
  }
  const { data, error, count } = await q;
  if (error) throw error;
  const contacts = (data ?? []).map(rowToContact);
  return { contacts, total: count ?? contacts.length, hasMore: false };
}

async function updateContact(id: string, updates: Partial<ContactCreateParams>, orgId: string) {
  const patch: Record<string, unknown> = {};
  if (updates.firstName !== undefined) patch.first_name = updates.firstName;
  if (updates.lastName !== undefined) patch.last_name = updates.lastName;
  if (updates.email !== undefined) patch.email = updates.email;
  if (updates.phone !== undefined) patch.phone = updates.phone;
  if (updates.title !== undefined) patch.title = updates.title;
  if (updates.type !== undefined) patch.type = updates.type;
  if (updates.description !== undefined) patch.description = updates.description;
  const { data, error } = await supabase
    .from("crm_contacts")
    .update(patch)
    .eq("id", id)
    .eq("organization_id", orgId)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? rowToContact(data) : undefined;
}

async function removeContact(id: string, orgId: string) {
  const { error } = await supabase
    .from("crm_contacts")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);
  if (error) throw error;
}

export const crmService = {
  contacts: {
    create: (params: ContactCreateParams) => {
      const orgId = params.tenantId;
      if (!orgId) throw new Error("tenantId (organization id) is required");
      return createContact(params, orgId);
    },
    query: queryContacts,
    update: updateContact,
    remove: removeContact,
  },
};
