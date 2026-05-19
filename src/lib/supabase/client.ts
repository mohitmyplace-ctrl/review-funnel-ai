import { createBrowserClient } from '@supabase/ssr';

// New Supabase projects (2025+) use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
// Older projects use NEXT_PUBLIC_SUPABASE_ANON_KEY. We support both.
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey
  );
}
