import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/utils/env";

let browserClient: SupabaseClient | null = null;

function createBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    // Placeholder client — calls will fail, but repositories gate on
    // SUPABASE_READY and fall back to mock data.
    browserClient = createClient("https://placeholder.supabase.co", "public-anon-key");
    return browserClient;
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}

export const supabase = createBrowserClient();

export const SUPABASE_READY = isSupabaseConfigured();
