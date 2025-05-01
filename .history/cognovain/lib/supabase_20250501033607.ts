import { createClient } from '@supabase/supabase-js';

// Cache the Supabase client to avoid creating multiple connections
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Initialize the Supabase client with environment variables
// This client is for server-side access
export const createServerSupabaseClient = () => {
  // Return cached client if available
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable. Check your .env.local file.');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Check your .env.local file.');
  }
  
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('Creating Supabase client with URL:', supabaseUrl);
  }
  
  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      // Add global error handler
      global: {
        fetch: (...args) => fetch(...args)
      }
    });
    
    return supabaseClient;
  } catch (error) {
    // Log detailed error in development, generic message in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating Supabase client:', error);
    }
    throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Types for Supabase database tables
export type AnalysisHistory = {
  id: string;
  user_id: string;
  statement: string;
  analysis: string;
  created_at: string;
}

// Database table names
export const ANALYSIS_HISTORY_TABLE = 'analysis_history';