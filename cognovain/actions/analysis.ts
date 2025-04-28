'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createServerSupabaseClient, ANALYSIS_HISTORY_TABLE } from '@/lib/supabase';
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

/**
 * Save an analysis to the user's history in Supabase
 */
export async function saveAnalysisToHistory(analysis: AnalysisEntry) {
  try {
    // Get the current user from Clerk auth
    const user = await currentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create a Supabase client
    const supabase = createServerSupabaseClient();
    
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
  } catch (error) {
    console.error('Error saving analysis to history:', error);
    throw new Error('Failed to save analysis to history');
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
    
    // Create a Supabase client
    const supabase = createServerSupabaseClient();
    
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