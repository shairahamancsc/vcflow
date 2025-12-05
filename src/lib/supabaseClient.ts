import { createClient, SupabaseClient } from '@supabase/supabase-js';

// By removing the global supabase variable, we ensure that a new client
// is created with the latest environment variables on each request.
// This prevents issues with stale configurations in a development environment.

export const getSupabase = (): SupabaseClient => {
  // Using hardcoded credentials for debugging.
  // In a real application, these should come from environment variables.
  const supabaseUrl = 'https://volqlfhcehjmczkbnwvx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbHFsZmhjZWhqbWN6a2Jud3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTY5MDUsImV4cCI6MjA4MDQ3MjkwNX0.-we58Y0i-gKDykLoLV6o26yV-kOZ9pi7jqtxLY0_G20';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
  }

  // Create and return a new client every time.
  return createClient(supabaseUrl, supabaseAnonKey);
};
