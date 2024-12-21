/*
  # Advertisement Settings

  1. Table Check
    - Ensure settings table exists
  
  2. Default Values
    - Ad HTML code (empty string)
    - Ad enabled flag (false)
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

-- Enable RLS if not already enabled
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Insert advertisement settings
INSERT INTO settings (key, value, type, category)
VALUES
  ('adHtmlCode', '', 'string', 'ads'),
  ('adEnabled', 'false', 'boolean', 'ads')
ON CONFLICT (key) DO NOTHING;