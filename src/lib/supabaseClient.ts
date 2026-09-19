import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 'https://srkmejgtihsyxyxlfcce.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNya21lamd0aWhzeXh5eGxmY2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4Mzc5MDEsImV4cCI6MjEwNTQxMzkwMX0.Y_9CvkGhuWUOy7Mg3CKnfX1muVKU4-F_ZBFijz-34js';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
