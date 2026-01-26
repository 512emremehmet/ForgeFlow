
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1';

// Provided Supabase credentials
const PROVIDED_URL = 'https://kzvfdxzjesorttypozdd.supabase.co';
const PROVIDED_ANON_KEY = 'sb_publishable_cpUJfe-uZ5qujCR9VpmWNQ_LjSzK-2Z';

// Priority: process.env (for deployment) > provided hardcoded strings (for quick MVP start)
const supabaseUrl = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) || PROVIDED_URL;
const supabaseAnonKey = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || PROVIDED_ANON_KEY;

// Note: Secret keys (sb_secret_...) should never be used in the client-side code.
// We use the anon key for all public operations.

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: () => {
        console.error("Supabase credentials missing! Ensure URL and Anon Key are set.");
        return () => Promise.resolve({ data: null, error: new Error("Supabase not configured") });
      }
    });

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
