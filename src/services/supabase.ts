import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase dashboard: Settings -> API
// Create a .env file (or use app.json / app.config.js) to store these securely.
// In Expo, variables prefixed with EXPO_PUBLIC_ are automatically loaded.

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
