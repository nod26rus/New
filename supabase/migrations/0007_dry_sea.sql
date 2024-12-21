/*
  # Add personalized recommendations functionality
  
  1. New Tables
    - `user_preferences` for storing user category preferences
    - `guest_preferences` for storing anonymous user preferences
    
  2. Settings
    - Add recommendations settings
*/

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create guest preferences table
CREATE TABLE IF NOT EXISTS guest_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(guest_id, category_id)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can manage guest preferences"
  ON guest_preferences FOR ALL
  TO anon
  USING (true);

-- Add recommendations settings
INSERT INTO settings (key, value, type, category)
VALUES 
  ('recommendations_enabled', 'true', 'boolean', 'site'),
  ('recommendations_count', '6', 'number', 'site')
ON CONFLICT (key) DO NOTHING;

-- Create function to get recommended posts
CREATE OR REPLACE FUNCTION get_recommended_posts(
  p_user_id UUID DEFAULT NULL,
  p_guest_id TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  title JSONB,
  slug TEXT,
  excerpt JSONB,
  "featuredImage" TEXT,
  "createdAt" TIMESTAMPTZ,
  relevance INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_cats AS (
    SELECT category_id, view_count
    FROM user_preferences
    WHERE user_id = p_user_id
    UNION ALL
    SELECT category_id, view_count
    FROM guest_preferences
    WHERE guest_id = p_guest_id
  )
  SELECT DISTINCT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p."featuredImage",
    p."createdAt",
    COALESCE(uc.view_count, 0) as relevance
  FROM posts p
  JOIN posts_categories pc ON pc.post_id = p.id
  LEFT JOIN user_cats uc ON uc.category_id = pc.category_id
  WHERE p.published = true
  ORDER BY relevance DESC, p."createdAt" DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;