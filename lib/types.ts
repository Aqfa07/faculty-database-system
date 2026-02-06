export interface FacultyMember {
  id: string
  nip: string
  nidn: string | null
  full_name: string
  email: string | null
  phone: string | null
  department: string
  position: string | null
  academic_rank: string | null
  specialization: string | null
  education_history: EducationEntry[]
  photo_url: string | null
  is_active: boolean
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface EducationEntry {
  degree: string
  field: string
  institution: string
  year: number
}

export interface DeanPerformance {
  id: string
  year: number
  quarter: number
  category: string
  indicator: string
  target_value: number | null
  achieved_value: number | null
  unit: string | null
  notes: string | null
  status: "pending" | "on_track" | "achieved" | "not_achieved"
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface UploadLog {
  id: string
  file_name: string
  file_type: string
  table_name: string
  records_count: number
  status: "pending" | "processing" | "completed" | "failed"
  error_message: string | null
  uploaded_by: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: "admin" | "pj" | "staff"
  department: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export const DEPARTMENTS = [
  "Pendidikan Kedokteran",
  "Biomedik",
  "Ilmu Kesehatan Masyarakat",
  "Ilmu Bedah",
  "Ilmu Penyakit Dalam",
  "Ilmu Kesehatan Anak",
  "Obstetri dan Ginekologi",
  "Ilmu Kesehatan Kulit dan Kelamin",
  "Ilmu Kesehatan THT-KL",
  "Ilmu Kesehatan Mata",
  "Neurologi",
  "Psikiatri",
  "Radiologi",
  "Anestesiologi",
  "Patologi Anatomi",
  "Patologi Klinik",
  "Forensik",
  "Rehabilitasi Medik",
  "Kardiologi",
  "Pulmonologi",
] as const

export const ACADEMIC_RANKS = ["Asisten Ahli", "Lektor", "Lektor Kepala", "Guru Besar"] as const

export const PERFORMANCE_CATEGORIES = [
  "Pendidikan",
  "Penelitian",
  "Pengabdian Masyarakat",
  "Kerjasama",
  "Sumber Daya Manusia",
  "Keuangan",
  "Sarana Prasarana",
  "Kemahasiswaan",
  "Tata Kelola",
] as const

export const QUARTERS = [
  { value: 1, label: "Q1 (Jan-Mar)" },
  { value: 2, label: "Q2 (Apr-Jun)" },
  { value: 3, label: "Q3 (Jul-Sep)" },
  { value: 4, label: "Q4 (Oct-Dec)" },
] as const
