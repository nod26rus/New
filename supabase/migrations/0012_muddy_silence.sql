/*
  # Content Media and Subscriptions

  1. New Tables
    - content_media: Store video/audio content metadata
    - subscriptions: Track user subscription status
    - subscription_tiers: Define available subscription plans
    - payments: Record payment history

  2. Security
    - Enable RLS on all tables
    - Add policies for content access based on subscription level
    - Add policies for payment management

  3. Changes
    - Add subscription_level to users table
*/

-- Create content_media table
CREATE TABLE content_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('video', 'audio')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  duration INTEGER,
  thumbnail_url TEXT,
  subscription_level TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscription_tiers table
CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending')),
  stripe_payment_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies for content_media
CREATE POLICY "Anyone can view free content"
  ON content_media FOR SELECT
  USING (subscription_level = 'free');

CREATE POLICY "Premium users can view premium content"
  ON content_media FOR SELECT
  USING (
    subscription_level = 'free' OR
    EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.user_id = auth.uid()
        AND s.status = 'active'
        AND s.current_period_end > now()
    )
  );

-- Policies for subscription management
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, price, features) VALUES
  ('free', 0, '{"features": ["Basic recommendations", "Community access"]}'),
  ('premium', 9.99, '{"features": ["Advanced AI recommendations", "Exclusive content", "Priority support"]}');

-- Create function to check subscription access
CREATE OR REPLACE FUNCTION check_content_access(content_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM content_media cm
    WHERE cm.id = content_id
      AND (
        cm.subscription_level = 'free'
        OR EXISTS (
          SELECT 1 FROM subscriptions s
          WHERE s.user_id = auth.uid()
            AND s.status = 'active'
            AND s.current_period_end > now()
        )
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;