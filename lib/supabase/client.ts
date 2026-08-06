'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Singleton instance to prevent recreation on every render
let supabaseClient: SupabaseClient | null = null;

export function createClient() {
  // Return existing instance if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  // Create and cache the instance
  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
}
