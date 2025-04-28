/**
 * Type definitions for Cognovain application
 */

// Analysis related types
export interface Analysis {
  id: string;
  userId: string;
  originalText: string;
  analysisResult: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRequest {
  text: string;
  userId?: string;
}

export interface AnalysisResponse {
  result: string;
  error?: string;
}

// User related types
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

// UI related types
export interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// API related types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Supabase related types
export interface SupabaseAnalysisRecord {
  id: string;
  user_id: string;
  original_text: string;
  analysis_result: string;
  created_at: string;
  updated_at: string;
}

// Component props types
export interface UploadFormProps {
  userId?: string;
}

export interface HistoryListProps {
  userId: string;
}

export interface HistoryItemProps {
  analysis: Analysis;
}