import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// Helper untuk membersihkan string
const cleanString = (val: any) => {
  if (!val) return null
  const str = String(val).trim()
  if (str === "-" || str === "" || str.toLowerCase() === "null") return null
  return str
}

// Helper untuk parsing tanggal Excel (Serial Number) atau String
const parseExcelDate = (dateVal: any) => {
  if (!dateVal) return null

  // Jika formatnya angka (Excel Serial Date)
  if (typeof dateVal === "number") {
    const date = new Date(Math.round((dateVal - 25569) * 86400 * 1000))
    return date.toISOString().split("T")[0]
  }

  // Jika formatnya string (DD-MM-YYYY atau YYYY-MM-DD)
  const strVal = String(dateVal).trim()

  // Coba parse YYYY-MM-DD
  if (strVal.match(/^\d{4}-\d{2}-\d{2}$/)) return strVal

  // Coba parse DD-MM-YYYY atau DD/MM/YYYY
  if (strVal.match(/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/)) {
    const parts = strVal.split(/[-/]/)
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
  }

  return null // Gagal parse
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // 1. Baca File Excel
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0] // Ambil sheet pertama
    const sheet = workbook.Sheets[sheetName]

    // Konversi ke Array of Arrays untuk inspeksi manual
    const rawData = (XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]) || []

    if (rawData.length === 0) {
      return NextResponse.json({ error: "File Excel kosong" }, { status: 400 })
    }

    // 2. DETEKSI HEADER OTOMATIS
    // Cari baris yang mengandung kata kunci "Nama" dan ("NIP" atau "NIDN" atau "NIDK")
    let headerRowIndex = -1
    let colMap: Record<string, number> = {}

    for (let i = 0; i < Math.min(rawData.length, 20); i++) {
      const row = rawData[i].map((cell) => String(cell).toLowerCase().trim())

      // Kriteria: Baris harus punya kolom "nama" DAN ("nip" atau "nidn" atau "nidk")
      if (
        row.includes("nama") &&
        (row.includes("nip") || row.includes("nidn") || row.includes("nidk"))
      ) {
        headerRowIndex = i

        // Mapping index kolom berdasarkan header yang ditemukan
        row.forEach((cell, index) => {
          if (cell.includes("nama")) colMap["nama"] = index
          else if (cell === "nip") colMap["nip"] = index
          else if (cell === "nidn") colMap["nidn"] = index
          else if (cell === "nidk") colMap["nidk"] = index
          else if (cell === "nuptk") colMap["nuptk"] = index
          else if (cell === "l/p" || cell === "gender" || cell === "jenis kelamin")
            colMap["gender"] = index
          else if (cell.includes("email")) colMap["email"] = index
          else if (cell.includes("tanggal lahir") || cell === "tgl lahir") {
            if (!colMap["tgl_lahir"]) colMap["tgl_lahir"] = index
          } else if (cell.includes("jabatan") || cell === "fungsional")
            colMap["jabatan"] = index
          else if (cell.includes("pangkat") || cell.includes("gol")) colMap["pangkat"] = index
          else if (cell.includes("departemen") || cell.includes("bagian") || cell.includes("prodi"))
            colMap["prodi"] = index
          else if (cell.includes("telepon") || cell.includes("hp") || cell.includes("no."))
            colMap["phone"] = index
          else if (cell.includes("unit") || cell.includes("kerja")) colMap["unit_kerja"] = index
        })
        break
      }
    }

    if (headerRowIndex === -1) {
      return NextResponse.json(
        {
          error:
            'Format header tidak dikenali. Pastikan ada kolom "Nama" dan "NIP/NIDN/NIDK".',
        },
        { status: 400 }
      )
    }

    // 3. Proses Data
    const errors: string[] = []
    let successCount = 0

    // Loop mulai dari baris setelah header
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i]

      // Skip baris kosong
      if (!row || row.length === 0) continue

      const nama = cleanString(row[colMap["nama"]])

      // Jika tidak ada nama, kemungkinan baris kosong atau footer
      if (!nama) continue

      const nip = cleanString(row[colMap["nip"]])
      const nidn = cleanString(row[colMap["nidn"]])
      const nidk = cleanString(row[colMap["nidk"]])
      const nuptk = cleanString(row[colMap["nuptk"]])
      const rawGender = cleanString(row[colMap["gender"]])

      // Normalisasi Gender
      let gender = null
      if (rawGender) {
        if (rawGender.toLowerCase().startsWith("l")) gender = "L"
        else if (rawGender.toLowerCase().startsWith("p")) gender = "P"
      }

      const tgl_lahir = parseExcelDate(row[colMap["tgl_lahir"]])

      // Tentukan identification type dari data yang tersedia
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
      }

      // Validasi data wajib
      if (!nama || !identification_number) {
        errors.push(`Baris ${i + 1}: Nama dan nomor identifikasi (NIP/NIDN/NIDK) wajib diisi`)
        continue
      }

      // Data Object untuk Supabase dosen_members
      const dosenData = {
        nip: nip || `${identification_type}-${identification_number}`,
        full_name: nama.replace(/[""'']/g, "").trim(),
        gender: gender,
        date_of_birth: tgl_lahir,
        email: cleanString(row[colMap["email"]]) || `${nama.toLowerCase().replace(/\s+/g, ".")}@unand.ac.id`,
        phone: cleanString(row[colMap["phone"]]),
        department: cleanString(row[colMap["prodi"]]),
        rank_golongan: cleanString(row[colMap["pangkat"]]),
        position_functional: cleanString(row[colMap["jabatan"]]),
        unit_kerja: cleanString(row[colMap["unit_kerja"]]),
        is_active: true,
      }

      try {
        // Cek apakah dosen dengan NIP sudah ada
        const existingNip = nip
          ? await supabase
              .from("dosen_members")
              .select("id")
              .eq("nip", nip)
              .single()
          : null

        let dosenId = existingNip?.data?.id
        let dosenInsertError = null

        if (existingNip?.data?.id) {
          // Update existing
          const { error } = await supabase
            .from("dosen_members")
            .update(dosenData)
            .eq("id", dosenId)
          dosenInsertError = error
        } else {
          // Insert baru
          const { data, error } = await supabase
            .from("dosen_members")
            .insert([dosenData])
            .select("id")
            .single()
          dosenId = data?.id
          dosenInsertError = error
        }

        if (dosenInsertError) {
          errors.push(`Baris ${i + 1}: ${nama} - ${dosenInsertError.message}`)
          continue
        }

        // Jika ada identification type, simpan ke dosen_identification
        if (dosenId && identification_type) {
          const { error: identError } = await supabase
            .from("dosen_identification")
            .upsert(
              {
                dosen_id: dosenId,
                identification_type,
                identification_number,
              },
              { onConflict: "identification_type,identification_number" }
            )

          if (identError) {
            console.error(`[v0] Error saving identification for ${nama}:`, identError)
            // Jangan gagalkan proses, cukup log saja
          }
        }

        successCount++
      } catch (error) {
        errors.push(
          `Baris ${i + 1}: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
        )
      }
    }

    return NextResponse.json({
      message: "Proses upload selesai",
      success: true,
      count: successCount,
      errors: errors.length > 0 ? errors : undefined,
      totalRows: rawData.length - (headerRowIndex + 1),
    })
  } catch (error: any) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan internal: " + error.message,
      },
      { status: 500 }
    )
  }
}
