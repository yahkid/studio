
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Attempt to read Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseExportInstance: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) {
  // Only attempt to initialize if both URL and Key are present and URL looks valid
  try {
    supabaseExportInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error(
      "\n********************\n" +
      "ALERT: Error initializing Supabase client even though environment variables seem present.\n" +
      "Supabase URL: " + supabaseUrl + "\n" +
      "Error: " + (e instanceof Error ? e.message : String(e)) + "\n" +
      "Any Supabase-dependent functionality WILL FAIL.\n" +
      "********************\n"
    );
    // supabaseExportInstance will remain null if initialization fails
  }
} else {
  // If variables are missing or URL is invalid, log a clear warning but do not throw.
  const missingVars = [];
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) missingVars.push('NEXT_PUBLIC_SUPABASE_URL (must be a valid URL starting with http(s)://)');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missingVars.length > 0) {
    const warningMessage =
      `\n********************\n` +
      `ALERT: Supabase environment variable(s) (${missingVars.join(', ')}) are MISSING or INVALID.\n` +
      `The Supabase client CANNOT be initialized. Any Supabase-dependent functionality WILL FAIL.\n` +
      `This is a temporary state during Firebase migration. Supabase database calls will be removed.\n` +
      `Ensure these are set in Vercel project environment variables ONLY IF Supabase features are still intentionally active AND correctly configured.\n` +
      `********************\n`;

    console.warn(warningMessage);
  }
  // supabaseExportInstance is already null by default if this block is reached
}

export const supabase = supabaseExportInstance;

// Optional: Function to check Supabase env vars (can be called explicitly if needed for diagnostics)
// This function does not throw errors but logs warnings.
export function checkSupabaseEnv() {
    const missingVars = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')) {
        missingVars.push('NEXT_PUBLIC_SUPABASE_URL (valid URL)');
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    if (missingVars.length > 0) {
        console.warn(`DEVELOPMENT WARNING: The following Supabase environment variables are missing or invalid: ${missingVars.join(', ')}. If migration to Firebase DB is complete, these checks might be removable soon.`);
        return false;
    }
    return true;
}

// Call check on module load (primarily for server-side or build-time checks if applicable)
// For client-side, the try-catch in initialization block is more relevant for runtime.
// This check will only run when the module is first evaluated.
if (typeof window !== 'undefined') { // Only run checkSupabaseEnv in client-side context if needed
    // checkSupabaseEnv(); // You can call this if you want an explicit check on client-side load too, but the main logic above handles the null client.
}
