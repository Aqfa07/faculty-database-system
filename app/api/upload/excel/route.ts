import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as XLSX from "xlsx"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const tableName = formData.get("tableName") as string
    const userId = formData.get("userId") as string

    if (!file || !tableName || !userId) {
      return NextResponse.json({ error: "File, tableName, dan userId diperlukan" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create upload log
    const { data: uploadLog, error: logError } = await supabase
      .from("upload_logs")
      .insert({
        file_name: file.name,
        file_type: file.type,
        table_name: tableName,
        status: "processing",
        uploaded_by: userId,
      })
      .select()
      .single()

    if (logError) {
      console.error("Error creating upload log:", logError)
    }

    // Parse Excel file
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    if (jsonData.length === 0) {
      await supabase
        .from("upload_logs")
        .update({ status: "failed", error_message: "File tidak berisi data" })
        .eq("id", uploadLog?.id)

      return NextResponse.json({ error: "File tidak berisi data" }, { status: 400 })
    }

    let processedCount = 0
    const errors: string[] = []

    if (tableName === "faculty_members") {
      for (const row of jsonData as Record<string, unknown>[]) {
        try {
          const facultyData = {
            nip: String(row.nip || row.NIP || "").trim(),
            nidn: row.nidn || row.NIDN ? String(row.nidn || row.NIDN).trim() : null,
            full_name: String(row.full_name || row.nama || row.NAMA || row["Nama Lengkap"] || "").trim(),
            email: row.email || row.EMAIL ? String(row.email || row.EMAIL).trim() : null,
            phone:
              row.phone || row.telepon || row.TELEPON ? String(row.phone || row.telepon || row.TELEPON).trim() : null,
            department: String(row.department || row.departemen || row.DEPARTEMEN || "").trim(),
            position: row.position || row.jabatan ? String(row.position || row.jabatan).trim() : null,
            academic_rank:
              row.academic_rank || row.jabatan_fungsional
                ? String(row.academic_rank || row.jabatan_fungsional).trim()
                : null,
            specialization:
              row.specialization || row.spesialisasi ? String(row.specialization || row.spesialisasi).trim() : null,
            created_by: userId,
            updated_by: userId,
          }

          if (!facultyData.nip || !facultyData.full_name || !facultyData.department) {
            errors.push(`Baris dengan NIP ${facultyData.nip}: Data wajib tidak lengkap`)
            continue
          }

          // Upsert based on NIP
          const { error } = await supabase.from("faculty_members").upsert(facultyData, { onConflict: "nip" })

          if (error) {
            errors.push(`NIP ${facultyData.nip}: ${error.message}`)
          } else {
            processedCount++
          }
        } catch (rowError) {
          errors.push(`Error processing row: ${rowError}`)
        }
      }
    } else if (tableName === "dean_performance") {
      for (const row of jsonData as Record<string, unknown>[]) {
        try {
          const performanceData = {
            year: Number(row.year || row.tahun || new Date().getFullYear()),
            quarter: Number(row.quarter || row.kuartal || 1),
            category: String(row.category || row.kategori || "").trim(),
            indicator: String(row.indicator || row.indikator || "").trim(),
            target_value: row.target_value || row.target ? Number(row.target_value || row.target) : null,
            achieved_value: row.achieved_value || row.capaian ? Number(row.achieved_value || row.capaian) : null,
            unit: row.unit || row.satuan ? String(row.unit || row.satuan).trim() : null,
            notes: row.notes || row.catatan ? String(row.notes || row.catatan).trim() : null,
            status: String(row.status || "pending").toLowerCase(),
            created_by: userId,
            updated_by: userId,
          }

          if (!performanceData.category || !performanceData.indicator) {
            errors.push(`Baris dengan indikator "${performanceData.indicator}": Data wajib tidak lengkap`)
            continue
          }

          // Validate status
          if (!["pending", "on_track", "achieved", "not_achieved"].includes(performanceData.status)) {
            performanceData.status = "pending"
          }

          const { error } = await supabase.from("dean_performance").upsert(performanceData, {
            onConflict: "year,quarter,category,indicator",
          })

          if (error) {
            errors.push(`Indikator "${performanceData.indicator}": ${error.message}`)
          } else {
            processedCount++
          }
        } catch (rowError) {
          errors.push(`Error processing row: ${rowError}`)
        }
      }
    }

    // Update upload log
    const finalStatus = processedCount > 0 ? "completed" : "failed"
    const errorMessage = errors.length > 0 ? errors.slice(0, 3).join("; ") : null

    await supabase
      .from("upload_logs")
      .update({
        status: finalStatus,
        records_count: processedCount,
        error_message: errorMessage,
      })
      .eq("id", uploadLog?.id)

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: userId,
      action: `Upload file ${file.name} ke ${tableName}`,
      table_name: tableName,
      new_data: { file_name: file.name, records_count: processedCount },
    })

    if (errors.length > 0 && processedCount === 0) {
      return NextResponse.json({ error: `Upload gagal: ${errors[0]}`, count: processedCount }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: errors.length > 0 ? `Upload selesai dengan beberapa error` : "Upload berhasil",
      count: processedCount,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses file" }, { status: 500 })
  }
}
