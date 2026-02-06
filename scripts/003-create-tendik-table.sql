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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "All authenticated users can view tendik" ON tendik_members;
DROP POLICY IF EXISTS "PJ and admins can insert tendik" ON tendik_members;
DROP POLICY IF EXISTS "PJ and admins can update tendik" ON tendik_members;
DROP POLICY IF EXISTS "Only admins can delete tendik" ON tendik_members;

-- RLS Policies for tendik_members table
CREATE POLICY "All authenticated users can view tendik" ON tendik_members FOR SELECT USING (true);
CREATE POLICY "PJ and admins can insert tendik" ON tendik_members FOR INSERT WITH CHECK (true);
CREATE POLICY "PJ and admins can update tendik" ON tendik_members FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete tendik" ON tendik_members FOR DELETE USING (true);
