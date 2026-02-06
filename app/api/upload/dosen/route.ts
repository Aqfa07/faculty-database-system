import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

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
    
    // Find the actual header row by looking for "Nama" keyword
    const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]
    let headerRowIndex = 0
    
    for (let i = 0; i < Math.min(allRows.length, 10); i++) {
      const row = allRows[i]
      if (Array.isArray(row) && row.some((cell: any) => 
        typeof cell === 'string' && 
        cell.toLowerCase().includes('nama')
      )) {
        headerRowIndex = i
        break
      }
    }

    // Parse from the correct header row
    const dataRows = XLSX.utils.sheet_to_json(worksheet, {
      range: headerRowIndex
    }) as any[]

    const supabase = createAdminClient()
    const results = { success: 0, failed: 0, errors: [] as string[], warnings: [] as string[] }

    // Helper function to find value by multiple column name variations
    const getValue = (row: any, columnAliases: string[]): string | null => {
      for (const alias of columnAliases) {
        const value = row[alias]
        if (value !== undefined && value !== null && value !== '') {
          return String(value).trim()
        }
      }
      return null
    }

    // Column name aliases for flexible mapping
    const columnMappings = {
      nama: ['Nama', 'NAMA', 'nama', 'Full Name', 'Nama Dosen'],
      nidn: ['NIDN', 'Nomor NIDN', 'nidn', 'NIDN ', ' NIDN'],
      nidk: ['NIDK', 'Nomor NIDK', 'nidk'],
      nuptk: ['NUPTK', 'Nomor NUPTK', 'nuptk'],
      email: ['Email', 'EMAIL', 'email', 'E-mail', 'Email Dosen'],
      phone: ['Telepon', 'Telp', 'Phone', 'No. Telepon', 'HP', 'No HP'],
      department: ['Departemen', 'Dept', 'Department', 'Unit Kerja', 'Departemen Departemen'],
      rank: ['Jabatan Akademik', 'Rank', 'Pangkat', 'Akademik Rank', 'Jabatan'],
      position: ['Posisi', 'Position', 'Posisi Fakultas', 'Faculty Position'],
    }

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      
      // Skip empty rows
      if (!row || Object.keys(row).length === 0) {
        continue
      }

      try {
        // Extract data with flexible column mapping
        const full_name = getValue(row, columnMappings.nama)
        const nidn = getValue(row, columnMappings.nidn)
        const nidk = getValue(row, columnMappings.nidk)
        const nuptk = getValue(row, columnMappings.nuptk)
        
        const identification_number = nidn || nidk || nuptk || ""
        const identification_type = nidn ? "NIDN" : nidk ? "NIDK" : nuptk ? "NUPTK" : ""

        // Validate required fields with detailed error messaging
        const validationErrors: string[] = []
        
        if (!full_name) {
          validationErrors.push("Nama dosen tidak ditemukan")
        }
        
        if (!identification_number) {
          validationErrors.push("Nomor identifikasi (NIDN/NIDK/NUPTK) tidak ditemukan")
        }

        if (validationErrors.length > 0) {
          results.errors.push(`Baris ${i + headerRowIndex + 2}: ${validationErrors.join("; ")}`)
          results.failed++
          continue
        }

        // Clean data before insertion
        const cleanedData = {
          full_name: full_name!.replace(/[""'']/g, '').trim(),
          identification_type,
          identification_number: identification_number.replace(/[^\d]/g, ''),
          email: getValue(row, columnMappings.email) || null,
          phone: getValue(row, columnMappings.phone) || null,
          department: getValue(row, columnMappings.department) || null,
          academic_rank: getValue(row, columnMappings.rank) || null,
          faculty_position: getValue(row, columnMappings.position) || null,
          qualification: null,
          specialization: null,
          is_active: true,
        }

        // Additional validation for cleaned data
        if (cleanedData.identification_number.length === 0) {
          results.errors.push(`Baris ${i + headerRowIndex + 2}: Nomor identifikasi hanya berisi non-numerik`)
          results.failed++
          continue
        }

        const { error } = await supabase.from("dosen_members").insert([cleanedData])

        if (error) {
          results.errors.push(`Baris ${i + headerRowIndex + 2}: ${error.message}`)
          results.failed++
        } else {
          results.success++
        }
      } catch (error) {
        results.errors.push(
          `Baris ${i + headerRowIndex + 2}: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
        )
        results.failed++
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Dosen upload error:", error)
    return NextResponse.json(
      { 
        message: "Gagal upload file. Pastikan file adalah Excel/CSV dengan format yang sesuai.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
