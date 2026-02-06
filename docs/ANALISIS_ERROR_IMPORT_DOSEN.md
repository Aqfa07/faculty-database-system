# Analisis Mendalam: Error "Nama dan Nomor Identifikasi Wajib Diisi" pada Import Data Dosen

## Ringkasan Masalah
Saat melakukan upload file Excel data Dosen, sistem menampilkan error "Nama dan nomor identifikasi wajib diisi" pada banyak baris, meskipun data seharusnya sudah lengkap. Error ini menunjukkan bahwa validasi backend tidak dapat mengenali kolom-kolom yang diperlukan dengan benar.

---

## Analisis Penyebab Utama

### 1. **Ketidakcocokan Nama Kolom (Column Name Mismatch)**

#### Deskripsi Masalah
File CSV/Excel yang diterima memiliki struktur data yang sangat berbeda dari yang diharapkan oleh sistem:

**Struktur File yang Diterima:**
```
No | Nama | L/P | NIP | NUPTK | NIDN | Tempat Lahir | TANGGAL LAHIR | ...
```

**Struktur yang Diharapkan Sistem (di upload API):**
```
Nama | NIDN | NIDK | Email | Telepon | Departemen | Jabatan Akademik | ...
```

#### Root Cause
Sistem menggunakan `sheet_to_json()` dari library XLSX yang secara otomatis menggunakan **baris pertama sebagai header nama kolom**. Namun, file DUK (Daftar Urut Kepangkatan) memiliki struktur kompleks:

- **Baris 1-5**: Judul dan header informasi (bukan data)
- **Baris 6-7**: Header kolom yang sesungguhnya (terpisah di dua baris)
- **Baris 8+**: Data aktual

#### Contoh Masalah
```javascript
// Yang terjadi saat parsing:
const row = {
  "No": 1,
  "Nama": "Prof. dr. Nur Indrawaty Lipoeto, M.Sc, Ph.D, Sp.GK(K)",
  "L/P": "P",
  "NIP": "196305071990012001",
  "NUPTK": "2839741642230102",
  "NIDN": "0007056304",
  // ... kolom lainnya
}

// Yang dicari sistem:
const identification_number = row["NIDN"] || row["NIDK"] || row["Nomor Identifikasi"] || ""
// ✓ Ditemukan: "0007056304"

const full_name = row["Nama"]
// ✓ Ditemukan: "Prof. dr. Nur Indrawaty Lipoeto, M.Sc, Ph.D, Sp.GK(K)"
```

**Namun, beberapa baris memiliki struktur yang rusak:**
- Baris dengan NUPTK yang split di banyak kolom
- Baris dengan nilai yang tersebar tidak sesuai urutan kolom
- Baris dengan data kosong atau tidak lengkap

### 2. **Format File yang Kompleks**

File DUK memiliki beberapa karakteristik yang membuat parsing sulit:

**a) Header Multi-Baris**
```
Baris 6: No | Nama | L/P | NIP | NUPTK | NIDN | TANGGAL LAHIR | ...
Baris 7:    |      |     |     |       | Tempat Lahir | TMT CPNS | ...
```

**b) Kolom yang Menggabung Data**
- Kolom "TANGGAL LAHIR" berisi dua informasi:
  - Tempat lahir (pada baris header 1)
  - Tanggal lahir (pada baris data)

**c) Data yang Tidak Konsisten**
- Beberapa baris memiliki NIDN kosong, tetapi memiliki NUPTK
- Beberapa baris memiliki karakter khusus atau format tanggal yang berbeda
- Ada baris dengan nilai "-" atau kosong di kolom identifikasi

### 3. **Validasi yang Terlalu Ketat**

Kode validasi backend:
```javascript
if (!row["Nama"] || !identification_number) {
  results.errors.push(`Baris ${i + 2}: Nama dan nomor identifikasi wajib diisi`)
  results.failed++
  continue
}
```

**Masalah:**
- Tidak memberikan toleransi untuk variasi format file
- Tidak ada sanitasi/pembersihan data sebelum validasi
- Tidak ada mekanisme untuk mencoba berbagai nama kolom

---

## Solusi Lengkap

### **Solusi 1: Perbaikan Data Source (Rekomendasi Utama)**

#### Langkah-langkah:
1. **Bersihkan file CSV/Excel sebelum upload**
   - Hapus baris header tambahan (baris 1-5)
   - Gabungkan header dua baris menjadi satu (atau pilih header yang relevan)
   - Pastikan kolom NIDN dan NIDK sesuai dengan data aktual

2. **Format Standar untuk Upload**
   ```
   Nama | NIDN | NIDK | Email | Telepon | Departemen | Jabatan Akademik
   ```

3. **Validasi Data Manual**
   - Periksa setiap baris memiliki minimal: Nama dan (NIDN atau NIDK)
   - Pastikan tidak ada baris header tersembunyi di tengah data

#### Tools yang Bisa Digunakan:
- **Excel:** Filter & Sort, Remove Duplicates, Text to Columns
- **Google Sheets:** Format Painter, Conditional Formatting
- **Python/PowerShell:** Script otomatis untuk pembersihan

**Contoh Script Python:**
```python
import pandas as pd

# Baca file skip header yang tidak perlu
df = pd.read_excel('DUK_NIDN.xlsx', skiprows=6)

# Bersihkan kolom kosong
df = df.dropna(how='all')

# Validasi data sebelum export
df = df[df['Nama'].notna() & (df['NIDN'].notna() | df['NIDK'].notna())]

# Simpan ke CSV
df.to_csv('DUK_NIDN_CLEAN.csv', index=False)
```

---

### **Solusi 2: Perbaikan Sistem Import (Backend Enhancement)**

Update API endpoint untuk menangani file dengan format kompleks:

#### File yang Perlu Diubah: `/app/api/upload/dosen/route.ts`

**Perubahan Kunci:**
1. Deteksi baris header otomatis
2. Implementasi flexible column mapping
3. Data cleaning dan sanitasi
4. Better error reporting

```typescript
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    
    // PERBAIKAN 1: Cari baris header yang valid (skip header palsu)
    const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]
    let headerRowIndex = 0
    
    for (let i = 0; i < Math.min(allRows.length, 10); i++) {
      const row = allRows[i]
      // Cari baris yang mengandung "Nama" sebagai indikasi header
      if (row.some((cell: any) => 
        typeof cell === 'string' && 
        cell.toLowerCase().includes('nama')
      )) {
        headerRowIndex = i
        break
      }
    }

    // Parse ulang dengan header yang benar
    const dataRows = XLSX.utils.sheet_to_json(worksheet, {
      range: headerRowIndex
    }) as any[]

    const supabase = createAdminClient()
    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      try {
        // PERBAIKAN 2: Flexible column mapping dengan multiple name variations
        const columnMappings = {
          nama: ['Nama', 'NAMA', 'nama', 'Full Name'],
          nidn: ['NIDN', 'Nomor NIDN', 'nidn'],
          nidk: ['NIDK', 'Nomor NIDK', 'nidk'],
          nuptk: ['NUPTK', 'Nomor NUPTK', 'nuptk'],
          email: ['Email', 'EMAIL', 'email', 'E-mail'],
          phone: ['Telepon', 'Telp', 'Phone', 'No. Telepon'],
          department: ['Departemen', 'Dept', 'Department', 'Unit Kerja'],
          rank: ['Jabatan Akademik', 'Rank', 'Pangkat'],
          position: ['Posisi', 'Position', 'Jabatan']
        }

        // Fungsi helper untuk mencari nilai dari berbagai nama kolom
        const getValue = (mappings: string[]) => {
          for (const key of mappings) {
            if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
              return String(row[key]).trim()
            }
          }
          return null
        }

        // PERBAIKAN 3: Ekstraksi data dengan mapping yang fleksibel
        const full_name = getValue(columnMappings.nama)
        const nidn = getValue(columnMappings.nidn)
        const nidk = getValue(columnMappings.nidk)
        const nuptk = getValue(columnMappings.nuptk)
        
        const identification_number = nidn || nidk || nuptk || ""
        const identification_type = nidn ? "NIDN" : nidk ? "NIDK" : "NUPTK"

        // PERBAIKAN 4: Validasi dengan error yang lebih deskriptif
        const errors = []
        if (!full_name) errors.push("Kolom 'Nama' kosong")
        if (!identification_number) errors.push("Kolom 'NIDN', 'NIDK', atau 'NUPTK' kosong")

        if (errors.length > 0) {
          results.errors.push(`Baris ${i + 2}: ${errors.join(', ')}`)
          results.failed++
          continue
        }

        // PERBAIKAN 5: Data cleaning
        const cleanedData = {
          full_name: full_name.replace(/[\"\']/g, ''), // Hapus quote berlebih
          identification_type,
          identification_number: identification_number.replace(/[^0-9]/g, ''), // Hanya angka
          email: getValue(columnMappings.email) || null,
          phone: getValue(columnMappings.phone) || null,
          department: getValue(columnMappings.department) || null,
          academic_rank: getValue(columnMappings.rank) || null,
          faculty_position: getValue(columnMappings.position) || null,
          is_active: true,
        }

        const { error } = await supabase.from("dosen_members").insert([cleanedData])

        if (error) {
          results.errors.push(`Baris ${i + 2}: ${error.message}`)
          results.failed++
        } else {
          results.success++
        }
      } catch (error) {
        results.errors.push(
          `Baris ${i + 2}: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
        )
        results.failed++
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Dosen upload error:", error)
    return NextResponse.json(
      { message: "Gagal upload file" },
      { status: 500 }
    )
  }
}
```

---

### **Solusi 3: Template dan Dokumentasi (User Guidance)**

Buat template Excel standar dengan instruksi jelas:

1. **Template File:** `/public/templates/Dosen_Template.xlsx`
   - Satu baris header dengan nama kolom standar
   - 2-3 baris contoh data
   - Instruksi validasi di sheet terpisah

2. **Panduan Upload:**
   ```markdown
   ## Persyaratan File Upload Data Dosen

   ### Format Kolom yang Diterima:
   - **Nama** (wajib) - Nama lengkap dosen
   - **NIDN** (opsional) - Nomor identitas dosen nasional
   - **NIDK** (opsional) - Nomor identitas dosen khusus
   - **NUPTK** (opsional) - Nomor unik pendidik dan tenaga kependidikan
   - **Email** (opsional)
   - **Telepon** (opsional)
   - **Departemen** (opsional)
   - **Jabatan Akademik** (opsional)

   ### Checklist Sebelum Upload:
   - [ ] Hapus baris header tambahan (baris judul)
   - [ ] Pastikan baris pertama adalah nama kolom
   - [ ] Setiap baris minimal memiliki Nama + salah satu ID (NIDN/NIDK/NUPTK)
   - [ ] Tidak ada baris kosong atau header tersembunyi
   - [ ] Format file adalah .xlsx, .xls, atau .csv
   - [ ] File tidak lebih dari 10MB
   ```

---

## Langkah-Langkah Implementasi Perbaikan

### **Fase 1: Perbaikan Immediate (Data Cleaning)**
1. Download file DUK yang bermasalah
2. Buka dengan Excel/LibreOffice
3. Hapus baris 1-5 (judul)
4. Rename kolom agar sesuai standar sistem
5. Hapus baris kosong
6. Export sebagai CSV atau XLSX bersih
7. Upload kembali

### **Fase 2: Enhancement Backend (1-2 hari)**
1. Update `/app/api/upload/dosen/route.ts` dengan logic yang lebih robust
2. Test dengan berbagai format file
3. Deploy dan dokumentasi

### **Fase 3: User Guidance (Dokumentasi)**
1. Buat template standard
2. Update panduan upload
3. Training untuk admin

---

## Testing & Validasi

### Test Cases:
1. ✓ File dengan header baris tunggal
2. ✓ File dengan header multi-baris
3. ✓ File dengan kolom tambahan
4. ✓ File dengan data incomplete
5. ✓ File dengan spasi extra atau special characters
6. ✓ File dengan NIDN hanya
7. ✓ File dengan NIDK hanya
8. ✓ File dengan NUPTK hanya

### Hasil yang Diharapkan:
- Semua data valid terupload dengan sukses
- Error messages jelas dan actionable
- Summary report menunjukkan success/failed count

---

## Kesimpulan

Error "Nama dan nomor identifikasi wajib diisi" terjadi karena **ketidakcocokan antara struktur file sumber dan ekspektasi sistem**. 

**Solusi terbaik adalah kombinasi:**
1. **Data Cleaning** di sumber (prioritas tinggi)
2. **Backend Enhancement** untuk lebih fleksibel (medium priority)
3. **User Guidance** yang lebih baik (high priority)

Dengan implementasi ini, sistem akan lebih robust dan dapat menangani variasi format file sambil memberikan feedback yang jelas kepada user tentang data yang bermasalah.
