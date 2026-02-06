import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      )
    }

    const fileText = await file.text()
    const lines = fileText.split("\n").filter((line) => line.trim())

    // Skip header rows (DUK format has multiple header rows)
    const dataLines = lines.slice(8) // Skip DUK header rows

    const supabase = createAdminClient()
    let created = 0
    let updated = 0
    let failed = 0
    const errors: string[] = []

    // Parse CSV data
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i]
      if (!line.trim()) continue

      try {
        const fields = line.split(",").map((f) => f.trim())

        // Extract data based on DUK format
        const no = fields[0]?.trim()
        const fullName = fields[1]?.trim()
        const gender = fields[2]?.trim() === "L" ? "L" : "P"
        const nip = fields[3]?.trim()
        const placeOfBirth = fields[4]?.trim()
        const dateOfBirth = fields[5]?.trim()
        const retirementDate = fields[6]?.trim()
        const golongan = fields[10]?.trim()
        const position = fields[13]?.trim()
        const department = fields[16]?.trim() || "Fakultas Kedokteran"

        // Determine status kepegawaian based on NIP pattern
        let statusKepegawaian = "PNS"
        if (nip?.includes("198")) statusKepegawaian = "PNS"
        else if (nip?.includes("199") || nip?.includes("200")) statusKepegawaian = "PTT"

        if (!nip || !fullName || !position) {
          failed++
          errors.push(`Baris ${i + 9}: Data tidak lengkap (NIP, Nama, atau Jabatan kosong)`)
          continue
        }

        // Check if record exists
        const { data: existing, error: checkError } = await supabase
          .from("tendik_members")
          .select("id")
          .eq("nip", nip)
          .single()

        if (existing && !checkError) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("tendik_members")
            .update({
              full_name: fullName,
              gender,
              place_of_birth: placeOfBirth,
              date_of_birth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
              retirement_date: retirementDate ? new Date(retirementDate).toISOString() : null,
              position,
              department,
              rank_golongan: golongan,
              status_kepegawaian: statusKepegawaian,
              is_active: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id)

          if (updateError) {
            failed++
            errors.push(`Baris ${i + 9}: ${updateError.message}`)
          } else {
            updated++
          }
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from("tendik_members")
            .insert({
              nip,
              full_name: fullName,
              gender,
              place_of_birth: placeOfBirth,
              date_of_birth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
              retirement_date: retirementDate ? new Date(retirementDate).toISOString() : null,
              position,
              department,
              rank_golongan: golongan,
              status_kepegawaian: statusKepegawaian,
              is_active: true,
            })

          if (insertError) {
            failed++
            errors.push(`Baris ${i + 9}: ${insertError.message}`)
          } else {
            created++
          }
        }
      } catch (error) {
        failed++
        errors.push(
          `Baris ${i + 9}: ${error instanceof Error ? error.message : "Error tidak diketahui"}`
        )
      }
    }

    const message = `Import selesai: ${created} ditambahkan, ${updated} diperbarui, ${failed} gagal`

    return NextResponse.json(
      {
        message,
        stats: { created, updated, failed },
        errors: errors.slice(0, 10), // Return first 10 errors
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan saat memproses file",
      },
      { status: 500 }
    )
  }
}
