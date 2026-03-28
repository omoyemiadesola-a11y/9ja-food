import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const ADMIN_EMAIL = '9jafoodsucres@gmail.com';
export const LOCAL_ADMIN_TOKEN =
  import.meta.env.VITE_LOCAL_ADMIN_TOKEN || 'LOCAL_ADMIN_9JA_TOKEN_CHANGE_ME';
