import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Assuming you might generate types later

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// If you have generated types for your database, you can pass them here:
// e.g. export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
// For now, we'll use the generic client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// You can also create a typed client if you generate your Supabase types:
// npx supabase gen types typescript --project-id <your-project-id> --schema public > src/types/supabase.ts
// Then you can use: export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
