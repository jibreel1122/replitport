/*
  # Initial Database Schema

  1. New Tables
    - `sessions` - Session storage for authentication
    - `users` - User profiles from Replit authentication  
    - `projects` - Portfolio projects with bilingual content
    - `contact_messages` - Contact form submissions

  2. Security
    - Enable RLS on all user-facing tables
    - Add policies for authenticated access where needed

  3. Features
    - Bilingual support (English/Arabic) for projects
    - UUID primary keys with automatic generation
    - Proper indexing for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Users table for Replit authentication
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Projects table with bilingual support
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT,
  description_en TEXT NOT NULL,
  description_ar TEXT,
  image_url TEXT NOT NULL,
  demo_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Projects are publicly readable"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage projects
CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read contact messages
CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);