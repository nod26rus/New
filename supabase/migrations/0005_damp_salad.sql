/*
  # Add related posts settings
  
  1. Changes
    - Add related_posts_count setting
    
  2. Functions
    - Create function to find related posts by tags
*/

-- Add related posts count setting
INSERT INTO settings (key, value, type, category)
VALUES ('related_posts_count', '3', 'number', 'site')
ON CONFLICT (key) DO NOTHING;

-- Create function to get related posts
CREATE OR REPLACE FUNCTION get_related_posts(post_id UUID, limit_count INTEGER)
RETURNS TABLE (
  id UUID,
  title JSONB,
  slug TEXT,
  excerpt JSONB,
  "featuredImage" TEXT,
  "createdAt" TIMESTAMPTZ,
  relevance BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p."featuredImage",
    p."createdAt",
    COUNT(pt2.tag_id) as relevance
  FROM posts p
  JOIN posts_tags pt1 ON pt1.post_id = $1
  JOIN posts_tags pt2 ON pt2.tag_id = pt1.tag_id
  JOIN posts p2 ON p2.id = pt2.post_id
  WHERE p2.id != $1
    AND p.published = true
  GROUP BY p.id
  ORDER BY relevance DESC, p."createdAt" DESC
  LIMIT $2;
END;
$$ LANGUAGE plpgsql;