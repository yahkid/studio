// Supabase client initialization logic has been removed as the project is migrating to Firebase.
// This file is deprecated and will be removed once all Supabase dependencies are eliminated.

import type { SupabaseClient } from '@supabase/supabase-js';

// Log a warning that Supabase is being phased out.
if (typeof console !== 'undefined' && typeof console.warn === 'function') {
  let warningMessage = "*********************************************************************\n";
  warningMessage += "** WARNING: supabaseClient.ts is DEPRECATED.                     **\n";
  warningMessage += "** Project is migrating from Supabase to Firebase.                 **\n";
  warningMessage += "** The 'supabase' export from this file is now NULL.             **\n";
  warningMessage += "** Ensure all Supabase-dependent code has been migrated.         **\n";
  warningMessage += "*********************************************************************";
  console.warn(warningMessage);
}

export const supabase: SupabaseClient | null = null;
