# Panduan Lengkap: Cara Benar Upload Data Dosen

## Daftar Isi
1. [Persyaratan File](#persyaratan-file)
2. [Format Kolom yang Diterima](#format-kolom-yang-diterima)
3. [Persiapan Data](#persiapan-data)
4. [Proses Upload](#proses-upload)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Persyaratan File

### Format File yang Diterima
- ✓ **Microsoft Excel** (.xlsx, .xls)
- ✓ **CSV** (.csv, tab-delimited)
- ✓ **Google Sheets** (export as XLSX atau CSV)

### Ukuran File
- Maksimal: **10 MB**
- Rekomendasi: < 5 MB

### Encoding
- UTF-8 (untuk CSV)
- Standard Excel (untuk XLSX)

---

## Format Kolom yang Diterima

### Kolom Wajib (Required)
| Nama Kolom | Alias yang Diterima | Contoh Data | Keterangan |
|---|---|---|---|
| **Nama** | Nama Dosen, NAMA, nama | Prof. Dr. Budi, S.Ked, M.Si | Nama lengkap dosen dengan gelar |

### Kolom Identifikasi (Minimal 1 dari 3)
| Nama Kolom | Alias yang Diterima | Contoh Data | Format |
|---|---|---|---|
| **NIDN** | Nomor NIDN, nidn | 0123456789 | 10 digit numerik |
| **NIDK** | Nomor NIDK, nidk | 0987654321 | 10 digit numerik |
| **NUPTK** | Nomor NUPTK, nuptk | 1234567890123456 | 16 digit numerik |

### Kolom Opsional
| Nama Kolom | Alias yang Diterima | Format |
|---|---|---|
| Email | Email, EMAIL, email | user@example.com |
| Telepon | Telp, Phone, No. Telepon, HP | 08123456789 |
| Departemen | Dept, Department, Unit Kerja | Ilmu Gizi, IKM-KK |
| Jabatan Akademik | Rank, Pangkat, Akademik Rank | Guru Besar, Lektor, Asisten Ahli |
| Posisi | Position, Posisi Fakultas | Ketua Prodi, Koordinator |

---

## Persiapan Data

### Langkah-Langkah Persiapan

#### 1. **Jika Menggunakan File DUK (Daftar Urut Kepangkatan)**

File DUK biasanya memiliki format kompleks dengan banyak baris header. Ikuti langkah-langkah berikut:

**a. Buka file dengan Excel:**
```
1. File → Open → Pilih file DUK
2. Lihat struktur file yang memiliki:
   - Baris 1-5: Judul dan informasi
   - Baris 6-7: Header kolom (mungkin split di 2 baris)
   - Baris 8+: Data aktual
```

**b. Bersihkan file:**
```
1. Hapus Baris 1-5 (judul halaman)
   - Select rows 1-5 → Right-click → Delete Rows
   
2. Jika header tersebar di 2 baris:
   - Gabungkan menjadi 1 baris header
   - Atau pilih header yang paling lengkap
   
3. Simpan sebagai XLSX baru dengan nama yang jelas
   - File → Save As → Format: Excel Workbook (.xlsx)
   - Nama: "Dosen_Jan2026_Clean.xlsx"
```

#### 2. **Cek Data di Setiap Baris**

Gunakan Conditional Formatting untuk menemukan data kosong:

```excel
Home → Conditional Formatting → Highlight Cell Rules → Blanks
```

Atau filter manual:
```excel
Data → AutoFilter → Cek kolom Nama dan NIDN/NIDK
```

#### 3. **Validasi Data**

**Pastikan:**
- ✓ Setiap baris punya Nama
- ✓ Setiap baris punya minimal 1: NIDN, NIDK, atau NUPTK
- ✓ Nomor identifikasi tidak kosong atau berisi hanya karakter "-"
- ✓ Tidak ada baris kosong di tengah data
- ✓ Tidak ada header tambahan tersembunyi

**Contoh Validasi dengan Excel:**
```excel
Buat kolom helper di kolom Z:
=IF(AND(NOT(ISBLANK(A2)), OR(NOT(ISBLANK(C2)), NOT(ISBLANK(D2)), NOT(ISBLANK(E2)))), "OK", "ERROR")

Copy formula ke semua baris, filter untuk "ERROR" untuk melihat data yang bermasalah
```

#### 4. **Format dan Pembersihan**

**Hapus spasi berlebih:**
```excel
Home → Find & Replace → Find: "  " (2+ spasi) → Replace: " " (1 spasi)
```

**Format Konsisten untuk Nomor:**
```excel
Select kolom NIDN → Format Cells → Number → Decimal Places: 0
```

---

## Proses Upload

### 1. **Navigasi ke Menu Data Dosen**
```
Menu Sidebar → Data Dosen → Tab "Daftar Data" atau "Upload"
```

### 2. **Klik Tombol "Upload Excel"**
- Akan membuka dialog upload dengan dua pilihan:
  - Drag & drop file ke area yang tersedia
  - Klik "Pilih File" untuk browse

### 3. **Pilih File**
- Pilih file yang sudah disiapkan
- Sistem akan mulai proses upload otomatis

### 4. **Tunggu Hasil**
Sistem akan menampilkan:
```
Upload Progress: [████████░] 80%

Hasil Upload:
✓ Berhasil: 48 data
✗ Gagal: 2 data

Errors:
- Baris 25: Nama dosen tidak ditemukan
- Baris 30: Nomor identifikasi (NIDN/NIDK/NUPTK) tidak ditemukan
```

### 5. **Review Hasil**
- **Jika semua sukses:** Klik "Selesai", data sudah tersimpan
- **Jika ada yang gagal:** 
  - Catat baris yang error
  - Buka file original
  - Perbaiki data di baris tersebut
  - Upload ulang (sistem akan skip data duplikat)

---

## Troubleshooting

### Error: "File tidak ditemukan"
**Penyebab:** File tidak dipilih sebelum upload

**Solusi:**
1. Pastikan file sudah dipilih
2. Coba drag & drop file ke area upload
3. Jika masih gagal, refresh halaman dan coba lagi

---

### Error: "Nama dosen tidak ditemukan"
**Penyebab:** 
- Kolom nama kosong pada baris tersebut
- Nama kolom tidak sesuai ekspektasi (bukan "Nama")

**Solusi:**
1. Cek file Excel, lihat baris yang error
2. Pastikan ada data di kolom "Nama" pada baris tersebut
3. Jika kolom bernama lain (contoh: "Full Name"), rename menjadi "Nama"
4. Upload ulang

**Debug:**
```
Baris yang error → Periksa kolom A (biasanya berisi Nama)
Jika kolom A kosong atau berisi data lain → Itu adalah masalahnya
```

---

### Error: "Nomor identifikasi (NIDN/NIDK/NUPTK) tidak ditemukan"
**Penyebab:**
- Ketiga kolom (NIDN, NIDK, NUPTK) kosong pada baris tersebut
- Nomor identifikasi hanya berisi karakter "-" atau tanda khusus

**Solusi:**
1. Buka file Excel
2. Lihat baris yang error
3. Periksa kolom NIDN, NIDK, dan NUPTK
4. Pastikan minimal 1 kolom memiliki angka
5. Jika hanya berisi "-", hapus atau isi dengan nomor yang sesuai
6. Upload ulang

**Contoh Data Tidak Valid:**
```
Nama: Prof. Dr. Budi
NIDN: -
NIDK: -
NUPTK: -
❌ INVALID (semua kosong atau hanya "-")
```

**Contoh Data Valid:**
```
Nama: Prof. Dr. Budi
NIDN: 0123456789
NIDK: -
NUPTK: -
✓ VALID (ada minimal 1 nomor ID)
```

---

### Error: "Gagal upload file"
**Penyebab:**
- Format file tidak sesuai
- File rusak atau corrupt
- Encoding file tidak didukung

**Solusi:**
1. Pastikan file adalah Excel (.xlsx/.xls) atau CSV
2. Coba buka file di Excel, periksa apakah bisa dibuka normal
3. Jika ada pesan error di Excel → File rusak, ambil backup versi lama
4. Jika tidak ada backup, buat ulang file dari sumber data
5. Pastikan encoding CSV adalah UTF-8 (jika menggunakan CSV)

---

### Warning: "Nomor identifikasi hanya berisi non-numerik"
**Penyebab:**
- Nomor identifikasi mengandung karakter bukan angka (spasi, tanda baca, dll)

**Solusi:**
1. Data masih bisa terupload (warning, bukan error)
2. Untuk hasil yang lebih baik, bersihkan nomor:
   - Hapus semua karakter non-numerik
   - Gunakan Find & Replace: Cari `[^\d]`, Replace dengan kosong
3. Upload ulang

---

## FAQ

### **Q: Apakah sistem bisa mengimport dari Google Sheets?**
**A:** Ya, caranya:
1. Buka Google Sheets
2. File → Download → CSV atau Excel
3. Upload file yang sudah didownload

---

### **Q: Bagaimana jika ada data duplikat?**
**A:** 
- Sistem akan mendeteksi duplikat berdasarkan kombinasi (Nama + Nomor Identifikasi)
- Jika ada duplikat, baris akan gagal upload dengan error dari database
- Untuk update data lama, gunakan fitur "Edit" di menu, jangan upload ulang

---

### **Q: Bisa tidak upload nama kolom yang berbeda?**
**A:** Ya, sistem mendukung alias kolom. Contoh kolom yang diterima:
- "Nama" atau "NAMA" atau "Nama Dosen"
- "NIDN" atau "Nomor NIDN"
- "Telepon" atau "Telp" atau "No. Telepon"

---

### **Q: Gimana kalau file terlalu besar?**
**A:** 
- Limit file: 10 MB
- Jika lebih besar, split file menjadi beberapa bagian
- Upload satu per satu

---

### **Q: Apakah data bisa rollback jika upload salah?**
**A:** 
- Belum ada fitur auto-rollback
- Untuk itu, hubungi admin untuk menghapus data yang salah upload

---

### **Q: File saya punya 200+ baris, apakah bisa sekaligus?**
**A:** Ya, sistem bisa upload ribuan baris. Tips:
- Upload dalam batch 500-1000 baris jika file sangat besar
- Monitor progress upload
- Jika ada error, catat nomor baris, perbaiki di file asli, upload ulang

---

## Template Download

Untuk memudahkan, download template standar dari sistem:

**Langkah:**
1. Menu Data Dosen → Klik "Download Template"
2. File "Dosen_Template.xlsx" akan didownload
3. Gunakan sebagai acuan struktur file
4. Isi data Anda di template ini
5. Upload hasil pengisian

---

## Checklist Akhir Sebelum Upload

Sebelum upload, pastikan:

- [ ] File berformat Excel (.xlsx/.xls) atau CSV (.csv)
- [ ] File sudah dibersihkan dari baris header palsu
- [ ] Baris pertama adalah header dengan nama kolom
- [ ] Setiap data punya minimal: Nama + (NIDN atau NIDK atau NUPTK)
- [ ] Tidak ada baris kosong di tengah data
- [ ] Tidak ada file duplikat di sistem (cek di menu "Data Dosen" terlebih dahulu)
- [ ] File size < 10 MB
- [ ] Nama kolom sesuai standar atau menggunakan alias yang diterima

**Jika semua checklist sudah OK → Silakan upload!**

---

## Hubungi Admin Jika...

- Data masih tidak bisa terupload setelah semua langkah di atas
- Perlu bantuan membersihkan file
- Perlu rollback data yang salah upload
- Ada pertanyaan tentang validasi data khusus

Email: admin@fkunand.ac.id  
Telepon: (0751) xxxx-xxxx
