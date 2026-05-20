import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let requestClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client for TanStack Start.
 * Accepts optional access token for user-scoped RLS.
 */
export function getRequestSupabase(accessToken?: string): SupabaseClient {
  if (requestClient && !accessToken) return requestClient;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase not configured - running in mock mode");
    return createClient("https://placeholder.supabase.co", "public-anon-key");
  }

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  });

  if (!accessToken) requestClient = client;
  return client;
}
