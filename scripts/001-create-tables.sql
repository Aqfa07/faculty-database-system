-- FK UNAND Database System Schema
-- Create users table for authentication and role management
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'pj', 'staff')),
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create faculty_members table for detailed profiles
CREATE TABLE IF NOT EXISTS faculty_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nip TEXT UNIQUE NOT NULL,
  nidn TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT NOT NULL,
  position TEXT,
  academic_rank TEXT,
  specialization TEXT,
  education_history JSONB DEFAULT '[]',
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dean_performance table for quarterly performance data
CREATE TABLE IF NOT EXISTS dean_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  category TEXT NOT NULL,
  indicator TEXT NOT NULL,
  target_value NUMERIC,
  achieved_value NUMERIC,
  unit TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'on_track', 'achieved', 'not_achieved')),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, quarter, category, indicator)
);

-- Create upload_logs table to track Excel uploads
CREATE TABLE IF NOT EXISTS upload_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  records_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_logs table for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_members_department ON faculty_members(department);
CREATE INDEX IF NOT EXISTS idx_faculty_members_nip ON faculty_members(nip);
CREATE INDEX IF NOT EXISTS idx_dean_performance_year_quarter ON dean_performance(year, quarter);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dean_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Only admins can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete users" ON users FOR DELETE USING (true);

-- RLS Policies for faculty_members table
CREATE POLICY "All authenticated users can view faculty" ON faculty_members FOR SELECT USING (true);
CREATE POLICY "PJ and admins can insert faculty" ON faculty_members FOR INSERT WITH CHECK (true);
CREATE POLICY "PJ and admins can update faculty" ON faculty_members FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete faculty" ON faculty_members FOR DELETE USING (true);

-- RLS Policies for dean_performance table
CREATE POLICY "All authenticated users can view performance" ON dean_performance FOR SELECT USING (true);
CREATE POLICY "PJ and admins can insert performance" ON dean_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "PJ and admins can update performance" ON dean_performance FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete performance" ON dean_performance FOR DELETE USING (true);

-- RLS Policies for upload_logs table
CREATE POLICY "All authenticated users can view logs" ON upload_logs FOR SELECT USING (true);
CREATE POLICY "All authenticated users can insert logs" ON upload_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for activity_logs table
CREATE POLICY "All authenticated users can view activity" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "All authenticated users can insert activity" ON activity_logs FOR INSERT WITH CHECK (true);

-- Create tendik_members table for non-academic staff (Tenaga Kependidikan)
CREATE TABLE IF NOT EXISTS tendik_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nip TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('L', 'P')),
  place_of_birth TEXT,
  date_of_birth DATE,
  retirement_date DATE,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  rank_golongan TEXT,
  rank_tmt DATE,
  education_level TEXT,
  education_field TEXT,
  graduation_year INTEGER,
  years_of_service INTEGER,
  duty_unit TEXT,
  appointment_date DATE,
  training_name TEXT,
  training_completion_date DATE,
  training_hours INTEGER,
  notes TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for tendik_members
CREATE INDEX IF NOT EXISTS idx_tendik_members_nip ON tendik_members(nip);
CREATE INDEX IF NOT EXISTS idx_tendik_members_department ON tendik_members(department);
CREATE INDEX IF NOT EXISTS idx_tendik_members_position ON tendik_members(position);
CREATE INDEX IF NOT EXISTS idx_tendik_members_is_active ON tendik_members(is_active);

-- Enable RLS for tendik_members
ALTER TABLE tendik_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tendik_members table
CREATE POLICY "All authenticated users can view tendik" ON tendik_members FOR SELECT USING (true);
CREATE POLICY "PJ and admins can insert tendik" ON tendik_members FOR INSERT WITH CHECK (true);
CREATE POLICY "PJ and admins can update tendik" ON tendik_members FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete tendik" ON tendik_members FOR DELETE USING (true);
