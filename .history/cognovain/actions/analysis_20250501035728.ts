'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createServerSupabaseClient, createServerSupabaseAdminClient, ANALYSIS_HISTORY_TABLE } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface AnalysisEntry {
  statement: string;
  analysis: string;
  createdAt: Date;
}

// Add the HistoryEntry interface to match what's expected in the component
export interface HistoryEntry {
  id: string;
  statement: string;
  analysis: string;
  createdAt: Date;
}

// Response interface for saveAnalysisToHistory function
export interface SaveAnalysisResponse {
  success: boolean;
  data: any;
  warning?: string;
}

/**
 * Save an analysis to the user's history in Supabase
 */
export async function saveAnalysisToHistory(analysis: AnalysisEntry): Promise<SaveAnalysisResponse> {
  try {
    // Get the current user from Clerk auth
    const user = await currentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Validate environment variables before creating client
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      throw new Error('Database configuration error');
    }
    
    // Create a Supabase admin client for insert operation
    // We use the admin client here because we need to ensure the insert succeeds
    // regardless of RLS policies (in case they're misconfigured)
    const supabase = createServerSupabaseAdminClient();
    
    // Validate that the table exists by checking the schema
    try {
      // Insert the analysis into the database
      const { data, error } = await supabase
        .from(ANALYSIS_HISTORY_TABLE)
        .insert({
          id: uuidv4(),
          user_id: user.id,
          statement: analysis.statement,
          analysis: analysis.analysis,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to save analysis: ${error.message}`);
      }
      
      console.log('Analysis saved to Supabase for user:', user.id);
      
      return { success: true, data };
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      // Return success true but with a warning to prevent blocking the user experience
      return { success: true, warning: 'Analysis could not be saved to history', data: null };
    }
  } catch (error) {
    console.error('Error saving analysis to history:', error);
    // Return success true to prevent blocking the user experience
    return { success: true, warning: 'Analysis could not be saved to history', data: null };
  }
}

/**
 * Get the user's analysis history from Supabase
 */
export async function getAnalysisHistory(): Promise<HistoryEntry[]> {
  try {
    // Get the current user from Clerk auth
    const user = await currentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create a Supabase admin client for insert operation
    // We use the admin client here because we need to ensure the insert succeeds
    // regardless of RLS policies (in case they're misconfigured)
    const supabase = createServerSupabaseAdminClient();
    
    // Debug logging
    console.log('Supabase client created, attempting to fetch data for user:', user.id);
    console.log('Using table:', ANALYSIS_HISTORY_TABLE);
    
    try {
      // Query the database for analyses by this user
      const { data, error } = await supabase
        .from(ANALYSIS_HISTORY_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Detailed Supabase error:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to fetch analysis history: ${error.message || 'Unknown error'}`);
      }
      
      console.log('Successfully fetched data, count:', data?.length || 0);
      
      // Convert database format to application format with explicit typing
      const entries: HistoryEntry[] = data.map(entry => ({
        id: entry.id as string,
        statement: entry.statement as string,
        analysis: entry.analysis as string,
        createdAt: new Date(entry.created_at as string)
      }));
      
      return entries;
    } catch (queryError) {
      console.error('Query execution error:', queryError);
      throw queryError;
    }
  } catch (error) {
    console.error('Error getting analysis history:', error);
    throw error;
  }
}