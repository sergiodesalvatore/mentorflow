import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials to simple deployment for user
// NOTE: Ideally these should be in .env, but hardcoding here to unblock deployment issues with Vercel UI
const supabaseUrl = 'https://oreumuycaizvlxoudhrg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZXVtdXljYWl6dmx4b3VkaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMTAxMTUsImV4cCI6MjA4MTU4NjExNX0.SdMUYou9PIOFMgtVTuE-HhvT3GcrUtaxtVLC79-M_9cR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
