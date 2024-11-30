import { createClient } from '@supabase/supabase-js';
// import { getFirebaseToken } from "../getFirebaseToken";

const supabaseUrl = import.meta.env.VITE_SUPABASE_BUCKET;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
