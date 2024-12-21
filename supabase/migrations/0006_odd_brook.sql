/*
  # Add newsletter subscription functionality
  
  1. New Tables
    - `subscribers` table for storing newsletter subscribers
    
  2. Settings
    - Add newsletter settings
*/

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for admins
CREATE POLICY "Admins can manage subscribers"
  ON subscribers
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add newsletter settings
INSERT INTO settings (key, value, type, category)
VALUES 
  ('newsletter_enabled', 'true', 'boolean', 'site'),
  ('newsletter_welcome_text', 'Thank you for subscribing to our newsletter!', 'string', 'site')
ON CONFLICT (key) DO NOTHING;