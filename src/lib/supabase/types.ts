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
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content: string;
  created_at: string;
}

export interface DbInvoice {
  id: string;
  project_id: string | null;
  amount: number;
  currency: string;
  status: string;
  user_id: string | null;
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
  created_at: string;
}
