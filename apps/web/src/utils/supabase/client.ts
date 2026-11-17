import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://omvqrwufoiijjjlxjfac.supabase.co";

const supabaseKey =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_3ORsWnX3Oo9FO_CgL0oFaA_98f_oZa8";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
