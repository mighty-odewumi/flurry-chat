import { createClient } from '@supabase/supabase-js';
// import { getFirebaseToken } from "../getFirebaseToken";

const supabaseUrl = "https://osnkgvzajelaqxdorsmk.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;
// const token = await getFirebaseToken();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, 
  // {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // }
);
