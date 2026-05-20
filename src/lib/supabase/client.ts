import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let browserClient: SupabaseClient | null = null;

function createBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase not configured - running in mock mode");
    return createClient("https://placeholder.supabase.co", "public-anon-key");
  }

  browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}

export const supabase = createBrowserClient();

export const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
