/*
  # Add popular articles functionality
  
  1. New Tables
    - `post_views` for tracking article views
    
  2. Settings
    - Add popular posts settings
*/

-- Create post views table
CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting views
CREATE POLICY "Anyone can record views"
  ON post_views FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for reading views
CREATE POLICY "Anyone can read views"
  ON post_views FOR SELECT
  TO public
  USING (true);

-- Add popular posts settings
INSERT INTO settings (key, value, type, category)
VALUES 
  ('popular_posts_period', 'week', 'string', 'site'),
  ('popular_posts_count', '6', 'number', 'site')
ON CONFLICT (key) DO NOTHING;

-- Create function to get popular posts
CREATE OR REPLACE FUNCTION get_popular_posts(
  p_period TEXT DEFAULT 'week',
  p_limit INTEGER DEFAULT 6
)
RETURNS TABLE (
  id UUID,
  title JSONB,
  slug TEXT,
  excerpt JSONB,
  "featuredImage" TEXT,
  "createdAt" TIMESTAMPTZ,
  views_count BIGINT
) AS $$
DECLARE
  period_start TIMESTAMPTZ;
BEGIN
  -- Calculate period start date
  period_start := CASE p_period
    WHEN 'day' THEN now() - INTERVAL '1 day'
    WHEN 'week' THEN now() - INTERVAL '1 week'
    WHEN 'month' THEN now() - INTERVAL '1 month'
    ELSE now() - INTERVAL '1 week'
  END;

  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p."featuredImage",
    p."createdAt",
    COUNT(pv.id) as views_count
  FROM posts p
  LEFT JOIN post_views pv ON p.id = pv.post_id 
    AND pv.viewed_at > period_start
  WHERE p.published = true
  GROUP BY p.id
  ORDER BY views_count DESC, p."createdAt" DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;