import { createClient } from '@supabase/supabase-js';

// 👉 Replace these two values with the ones from your Supabase project
// (Project Settings → API → Project URL / anon public key)
const SUPABASE_URL = 'https://jyuyklevbvheahqolbli.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_U59UVRDRtyOlUcHLvP6XKQ_iVzmqmw2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
