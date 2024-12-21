/*
  # Settings Table and Default Values

  1. New Table
    - settings: Store application configuration
      - key (text, unique)
      - value (text)
      - type (text)
      - category (text)

  2. Default Values
    - Social media links (empty array)
    - Copyright text with year placeholder
*/

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

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS settings_key_idx ON settings(key);

-- Insert default social media settings
INSERT INTO settings (key, value, type, category)
VALUES
  ('socialLinks', '[]', 'json', 'site'),
  ('copyrightText', '© {year} Modern AI Blog. All rights reserved.', 'string', 'site')
ON CONFLICT (key) DO NOTHING;