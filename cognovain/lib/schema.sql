-- Cognovain Database Schema

-- Analysis History Table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  statement TEXT NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at);

-- Add comment to table
COMMENT ON TABLE analysis_history IS 'Stores user cognitive bias analysis history';