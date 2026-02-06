-- Add new fields to tendik_members table
ALTER TABLE tendik_members 
ADD COLUMN IF NOT EXISTS status_kepegawaian TEXT CHECK (status_kepegawaian IN ('PNS', 'PTT', 'PHL', 'Kontrak')) DEFAULT 'PNS',
ADD COLUMN IF NOT EXISTS penempatan_saat_ini TEXT,
ADD COLUMN IF NOT EXISTS unit_kerja_saat_ini TEXT,
ADD COLUMN IF NOT EXISTS tmt_penempatan DATE,
ADD COLUMN IF NOT EXISTS status_pernikahan TEXT CHECK (status_pernikahan IN ('Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati')),
ADD COLUMN IF NOT EXISTS nama_pasangan TEXT,
ADD COLUMN IF NOT EXISTS nik_pasangan TEXT,
ADD COLUMN IF NOT EXISTS nomor_sk_pengangkatan TEXT,
ADD COLUMN IF NOT EXISTS tanggal_sk_pengangkatan DATE,
ADD COLUMN IF NOT EXISTS np_lk DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS np_p DECIMAL(10,2);

-- Create index for status_kepegawaian
CREATE INDEX IF NOT EXISTS idx_tendik_status_kepegawaian ON tendik_members(status_kepegawaian);
CREATE INDEX IF NOT EXISTS idx_tendik_penempatan ON tendik_members(penempatan_saat_ini);
CREATE INDEX IF NOT EXISTS idx_tendik_tmt_penempatan ON tendik_members(tmt_penempatan);
