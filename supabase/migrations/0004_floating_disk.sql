/*
  # Add likes functionality
  
  1. New Tables
    - `likes` - Stores user likes for posts
      - `id` (uuid, primary key)
      - `post_id` (references posts)
      - `user_id` (references users) 
      - `created_at` (timestamp)
      
  2. Changes
    - Add likes_enabled setting
    
  3. Security
    - Enable RLS on likes table
    - Add policies for authenticated users
*/

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own likes"
  ON likes FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view likes"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

-- Add likes_enabled setting
INSERT INTO settings (key, value, type, category)
VALUES ('likes_enabled', 'true', 'boolean', 'site')
ON CONFLICT (key) DO NOTHING;

-- Add likes count to posts view
CREATE OR REPLACE VIEW post_stats AS
SELECT 
  p.id as post_id,
  COUNT(DISTINCT l.id) as likes_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
GROUP BY p.id;