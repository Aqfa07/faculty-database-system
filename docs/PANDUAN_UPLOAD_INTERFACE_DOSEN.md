# Panduan Upload Interface Data Dosen - Desain Baru

## Ringkasan Perubahan Interface

Tampilan antarmuka upload data dosen telah disederhanakan dan dioptimalkan untuk pengalaman pengguna yang lebih baik. Interface baru fokus pada kemudahan penggunaan, validasi data yang jelas, dan dukungan langsung untuk tipe identifikasi NIDK dan NIDN.

### Fitur Utama Interface Baru

#### 1. **Area Upload Kompak**
- **Ukuran**: Reduced dari 8 rem padding menjadi 4 rem (50% lebih kecil)
- **Interaktif**: Seluruh area dapat diklik untuk membuka file picker
- **Visual Feedback**: Hover effects dan drag-over states untuk better UX
- **Responsive**: Menyesuaikan dengan ukuran layar berbeda

```
┌─────────────────────────────────┐
│   📁 Tarik file atau klik      │
│   Format: .xlsx, .xls, atau .csv │
└─────────────────────────────────┘
```

#### 2. **Validasi Data Wajib (Info Box)**
Box ini menekankan field yang **HARUS** ada dalam file Excel:

- **Nama**: Kolom "Nama" harus ada di setiap baris (tidak boleh kosong)
- **NIDK/NIDN**: Nomor identifikasi wajib diisi untuk setiap data
- **Format File**: Pastikan struktur Excel benar tanpa baris header yang tercampur

**Warna Indikator**: Biru (Info) - Peringatan penting untuk keberhasilan import

#### 3. **Info Format File (Alert Box)**
Memberikan panduan praktis tentang format yang diterima:

```
Format File yang Benar:
- Kolom minimum: Nama, NIDK/NIDN
- Sistem otomatis mengenali: NIDN (biru), NIDK (hijau)
- Hapus baris header yang tidak perlu sebelum upload
```

**Warna Indikator**: Amber/Kuning - Tips dan best practices

#### 4. **Progress Indicator**
- **Subtle Progress Bar**: Thin (height: 4px) yang tidak mengganggu
- **Loading Text**: "Memproses file..." - informatif dan ringkas
- **Real-time Feedback**: Memberikan feedback kepada user bahwa proses sedang berlangsung

#### 5. **Result Status**
Hasil upload ditampilkan dengan jelas:

**Success Case** (semua berhasil):
```
✓ 250 data berhasil
```
Alert: Green (bg-green-50, border-green-200)

**Partial Success** (ada yang gagal):
```
✓ 240 data berhasil, 10 gagal
```
Alert: Amber (bg-amber-50, border-amber-200)

**Error Details**:
- Menampilkan 3 error pertama
- Menampilkan jumlah error total jika lebih dari 3
- Format: "Baris X: [detail error]"

---

## Perubahan Teknis

### 1. Simplifikasi Layout
**Sebelum**:
- 8 komponen Card/Alert terpisah
- Spacing 4 (1rem) antara setiap item
- Total height: ~600px

**Sesudah**:
- 3 Alert kompak dengan spacing 3 (0.75rem)
- Upload area: 4 rem padding (vs 8 rem sebelumnya)
- Total height: ~400px (33% lebih ringkas)

### 2. Kolom Informasi Terkonsolidasi

Sebelum, informasi terpisah dalam multiple cards:
```tsx
// BEFORE
<Card className="bg-blue-50 border-blue-200">
  <CardHeader><CardTitle>Format File</CardTitle></CardHeader>
  <CardContent>...</CardContent>
</Card>
```

Sesudah, menggunakan Alert kompakt:
```tsx
// AFTER
<Alert className="bg-blue-50 border-blue-200 p-3">
  <Info className="h-4 w-4 text-blue-600" />
  <AlertDescription className="text-xs text-blue-900 ml-2">
    ...
  </AlertDescription>
</Alert>
```

### 3. Support NIDK/NIDN yang Lebih Jelas

```
Kolom informasi menjelaskan:
"Sistem otomatis mengenali: NIDN (biru), NIDK (hijau)"
```

Ini menginformasikan user bahwa sistem:
- ✓ Otomatis mendeteksi tipe identifikasi
- ✓ Membedakan antara NIDN dan NIDK
- ✓ Tidak perlu menunjukkan tipe secara manual

---

## Panduan Pengguna

### Langkah 1: Persiapan File Excel
1. Buka file DUK Anda (NIDN atau NIDK)
2. Hapus baris header yang tidak perlu (biasanya baris 1-3 yang berisi judul)
3. Pastikan baris pertama data memiliki: **Nama** dan **NIDK/NIDN**
4. Hapus kolom kosong atau yang tidak relevan
5. Simpan sebagai format Excel (.xlsx) atau CSV (.csv)

### Langkah 2: Upload File
1. Klik area upload atau drag-drop file
2. Pilih file yang sudah disiapkan
3. Sistem akan memproses file (lihat progress bar)
4. Tunggu hasil upload

### Langkah 3: Review Hasil
- **Jika semua berhasil**: Klik "Selesai" untuk menutup dialog
- **Jika ada error**: 
  - Lihat daftar error yang ditampilkan
  - Identifikasi baris mana yang bermasalah
  - Perbaiki di file Excel
  - Upload ulang

---

## Troubleshooting Umum

### Error: "Format file harus Excel (.xlsx, .xls) atau CSV (.csv)"
**Penyebab**: File yang dipilih bukan format Excel/CSV
**Solusi**: 
- Gunakan File Explorer untuk cek ekstensi file
- Simpan file ulang dengan format .xlsx atau .csv

### Error: "Nama dan nomor identifikasi harus diisi"
**Penyebab**: Ada baris yang kosong di kolom Nama atau NIDK/NIDN
**Solusi**:
- Buka file Excel
- Hapus baris yang kosong
- Cek setiap baris memiliki Nama dan nomor identifikasi
- Upload ulang

### Error: "Nomor identifikasi hanya berisi non-numerik"
**Penyebab**: Kolom NIDK/NIDN mengandung karakter non-angka
**Solusi**:
- Cek format nomor di file Excel
- NIDK/NIDN harus berisi hanya angka
- Hapus spasi, dash, atau karakter lainnya
- Upload ulang

### Beberapa data berhasil, beberapa gagal
**Analisis**:
- Lihat error list untuk mengetahui baris mana yang gagal
- Perbaiki baris tersebut secara spesifik
- Upload file dengan baris yang sudah diperbaiki

---

## Best Practices

### 1. **Validasi Sebelum Upload**
```
Checklist sebelum upload:
☐ File dalam format .xlsx atau .csv
☐ Setiap baris memiliki Nama lengkap
☐ Setiap baris memiliki NIDK atau NIDN
☐ Tidak ada baris kosong atau header tercampur
☐ Tidak ada karakter spesial di kolom NIDK/NIDN
```

### 2. **Format Nama yang Benar**
Contoh nama yang benar:
```
dr. Najirman, SpPD-KR, FINASIM
dr. Rose Dinda Martini, SpPD-KGer
Prof. Dr. dr. Yevri Zulfiqar, SpB
```

Hindari:
- Nama kosong
- Karakter aneh (quotes ganda, tanda petik miring)
- Whitespace berlebihan

### 3. **Format Nomor Identifikasi yang Benar**
Contoh NIDK yang benar:
```
8885410016
4635745646230142
```

Contoh NIDN yang benar:
```
0012345678
0087654321
```

Hindari:
- Spasi di antara angka (8885 410 016)
- Dash atau karakter lainnya
- Karakter non-numerik

### 4. **Handling File DUK Besar**
Jika file DUK Anda sangat besar (>500 baris):
1. Split menjadi beberapa file (250 baris per file)
2. Upload secara terpisah
3. Monitor hasil setiap upload
4. Lebih mudah troubleshooting jika ada error

---

## Comparison: Interface Lama vs Baru

| Aspek | Lama | Baru |
|-------|------|------|
| Dialog Width | max-w-md | max-w-md (sama) |
| Upload Padding | p-8 | p-4 (50% lebih kecil) |
| Info Sections | 2 Card terpisah | 2 Alert kompak |
| Total Height | ~600px | ~400px |
| NIDK/NIDN Info | Implicit | Explicit di alert |
| Error Details | 5 errors shown | 3 errors + count |
| File Input | Hidden input | Clickable area |
| Drag-over feedback | Basic | Enhanced with hover |

---

## Frequently Asked Questions (FAQ)

### Q: Apakah sistem bisa membaca format NIDN dan NIDK secara otomatis?
**A**: Ya! Sistem otomatis mendeteksi kolom NIDN atau NIDK dan membedakannya dalam database. Anda tidak perlu menunjukkan tipe secara manual - cukup pastikan kolom ada.

### Q: Berapa baris maksimal yang bisa di-upload sekaligus?
**A**: Tidak ada batasan teknis, tapi disarankan upload maksimal 500-1000 baris per file untuk performa optimal. Jika lebih, split menjadi beberapa batch.

### Q: Bagaimana jika file memiliki baris header yang kompleks?
**A**: Sistem akan otomatis mendeteksi header row dengan mencari kata "Nama". Hapus baris-baris sebelum header dan mulai dari baris yang mengandung "Nama".

### Q: Apakah data duplikat akan ditolak?
**A**: Ya. Jika NIDK/NIDN sudah ada di database, sistem akan menolak duplikat. Cek error message untuk detail.

### Q: Dapatkah saya update data existing?
**A**: Untuk sekarang, sistem adalah insert-only. Untuk update, gunakan fitur Edit di halaman Data Dosen. Kami sedang mengembangkan bulk update feature.

### Q: Format apa saja yang didukung?
**A**: Excel (.xlsx, .xls) dan CSV (.csv). Gunakan .xlsx untuk hasil terbaik karena mempertahankan formatting.

---

## Technical Details

### Upload API Endpoint
```
POST /api/upload/dosen
Content-Type: multipart/form-data

Body:
- file: File (multipart)

Response:
{
  success: number,
  failed: number,
  errors: string[]
}
```

### Validation Logic
1. **Header Detection**: Mencari row dengan "Nama" keyword
2. **Column Mapping**: Multiple aliases untuk fleksibilitas
3. **Data Cleaning**: Remove quotes, trim whitespace
4. **Required Fields**: full_name dan identification_number wajib
5. **Error Reporting**: Detail error per baris

### Performance
- File size limit: ~50MB
- Processing: ~100-200 rows/second
- Memory: Streaming for large files

---

## Version History

### v2.0 (Current - 2025)
- Kompakkan UI hingga 33% lebih kecil
- Tambah Alert untuk NIDK/NIDN support
- Simplifikasi error display
- Improve drag-drop UX
- Add format requirement guidelines

### v1.0 (Previous)
- Initial version dengan separate Card components
- Basic validation error handling
- Manual NIDK/NIDN type selection

---

## Contact & Support

Jika mengalami masalah atau punya saran untuk improvement:
1. Check FAQ section di atas
2. Review panduan troubleshooting
3. Hubungi tim IT FK UNAND
4. Submit issue dengan screenshot error message
