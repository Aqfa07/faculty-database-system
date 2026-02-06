import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// Fungsi untuk cleaning string
function cleanString(val: any): string | null {
  if (!val) return null
  const str = String(val).trim()
  if (str === "-" || str === "" || str.toLowerCase() === "null") return null
  return str
}

// Fungsi untuk parse tanggal dari berbagai format
function parseDateString(dateVal: any): string | null {
  if (!dateVal) return null

  // Jika angka (Excel Serial Date)
  if (typeof dateVal === "number") {
    const date = new Date(Math.round((dateVal - 25569) * 86400 * 1000))
    return date.toISOString().split("T")[0]
  }

  // Jika string
  const strVal = String(dateVal).trim()

  // Format: YYYY-MM-DD (sudah benar)
  if (/^\d{4}-\d{2}-\d{2}$/.test(strVal)) {
    return strVal
  }

  // Format: DD/MM/YYYY atau DD-MM-YYYY
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(strVal)) {
    const parts = strVal.split(/[-/]/)
    const day = parts[0].padStart(2, "0")
    const month = parts[1].padStart(2, "0")
    const year = parts[2]
    return `${year}-${month}-${day}`
  }

  // Format: MM/DD/YYYY (USA format)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(strVal)) {
    const parts = strVal.split("/")
    const month = parseInt(parts[0])
    const day = parseInt(parts[1])
    // Coba deteksi: jika month > 12, asumsikan DD/MM/YYYY
    if (month > 12) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
    }
    // Jika month <= 12, asumsikan MM/DD/YYYY
    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      )
    }

    // Baca file Excel/CSV
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Baca sebagai array untuk deteksi header
    const rawData = (XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]) || []

    if (rawData.length === 0) {
      return NextResponse.json(
        { success: false, error: "File Excel kosong" },
        { status: 400 }
      )
    }

    // Deteksi baris header
    let headerRowIndex = -1
    let colMap: Record<string, number> = {}

    for (let i = 0; i < Math.min(rawData.length, 20); i++) {
      const headerRow = rawData[i]
      if (!headerRow || headerRow.length === 0) continue

      const headerLower = headerRow.map((h) => String(h).toLowerCase().trim())

      // Cari baris yang punya "nama" DAN ("nip" atau "nidn" atau "nidk")
      const hasNama = headerLower.some((h) => h.includes("nama"))
      const hasIdentification = headerLower.some(
        (h) => h === "nip" || h === "nidn" || h === "nidk"
      )

      if (hasNama && hasIdentification) {
        headerRowIndex = i

        // Map kolom
        headerLower.forEach((cell, idx) => {
          if (cell.includes("nama")) colMap["nama"] = idx
          else if (cell === "nip") colMap["nip"] = idx
          else if (cell === "nidn") colMap["nidn"] = idx
          else if (cell === "nidk") colMap["nidk"] = idx
          else if (cell === "nuptk") colMap["nuptk"] = idx
          else if (
            cell === "jenis kelamin" ||
            cell === "kelamin" ||
            cell === "l/p"
          )
            colMap["jenis_kelamin"] = idx
          else if (
            cell.includes("tempat lahir") ||
            cell === "tempat"
          )
            colMap["tempat_lahir"] = idx
          else if (
            cell.includes("tanggal lahir") ||
            cell === "tgl lahir"
          )
            colMap["tanggal_lahir"] = idx
          else if (cell.includes("email")) colMap["email"] = idx
          else if (
            cell.includes("telepon") ||
            cell.includes("hp") ||
            cell.includes("tlp")
          )
            colMap["telepon"] = idx
          else if (
            cell.includes("jabatan") ||
            cell === "fungsional"
          )
            colMap["jabatan"] = idx
          else if (
            cell.includes("pangkat") ||
            cell.includes("golongan") ||
            cell.includes("gol.")
          )
            colMap["pangkat_golongan"] = idx
          else if (
            cell.includes("departemen") ||
            cell.includes("prodi") ||
            cell.includes("program studi")
          )
            colMap["departemen"] = idx
          else if (
            cell.includes("unit") ||
            cell.includes("kerja")
          )
            colMap["unit_kerja"] = idx
        })

        break
      }
    }

    if (headerRowIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Header tidak ditemukan. Pastikan ada kolom "Nama" dan salah satu dari "NIP", "NIDN", atau "NIDK".',
        },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const errors: string[] = []
    let successCount = 0

    // Proses data baris per baris
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i]

      // Skip baris kosong
      if (!row || row.length === 0) continue

      const nama = cleanString(row[colMap["nama"]])
      if (!nama) continue // Skip jika tidak ada nama

      // Extract identifikasi
      const nip = cleanString(row[colMap["nip"]])
      const nidn = cleanString(row[colMap["nidn"]])
      const nidk = cleanString(row[colMap["nidk"]])
      const nuptk = cleanString(row[colMap["nuptk"]])

      // Tentukan jenis identifikasi yang digunakan
      let identification_type = ""
      let identification_number = ""

      if (nidn) {
        identification_type = "NIDN"
        identification_number = nidn
      } else if (nidk) {
        identification_type = "NIDK"
        identification_number = nidk
      } else if (nuptk) {
        identification_type = "NUPTK"
        identification_number = nuptk
      } else if (nip) {
        identification_type = "NIP"
        identification_number = nip
      }

      // Validasi
      if (!identification_number) {
        errors.push(
          `Baris ${i + 1}: "${nama}" - Nomor identifikasi (NIP/NIDN/NIDK/NUPTK) tidak ditemukan`
        )
        continue
      }

      // Bersihkan data
      const jenis_kelamin = cleanString(row[colMap["jenis_kelamin"]])
      const tempat_lahir = cleanString(row[colMap["tempat_lahir"]])
      const tanggal_lahir = parseDateString(row[colMap["tanggal_lahir"]])
      const email = cleanString(row[colMap["email"]])
      const telepon = cleanString(row[colMap["telepon"]])
      const jabatan = cleanString(row[colMap["jabatan"]])
      const pangkat_golongan = cleanString(row[colMap["pangkat_golongan"]])
      const departemen = cleanString(row[colMap["departemen"]])
      const unit_kerja = cleanString(row[colMap["unit_kerja"]])

      const dosenData = {
        nama_lengkap: nama,
        jenis_identifikasi: identification_type,
        nomor_identifikasi: identification_number,
        jenis_kelamin: jenis_kelamin,
        tempat_lahir: tempat_lahir,
        tanggal_lahir: tanggal_lahir,
        email: email,
        nomor_telepon: telepon,
        jabatan_fungsional: jabatan,
        pangkat_golongan: pangkat_golongan,
        departemen_prodi: departemen,
        unit_kerja: unit_kerja,
        adalah_aktif: true,
      }

      try {
        // Insert ke database
        const { data, error } = await supabase.from("dosen").insert([dosenData]).select()

        if (error) {
          errors.push(`Baris ${i + 1}: "${nama}" - ${error.message}`)
        } else {
          successCount++
        }
      } catch (err) {
        errors.push(
          `Baris ${i + 1}: "${nama}" - ${err instanceof Error ? err.message : "Kesalahan tidak diketahui"}`
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `Upload selesai: ${successCount} berhasil${errors.length > 0 ? `, ${errors.length} gagal` : ""}`,
      success_count: successCount,
      error_count: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error("[v0] Upload dosen error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Kesalahan upload: ${error.message || "Terjadi kesalahan"}`,
      },
      { status: 500 }
    )
  }
}
