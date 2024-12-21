/*
  # Community Discussion System

  1. New Tables
    - `discussion_threads`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `user_id` (uuid, references auth.users)
      - `likes_count` (integer)
      - `replies_count` (integer) 
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_hidden` (boolean)
      - `tags` (text[])
    
    - `discussion_replies`
      - `id` (uuid, primary key)
      - `thread_id` (uuid, references discussion_threads)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `likes_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_hidden` (boolean)

    - `discussion_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `target_id` (uuid)
      - `target_type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies for moderation
*/

-- Create discussion_threads table
CREATE TABLE discussion_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Create discussion_replies table
CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_hidden BOOLEAN NOT NULL DEFAULT false
);

-- Create discussion_likes table
CREATE TABLE discussion_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('thread', 'reply')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_id, target_type)
);

-- Enable RLS
ALTER TABLE discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_likes ENABLE ROW LEVEL SECURITY;

-- Policies for discussion_threads
CREATE POLICY "Anyone can view non-hidden threads"
  ON discussion_threads
  FOR SELECT
  USING (NOT is_hidden);

CREATE POLICY "Authenticated users can create threads"
  ON discussion_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
  ON discussion_threads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any thread"
  ON discussion_threads
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for discussion_replies
CREATE POLICY "Anyone can view non-hidden replies"
  ON discussion_replies
  FOR SELECT
  USING (NOT is_hidden);

CREATE POLICY "Authenticated users can create replies"
  ON discussion_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies"
  ON discussion_replies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any reply"
  ON discussion_replies
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for discussion_likes
CREATE POLICY "Anyone can view likes"
  ON discussion_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage their likes"
  ON discussion_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_discussion_threads_user_id ON discussion_threads(user_id);
CREATE INDEX idx_discussion_threads_created_at ON discussion_threads(created_at);
CREATE INDEX idx_discussion_replies_thread_id ON discussion_replies(thread_id);
CREATE INDEX idx_discussion_replies_user_id ON discussion_replies(user_id);
CREATE INDEX idx_discussion_likes_target ON discussion_likes(target_id, target_type);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'thread' THEN
      UPDATE discussion_threads
      SET likes_count = likes_count + 1
      WHERE id = NEW.target_id;
    ELSE
      UPDATE discussion_replies
      SET likes_count = likes_count + 1
      WHERE id = NEW.target_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'thread' THEN
      UPDATE discussion_threads
      SET likes_count = likes_count - 1
      WHERE id = OLD.target_id;
    ELSE
      UPDATE discussion_replies
      SET likes_count = likes_count - 1
      WHERE id = OLD.target_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for likes
CREATE TRIGGER update_thread_likes_count
AFTER INSERT OR DELETE ON discussion_likes
FOR EACH ROW
EXECUTE FUNCTION update_likes_count();

-- Create function to update replies count
CREATE OR REPLACE FUNCTION update_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussion_threads
    SET replies_count = replies_count + 1
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussion_threads
    SET replies_count = replies_count - 1
    WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for replies count
CREATE TRIGGER update_thread_replies_count
AFTER INSERT OR DELETE ON discussion_replies
FOR EACH ROW
EXECUTE FUNCTION update_replies_count();