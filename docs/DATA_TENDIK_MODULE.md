# Data Tendik Module Documentation

## Overview
The Data Tendik (Non-academic Staff) module is a comprehensive management system for handling non-academic personnel data at FK UNAND (Faculty of Medicine, Universitas Andalas). It provides tools for individual data entry, bulk Excel import/export, advanced filtering, and detailed record management.

## Features

### 1. Dashboard Overview
The Data Tendik page provides:
- **Statistics Dashboard**: Key metrics showing total staff, active/inactive counts, and status distribution
- **Responsive Design**: Mobile-friendly interface with optimized layouts for all screen sizes
- **Quick Actions**: Buttons for adding new records, uploading Excel files, and downloading templates

### 2. Data Management

#### Individual Entry
- **Add Data**: Create new Tendik records with comprehensive form
- **Edit Data**: Update existing records with full data validation
- **View Details**: Display complete staff information in read-only mode
- **Delete Records**: Remove records with confirmation dialog

#### Bulk Upload
- **Excel Import**: Upload Excel files containing multiple Tendik records
- **Template Support**: Pre-formatted CSV/Excel templates available for download
- **Progress Tracking**: Real-time upload progress with visual feedback
- **Import Statistics**: Shows count of created, updated, and failed records

### 3. Advanced Filtering & Search
- **Full-Text Search**: Search by name or NIP
- **Department Filter**: Filter by unit/department
- **Position Filter**: Filter by job title/jabatan
- **Status Filter**: Filter by employment status (PNS, PTT, PHL, Kontrak)
- **Clear Filters**: Quick reset button to remove all filters

### 4. Data Fields

#### Personal Information
- **NIP**: Employee ID (Nomor Induk Pegawai) - Unique identifier
- **Full Name**: Complete name
- **Gender**: L (Laki-laki) or P (Perempuan)
- **Place of Birth**: Birth location
- **Date of Birth**: Date of birth (for retirement calculation)
- **Retirement Date**: Expected retirement date

#### Employment Information
- **Position**: Job title (e.g., Pengadministrasi Akademik)
- **Department**: Unit/Department assignment
- **Status Kepegawaian**: Employment status
  - **PNS**: Pegawai Negeri Sipil (Civil Servant)
  - **PTT**: Pegawai Tidak Tetap (Non-permanent Employee)
  - **PHL**: Pegawai Honorer Lepas (Casual/Temporary Staff)
  - **Kontrak**: Contract Employee
- **Penempatan Saat Ini**: Current placement/location
- **Unit Kerja Saat Ini**: Current work unit

#### Career Information
- **Rank/Golongan**: Civil service rank (e.g., III/a, IV/a)
- **TMT Golongan**: Date of rank assignment (Terhitung Mulai Tanggal)
- **Years of Service**: Total years in service
- **Appointment Date**: Initial appointment date
- **Duty Unit**: Primary duty unit

#### Education
- **Education Level**: Level of education (D3, S1, S2, etc.)
- **Education Field**: Field of study
- **Graduation Year**: Year of graduation

#### Contact Information
- **Email**: Email address
- **Phone**: Contact phone number

#### Additional Fields
- **Notes**: Additional information or comments
- **Photo URL**: Staff photo URL
- **Active Status**: Is/Active indicator

## Database Schema

### tendik_members Table

```sql
CREATE TABLE tendik_members (
  id UUID PRIMARY KEY,
  nip TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT,
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
  status_kepegawaian TEXT,
  penempatan_saat_ini TEXT,
  unit_kerja_saat_ini TEXT,
  tmt_penempatan DATE,
  status_pernikahan TEXT,
  nama_pasangan TEXT,
  nik_pasangan TEXT,
  nomor_sk_pengangkatan TEXT,
  tanggal_sk_pengangkatan DATE,
  np_lk DECIMAL,
  np_p DECIMAL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Indexes
- `idx_tendik_members_nip`: NIP lookup
- `idx_tendik_members_department`: Department filtering
- `idx_tendik_members_position`: Position filtering
- `idx_tendik_members_is_active`: Active status filtering
- `idx_tendik_status_kepegawaian`: Employment status filtering
- `idx_tendik_penempatan`: Placement filtering

## API Endpoints

### GET /api/tendik
Fetch Tendik members with optional filters

**Query Parameters:**
- `search`: Search by name or NIP
- `department`: Filter by department
- `position`: Filter by position
- `status`: Filter by employment status (PNS, PTT, PHL, Kontrak)

**Response:**
```json
[
  {
    "id": "uuid",
    "nip": "197504032000122001",
    "full_name": "John Doe",
    "position": "Pengadministrasi Akademik",
    "department": "Administrasi",
    "status_kepegawaian": "PNS",
    "penempatan_saat_ini": "Kantor Dekan",
    "is_active": true
  }
]
```

### POST /api/tendik
Create a new Tendik record

**Request Body:**
```json
{
  "nip": "197504032000122001",
  "full_name": "John Doe",
  "gender": "L",
  "position": "Pengadministrasi Akademik",
  "department": "Administrasi",
  "status_kepegawaian": "PNS",
  "penempatan_saat_ini": "Kantor Dekan",
  "is_active": true
}
```

### PUT /api/tendik/[id]
Update an existing Tendik record

### DELETE /api/tendik/[id]
Delete a Tendik record

### GET /api/tendik/stats
Get dashboard statistics

**Response:**
```json
{
  "totalStaff": 40,
  "activeStaff": 38,
  "inactiveStaff": 2,
  "byStatus": {
    "PNS": 30,
    "PTT": 5,
    "PHL": 3,
    "Kontrak": 2
  },
  "byDepartment": {
    "Administrasi": 10,
    "Laboratorium": 15,
    "Klinik": 15
  }
}
```

### POST /api/upload/tendik
Upload Excel file with bulk Tendik data

**Request:** Multipart form data with file

**Response:**
```json
{
  "message": "Import selesai: 5 ditambahkan, 3 diperbarui, 1 gagal",
  "stats": {
    "created": 5,
    "updated": 3,
    "failed": 1
  },
  "errors": []
}
```

### GET /api/templates/tendik
Download template file for bulk import

## Excel Template Format

The template follows the DUK (Daftar Urut Kepangkatan) format with the following columns:

| No | Nama | L/P | NIP BARU | Tempat Lahir | Tanggal Lahir | TMT Pensiun | Pendidikan | Golongan | Jabatan | Unit Kerja | Status Kepegawaian | Penempatan Saat Ini |
|----|------|-----|----------|--------------|---------------|-------------|-----------|----------|---------|-----------|-------------------|-------------------|
| 1  | Name | L   | NIP      | City         | DD-MM-YYYY    | DD-MM-YYYY  | Education | IV/a     | Title   | Unit      | PNS               | Location          |

### Important Notes for Excel Upload:
1. **Format**: Supports .xlsx, .xls, and .csv files
2. **Header Rows**: DUK format includes 8 header rows (automatically skipped)
3. **Required Fields**: NIP, Name (Nama), and Position (Jabatan) are mandatory
4. **Date Format**: Use DD-MM-YYYY format (e.g., 03-04-1975)
5. **Status**: Automatically determined from NIP if not provided
6. **Duplicates**: NIP duplicates are updated instead of creating new records

## Role-Based Access Control

### Admin
- ✅ View all Tendik records
- ✅ Add new records
- ✅ Edit all records
- ✅ Delete records
- ✅ Upload Excel files
- ✅ View statistics

### PJ (Project Officer)
- ✅ View all Tendik records
- ✅ Add new records
- ✅ Edit records
- ✅ Upload Excel files
- ✅ View statistics
- ❌ Delete records (Admin only)

### Staff
- ✅ View Tendik records
- ✅ View statistics
- ❌ Add/Edit/Delete records

## Usage Guide

### Adding a Single Record

1. Click **"Tambah Data"** button
2. Fill in required fields:
   - NIP (unique identifier)
   - Full Name
   - Position
   - Status Kepegawaian (select from dropdown)
3. Fill in optional fields as needed
4. Click **"Simpan"** to save

### Bulk Upload

1. Click **"Upload Excel"** button
2. Click **"Download Template"** to get Excel template
3. Fill template with staff data
4. Click **"Upload File"** to select your file
5. Click **"Upload"** to import
6. Monitor progress and review statistics

### Searching & Filtering

1. Use **"Cari Nama atau NIP"** search box for quick lookup
2. Use **"Filter"** tab for advanced filtering:
   - Department: Filter by unit
   - Position: Filter by job title
   - Status Kepegawaian: Filter by employment type
3. Click **"Hapus Filter"** to reset all filters

### Editing Records

1. Click **"Edit"** (pencil icon) on the record row
2. Update fields in the dialog
3. Click **"Simpan"** to save changes

### Viewing Full Details

1. Click **"View"** (eye icon) to see complete record information
2. Displays all fields including history and metadata

### Deleting Records

1. Click **"Delete"** (trash icon)
2. Confirm deletion in popup
3. Record is permanently removed

## Features for Future Enhancement

- **Reports & Analytics**: Generate HR reports and statistics
- **Export Functions**: Export filtered data to Excel/PDF
- **Audit Trail**: Track all changes to records
- **Bulk Actions**: Select multiple records for batch operations
- **Photo Upload**: Upload and display staff photos
- **Custom Fields**: Add custom attributes per institution
- **Integration**: Connect with other HR systems
- **Mobile App**: Native mobile application
- **SMS/Email Notifications**: Automated alerts for key events
- **Document Management**: Attach files to records
- **Retirement Tracking**: Automated retirement planning
- **Performance Ratings**: Track and rate staff performance

## Security & Compliance

- **Row Level Security (RLS)**: Database-level access control
- **Password Hashing**: Bcrypt encryption for authentication
- **Session Management**: HTTP-only cookies for secure sessions
- **Input Validation**: All inputs validated before processing
- **Error Logging**: Comprehensive error tracking and logging
- **Audit Trail**: Track all administrative actions
- **GDPR Compliance**: Privacy controls for personal data

## Troubleshooting

### Upload Fails
- Ensure file format is .xlsx, .xls, or .csv
- Check that required fields (NIP, Name, Position) are filled
- Verify date format is DD-MM-YYYY

### Search Not Working
- Ensure search terms are typed correctly
- NIP search requires exact match format
- Name search uses partial matching (case-insensitive)

### Filters Not Applied
- Refresh page after changing filters
- Ensure at least one record matches filter criteria
- Check that filter values exist in database

## Contact & Support
For issues or feature requests, contact the System Administrator.
