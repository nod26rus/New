/*
  # Add social links to settings

  1. New Settings
    - Add social media links to settings table
    - Add copyright text to settings
  
  2. Default Values
    - Set default values for social links and copyright
*/

-- Insert default social media settings
INSERT INTO settings (key, value, type, category)
VALUES
  ('socialLinks', '[]', 'json', 'site'),
  ('copyrightText', '© {year} Modern AI Blog. All rights reserved.', 'string', 'site')
ON CONFLICT (key) DO NOTHING;