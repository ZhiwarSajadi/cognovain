import { createClient } from '@supabase/supabase-js';

// Cache the Supabase clients to avoid creating multiple connections
let supabaseAdminClient: ReturnType<typeof createClient> | null = null;
let supabaseRegularClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialize the Supabase client with service role key for admin operations
 * This client bypasses Row Level Security (RLS) and should ONLY be used for:
 * - Operations that require admin privileges (like guaranteed writes)
 * - Server-side operations where RLS might be too restrictive
 */
export const createServerSupabaseAdminClient = () => {
  // Return cached admin client if available
  if (supabaseAdminClient) return supabaseAdminClient;
  
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
    console.log('Creating Supabase admin client with URL:', supabaseUrl);
  }
  
  try {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      // Add global error handler
      global: {
        fetch: (...args) => fetch(...args)
      }
    });
    
    return supabaseAdminClient;
  } catch (error) {
    // Log detailed error in development, generic message in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating Supabase admin client:', error);
    }
    throw new Error(`Failed to initialize Supabase admin client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Initialize the Supabase client with anon key for regular operations
 * This client respects Row Level Security (RLS) policies and should be used for:
 * - Read operations where RLS can enforce access control
 * - Operations where user-specific access control is important
 */
export const createServerSupabaseClient = () => {
  // Return cached regular client if available
  if (supabaseRegularClient) return supabaseRegularClient;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable. Check your .env.local file.');
  }
  
  if (!supabaseAnonKey) {
    // Fall back to service role key if anon key is not available
    // This is not ideal but prevents breaking existing functionality
    console.warn('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY, falling back to service role key. This is not recommended for production.');
    return createServerSupabaseAdminClient();
  }
  
  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('Creating Supabase regular client with URL:', supabaseUrl);
  }
  
  try {
    supabaseRegularClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      // Add global error handler
      global: {
        fetch: (...args) => fetch(...args)
      }
    });
    
    return supabaseRegularClient;
  } catch (error) {
    // Log detailed error in development, generic message in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating Supabase regular client:', error);
    }
    throw new Error(`Failed to initialize Supabase regular client: ${error instanceof Error ? error.message : 'Unknown error'}`);
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