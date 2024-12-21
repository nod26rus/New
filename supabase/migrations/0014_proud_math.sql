/*
  # Likes System Migration

  1. Tables
    - Create posts table with necessary columns
    - Create likes table with foreign key references
  
  2. Security
    - Enable RLS on both tables
    - Add policies for likes management
  
  3. Statistics
    - Create view for post statistics
*/

-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL,
    excerpt JSONB,
    featured_image TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Enable RLS on likes
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
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

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add likes_enabled setting
INSERT INTO settings (key, value, type, category)
VALUES ('likes_enabled', 'true', 'boolean', 'site')
ON CONFLICT (key) DO NOTHING;

-- Create post statistics view
CREATE OR REPLACE VIEW post_stats AS
SELECT 
    p.id as post_id,
    COUNT(DISTINCT l.id) as likes_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
GROUP BY p.id;