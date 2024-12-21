/*
  # Add advertisement settings

  1. New Settings
    - Add adHtmlCode setting for storing advertisement HTML
    - Add adEnabled flag to control advertisement display
  
  2. Security
    - Warning: HTML code is stored as-is without sanitization
    - Admin responsibility notice in UI
*/

-- Insert advertisement settings
INSERT INTO settings (key, value, type, category)
VALUES
  ('adHtmlCode', '', 'string', 'ads'),
  ('adEnabled', 'false', 'boolean', 'ads')
ON CONFLICT (key) DO NOTHING;