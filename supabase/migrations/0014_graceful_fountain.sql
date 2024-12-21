/*
  # Referral and Partnership System

  1. New Tables
    - referrals: Track referral relationships and rewards
    - partner_links: Store partner-specific tracking links
    - partner_stats: Track partner performance metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for referral and partner access

  3. Changes
    - Add referral_code to users table
*/

-- Create referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'rewarded', 'expired')),
  reward_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referred_id)
);

-- Create partner_links table
CREATE TABLE partner_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  reward_config JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create partner_stats table
CREATE TABLE partner_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_link_id UUID NOT NULL REFERENCES partner_links(id),
  clicks INTEGER NOT NULL DEFAULT 0,
  signups INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  UNIQUE(partner_link_id, date)
);

-- Add referral_code to users
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_stats ENABLE ROW LEVEL SECURITY;

-- Policies for referrals
CREATE POLICY "Users can view their own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- Policies for partner links
CREATE POLICY "Users can manage their own partner links"
  ON partner_links
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view active partner links"
  ON partner_links
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policies for partner stats
CREATE POLICY "Partners can view their own stats"
  ON partner_stats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partner_links pl
      WHERE pl.id = partner_link_id
        AND pl.user_id = auth.uid()
    )
  );

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code exists
    SELECT EXISTS (
      SELECT 1 FROM auth.users WHERE referral_code = code
    ) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code for new users
CREATE OR REPLACE FUNCTION create_user_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_user_referral_code
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_referral_code();

-- Function to process referral reward
CREATE OR REPLACE FUNCTION process_referral_reward(referral_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Update referral status
  UPDATE referrals
  SET status = 'rewarded'
  WHERE id = referral_id
    AND status = 'pending';

  -- Add reward points to referrer
  UPDATE auth.users u
  SET points = COALESCE(points, 0) + (
    SELECT reward_amount 
    FROM referrals 
    WHERE id = referral_id
  )
  WHERE u.id = (
    SELECT referrer_id 
    FROM referrals 
    WHERE id = referral_id
  );
END;
$$ LANGUAGE plpgsql;