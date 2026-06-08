// Browser-side Supabase client (used in Client Components)
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

// Explicit return type is load-bearing — see lib/supabase/server.ts for the full
// explanation. ssr's factory is called without the `<Database>` generic on purpose.
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
