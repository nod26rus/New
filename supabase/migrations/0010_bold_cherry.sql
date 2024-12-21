/*
  # Advertisement Settings Migration

  1. New Settings
    - Add advertisement settings
    - Add post list ad interval setting
*/

-- Add advertisement settings
INSERT INTO settings (key, value, type, category)
VALUES 
  ('ad_html_code', '', 'string', 'ads'),
  ('ad_enabled', 'false', 'boolean', 'ads'),
  ('post_list_ad_interval', '0', 'number', 'ads')
ON CONFLICT (key) DO NOTHING;