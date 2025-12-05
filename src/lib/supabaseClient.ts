import { createClient, SupabaseClient } from '@supabase/supabase-js';

// By removing the global supabase variable, we ensure that a new client
// is created with the latest environment variables on each request.
// This prevents issues with stale configurations in a development environment.

export const getSupabase = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Create and return a new client every time.
  return createClient(supabaseUrl, supabaseAnonKey);
};
