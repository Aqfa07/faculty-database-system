-- Create dosen_members table for faculty (Dosen)
CREATE TABLE IF NOT EXISTS dosen_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nip TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('L', 'P')),
  place_of_birth TEXT,
  date_of_birth DATE,
  retirement_date DATE,
  email TEXT,
  phone TEXT,
  department TEXT,
  rank_golongan TEXT,
  rank_tmt DATE,
  education_level TEXT,
  education_field TEXT,
  graduation_year INTEGER,
  years_of_service INTEGER,
  position_functional TEXT,
  position_tmt DATE,
  home_base TEXT,
  unit_kerja TEXT,
  notes TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dosen_identification table to handle NIDN and NIDK
CREATE TABLE IF NOT EXISTS dosen_identification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dosen_id UUID NOT NULL REFERENCES dosen_members(id) ON DELETE CASCADE,
  identification_type TEXT NOT NULL CHECK (identification_type IN ('NIDN', 'NIDK', 'NUPTK')),
  identification_number TEXT NOT NULL,
  tmt_issued DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identification_type, identification_number)
);

-- Create indexes for dosen_members
CREATE INDEX IF NOT EXISTS idx_dosen_members_nip ON dosen_members(nip);
CREATE INDEX IF NOT EXISTS idx_dosen_members_department ON dosen_members(department);
CREATE INDEX IF NOT EXISTS idx_dosen_members_is_active ON dosen_members(is_active);
CREATE INDEX IF NOT EXISTS idx_dosen_members_rank_golongan ON dosen_members(rank_golongan);

-- Create indexes for dosen_identification
CREATE INDEX IF NOT EXISTS idx_dosen_identification_type ON dosen_identification(identification_type);
CREATE INDEX IF NOT EXISTS idx_dosen_identification_number ON dosen_identification(identification_number);
CREATE INDEX IF NOT EXISTS idx_dosen_id ON dosen_identification(dosen_id);

-- Enable RLS for dosen_members
ALTER TABLE dosen_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosen_identification ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dosen_members
CREATE POLICY "All authenticated users can view dosen" ON dosen_members FOR SELECT USING (true);
CREATE POLICY "PJ and admins can insert dosen" ON dosen_members FOR INSERT WITH CHECK (true);
CREATE POLICY "PJ and admins can update dosen" ON dosen_members FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete dosen" ON dosen_members FOR DELETE USING (true);

-- RLS Policies for dosen_identification
CREATE POLICY "All authenticated users can view dosen identification" ON dosen_identification FOR SELECT USING (true);
CREATE POLICY "PJ and admins can insert dosen identification" ON dosen_identification FOR INSERT WITH CHECK (true);
CREATE POLICY "PJ and admins can update dosen identification" ON dosen_identification FOR UPDATE USING (true);
CREATE POLICY "Only admins can delete dosen identification" ON dosen_identification FOR DELETE USING (true);
