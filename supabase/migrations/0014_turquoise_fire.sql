/*
  # Initial Schema Setup

  1. New Tables
    - users: Store user accounts and profiles
    - posts: Store blog posts and articles
    - tags: Store content categories and tags
    - settings: Store application settings
    - api_usage: Track API usage per user
    - _PostToTag: Junction table for post-tag relationships

  2. Indexes
    - Unique constraints on emails, slugs, and tag names
    - Performance indexes on frequently queried fields
*/

-- CreateTable
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    author_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    user_id UUID NOT NULL,
    date_str TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT api_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE posts_tags (
    post_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT posts_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT posts_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndexes
CREATE UNIQUE INDEX users_email_key ON users(email);
CREATE UNIQUE INDEX posts_slug_key ON posts(slug);
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE UNIQUE INDEX tags_name_key ON tags(name);
CREATE UNIQUE INDEX tags_slug_key ON tags(slug);
CREATE INDEX tags_slug_idx ON tags(slug);
CREATE UNIQUE INDEX settings_key_key ON settings(key);
CREATE INDEX settings_key_idx ON settings(key);
CREATE UNIQUE INDEX api_usage_user_id_type_date_str_key ON api_usage(user_id, type, date_str);
CREATE INDEX api_usage_date_str_idx ON api_usage(date_str);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_tags ENABLE ROW LEVEL SECURITY;