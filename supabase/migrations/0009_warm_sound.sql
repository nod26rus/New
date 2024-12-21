/*
  # Admin Settings Migration

  1. New Tables
    - `entries` - For storing user journal entries
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `content` (text)
      - `type` (text)
      - `created_at` (timestamptz)

  2. Settings
    - Add AI-related settings
    - Add prompt templates
*/

-- Create entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own entries"
  ON entries
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all entries"
  ON entries
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add AI settings
INSERT INTO settings (key, value, type, category)
VALUES 
  ('chatgpt_api_key', '', 'string', 'ai'),
  ('dalle_api_key', '', 'string', 'ai'),
  ('daily_chatgpt_limit', '100', 'number', 'limits'),
  ('daily_dalle_limit', '50', 'number', 'limits'),
  ('morning_prompt', 'Write a motivational morning message about:', 'string', 'prompts'),
  ('evening_prompt', 'Reflect on the day and write about:', 'string', 'prompts')
ON CONFLICT (key) DO NOTHING;