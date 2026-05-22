/**
 * Database row types (Supabase/Postgres shape).
 * These represent the raw data coming from Supabase tables.
 */

export interface DbProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  user_id: string | null;
  organization_id?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRequest {
  id: string;
  subject: string;
  category: string | null;
  priority: string | null;
  status: string;
  user_id: string | null;
  organization_id?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content: string;
  organization_id?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface DbInvoice {
  id: string;
  project_id: string | null;
  amount: number;
  currency: string;
  status: string;
  user_id: string | null;
  organization_id?: string | null;
  created_by?: string | null;
  created_at: string;
  due_at: string | null;
}

export interface DbPayment {
  id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  status: string;
  user_id: string | null;
  organization_id?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface DbProfile {
  id: string;
  organization_id: string | null;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface DbOrganization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
  updated_at?: string;
}

export interface DbOrganizationMember {
  organization_id: string;
  profile_id: string;
  role: string;
  created_at: string;
}

export interface DbWorkspace {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DbWorkspaceMember {
  workspace_id: string;
  profile_id: string;
  role: string;
  created_at: string;
}

/**
 * Full Supabase Database type for typed client queries.
 * Enables .from<Tables>() with full Row/Insert/Update safety.
 * Used for future strict typing in repositories.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: DbProfile & { email?: string | null };
        Insert: {
          id: string;
          organization_id?: string | null;
          full_name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          email?: string | null;
        };
        Update: Partial<{
          organization_id: string | null;
          full_name: string | null;
          role: string | null;
          avatar_url: string | null;
        }>;
      };
      projects: {
        Row: DbProject;
        Insert: Omit<DbProject, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<DbProject, "id" | "created_at">>;
      };
      requests: {
        Row: DbRequest;
        Insert: Omit<DbRequest, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<DbRequest, "id" | "created_at">>;
      };
      messages: {
        Row: DbMessage;
        Insert: Omit<DbMessage, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<DbMessage, "id" | "created_at">>;
      };
      invoices: {
        Row: DbInvoice;
        Insert: Omit<DbInvoice, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<DbInvoice, "id" | "created_at">>;
      };
      payments: {
        Row: DbPayment;
        Insert: Omit<DbPayment, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<DbPayment, "id" | "created_at">>;
      };
      organizations: {
        Row: DbOrganization;
        Insert: Omit<DbOrganization, "created_at"> & { id?: string };
        Update: Partial<Omit<DbOrganization, "id" | "created_at">>;
      };
      organization_members: {
        Row: DbOrganizationMember;
        Insert: DbOrganizationMember;
        Update: Partial<DbOrganizationMember>;
      };
      workspaces: {
        Row: DbWorkspace;
        Insert: Omit<DbWorkspace, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Omit<DbWorkspace, "id" | "created_at">>;
      };
      workspace_members: {
        Row: DbWorkspaceMember;
        Insert: DbWorkspaceMember;
        Update: Partial<DbWorkspaceMember>;
      };
    };
  };
}
