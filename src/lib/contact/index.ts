/**
 * Public contact form submissions — admin inbox.
 */
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";

export type ContactStatus = "new" | "in_review" | "responded" | "archived";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

function map(r: any): ContactSubmission {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    company: r.company,
    budget: r.budget,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** Anyone (incl. anon) may submit. */
export async function submitContact(input: {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
}): Promise<void> {
  if (!SUPABASE_READY) throw new Error("Backend unavailable");
  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    company: input.company ?? null,
    budget: input.budget ?? null,
    message: input.message,
  });
  if (error) throw error;
}

export async function listContactSubmissions(): Promise<ContactSubmission[]> {
  if (!SUPABASE_READY) return [];
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map(map);
}

export async function updateContactStatus(id: string, status: ContactStatus): Promise<void> {
  await supabase
    .from("contact_submissions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteContactSubmission(id: string): Promise<void> {
  await supabase.from("contact_submissions").delete().eq("id", id);
}

export async function getNewContactCount(): Promise<number> {
  if (!SUPABASE_READY) return 0;
  const { count } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  return count ?? 0;
}
