# Sistem Manajemen Data Tendik dan Dosen - Dokumentasi Lengkap

## Ringkasan Sistem

Sistem FK UNAND telah diupgrade dengan modul manajemen data yang komprehensif untuk mengelola data Tenaga Kependidikan (Tendik) dan Dosen dengan dukungan penuh untuk identifikasi ganda (NIDN/NIDK).

## Fitur Utama

### 1. Data Tendik (Tenaga Kependidikan)

#### Kolom Data
- **NIP**: Nomor Induk Pegawai
- **Nama Lengkap**: Identitas pribadi
- **Jenis Kelamin**: L/P
- **Tempat/Tanggal Lahir**: Data biografis
- **Email & Telepon**: Kontak
- **Jabatan**: Posisi kerja
- **Status Kepegawaian**: PNS, PTT, PHL, atau Kontrak
- **Penempatan Saat Ini**: Lokasi kerja terkini
- **Departemen/Unit**: Unit organisasi
- **Golongan**: Kepangkatan
- **Pendidikan**: Kualifikasi dan bidang
- **Tahun Layanan**: Masa kerja
- **Data Pensiun**: Tanggal pensiun

#### Fitur
✅ CRUD penuh (Create, Read, Update, Delete)
✅ Pencarian berdasarkan NIP dan nama
✅ Filter berdasarkan departemen, posisi, dan status kepegawaian
✅ Upload massal via Excel dengan error handling
✅ Status aktif/non-aktif
✅ Indikator visual dengan color-coded badges
✅ Template Excel download untuk standarisasi data

#### Endpoint API Tendik
- `GET /api/tendik` - Ambil daftar tendik dengan filter
- `POST /api/tendik` - Tambah tendik baru
- `PUT /api/tendik/[id]` - Edit tendik
- `DELETE /api/tendik/[id]` - Hapus tendik
- `GET /api/tendik/stats` - Statistik tendik
- `POST /api/upload/tendik` - Upload file Excel
- `GET /api/templates/tendik` - Download template

### 2. Data Dosen dengan Identifikasi Ganda

#### Sistem Identifikasi
Dosen dapat diidentifikasi dengan tiga tipe:

1. **NIDN** (Nomor Identitas Dosen Nasional)
   - Untuk dosen tetap dan biasa
   - Format: 16 digit
   - Badge: Biru

2. **NIDK** (Nomor Identitas Dosen Khusus)
   - Untuk dosen khusus/luar biasa
   - Format: 16 digit
   - Badge: Hijau

3. **NUPTK** (Nomor Unik Pendidik dan Tenaga Kependidikan)
   - Untuk pendidik lainnya
   - Badge: Abu-abu

#### Kolom Data Dosen
- **Nama Lengkap**: Identitas
- **Jenis Identifikasi**: NIDN, NIDK, atau NUPTK
- **Nomor Identifikasi**: Nomor unik berdasarkan jenis
- **Email**: Kontak akademik
- **Telepon**: Nomor kontak
- **Departemen**: Unit akademik
- **Jabatan Akademik**: Prof, Dr., Ir., etc.
- **Posisi Fakultas**: Ketua Departemen, dll
- **Kualifikasi**: S1, S2, S3
- **Spesialisasi**: Bidang keahlian
- **Status**: Aktif/Non-Aktif

#### Fitur
✅ Dukungan NIDN/NIDK dengan diferensiasi otomatis
✅ CRUD penuh dengan validasi identifikasi
✅ Pencarian berdasarkan nama dan nomor identifikasi
✅ Filter berdasarkan departemen, status, dan jenis identifikasi
✅ Upload massal dengan pengenalan otomatis NIDN/NIDK
✅ Statistik terpisah untuk NIDN dan NIDK
✅ Color-coded badges untuk visual identification
✅ Template Excel dengan kolom NIDN/NIDK

#### Endpoint API Dosen
- `GET /api/dosen` - Ambil daftar dosen dengan filter
- `POST /api/dosen` - Tambah dosen baru
- `PUT /api/dosen/[id]` - Edit dosen
- `DELETE /api/dosen/[id]` - Hapus dosen
- `GET /api/dosen/stats` - Statistik dosen (total, aktif, NIDN, NIDK)
- `POST /api/upload/dosen` - Upload file Excel
- `GET /api/templates/dosen` - Download template

### 3. Format Upload Excel

#### Untuk Tendik
```
NIP | Nama | Email | Telepon | Jabatan | Status Kepegawaian | Penempatan | Departemen | Golongan
```

#### Untuk Dosen
```
Nama | NIDN/NIDK | Email | Telepon | Departemen | Jabatan Akademik | Posisi Fakultas | Kualifikasi | Spesialisasi
```

Sistem akan otomatis mengenali NIDN vs NIDK berdasarkan kolom yang terisi.

## Antarmuka Pengguna

### Dashboard Tendik
- Header dengan statistik real-time
- Tiga tab: Daftar Data, Filter Lanjutan, Upload
- Tabel responsif dengan action buttons
- Dialog CRUD yang terorganisir
- Status badge color-coded

### Dashboard Dosen
- Header dengan statistik NIDN/NIDK terpisah
- Three-tab interface untuk manajemen data
- Advanced filtering dengan jenis identifikasi
- Detail view dengan informasi akademik lengkap
- Upload dialog untuk bulk import

### Menu Navigasi
```
Dashboard
├── Capaian Kinerja (Performance)
├── Data Dosen (Baru - /dashboard/dosen)
├── Data Tendik (/dashboard/tendik)
├── Upload Data (/dashboard/upload)
├── Manajemen User (Admin)
├── Log Aktivitas (Admin)
└── Pengaturan (Admin)
```

## Security & Access Control

- **Role-based Access**: Admin, PJ, Staff
- **Row Level Security**: Diaktifkan pada semua tabel
- **Data Validation**: Client-side dan server-side
- **SQL Injection Prevention**: Parameterized queries
- **Session Management**: HTTP-only cookies

## Database Schema

### Tabel tendik_members
- id (UUID)
- nip (UNIQUE)
- full_name
- gender
- place_of_birth
- date_of_birth
- email, phone
- position
- department
- rank_golongan
- status_kepegawaian (PNS, PTT, PHL, Kontrak)
- penempatan_saat_ini
- education_level, education_field
- years_of_service
- is_active (boolean)
- Timestamps dan audit fields

### Tabel dosen_members
- id (UUID)
- full_name
- identification_type (NIDN, NIDK, NUPTK)
- identification_number (UNIQUE per type)
- email, phone
- department
- faculty_position
- academic_rank
- qualification
- specialization
- is_active (boolean)
- Timestamps dan audit fields

## Panduan Penggunaan

### Menambah Data Tendik
1. Klik "Tambah Data" di dashboard Tendik
2. Isi form dengan data wajib: NIP, Nama, Jabatan
3. Pilih Status Kepegawaian (PNS/PTT/PHL/Kontrak)
4. Isi Penempatan Saat Ini (lokasi kerja)
5. Isi kolom opsional sesuai kebutuhan
6. Klik Simpan

### Menambah Data Dosen
1. Klik "Tambah Data" di dashboard Dosen
2. Isi Nama Lengkap
3. Pilih Jenis Identifikasi (NIDN/NIDK/NUPTK)
4. Isi Nomor Identifikasi
5. Isi informasi akademik (departemen, jabatan, dll)
6. Klik Simpan

### Upload Massal dari Excel
1. Klik "Upload Excel" di dashboard yang relevan
2. Download template untuk format standar
3. Isi data di Excel menggunakan template
4. Drag-drop file atau klik "Pilih File"
5. Sistem akan menampilkan hasil: success/failed
6. Review error jika ada dan perbaiki data

### Menggunakan Filter
1. Buka tab "Filter"
2. Gunakan search, departemen, status, atau jenis identifikasi
3. Tekan Enter atau klik tombol search
4. Hasil otomatis diperbarui
5. Klik "Hapus Semua Filter" untuk reset

## Perbaikan yang Dilakukan

### Dari Versi Sebelumnya
✅ Removed "Unit Kerja Saat Ini" field (redundant dengan Penempatan)
✅ Consolidated placement information untuk clarity
✅ Enhanced form organization dengan card sections
✅ Added comprehensive Dosen module dengan NIDN/NIDK support
✅ Improved Excel upload dengan error handling
✅ Better filter UI dengan clear options
✅ Enhanced statistics dengan identification type breakdown

## Troubleshooting

### Upload File Gagal
- Pastikan format Excel/CSV valid
- Periksa kolom header sesuai template
- Lihat error messages untuk baris yang gagal
- Pastikan data wajib (Nama, Identifikasi) terisi

### Filter Tidak Menampilkan Data
- Reset filter dengan "Hapus Semua Filter"
- Periksa ejaan departemen/status
- Verifikasi data ada di sistem

### NIDN/NIDK Tidak Terkenali
- Pastikan kolom NIDN atau NIDK ada di Excel
- Periksa format nomor identifikasi
- Gunakan template sebagai reference

## Pengembangan Masa Depan

- [ ] Advanced reporting dan analytics
- [ ] Export data ke berbagai format
- [ ] Scheduling untuk automated uploads
- [ ] Batch operations untuk multiple records
- [ ] Integration dengan sistem HR eksternal
- [ ] Photo/document storage untuk dosen
- [ ] Career progression tracking
- [ ] Performance metrics integration

## Support & Documentation

Untuk bantuan lebih lanjut:
- Hubungi admin sistem
- Check module documentation di `/docs`
- Review API endpoints di `/app/api`
- Lihat component examples di `/components`
