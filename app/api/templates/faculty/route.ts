import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function GET() {
  // Create template workbook
  const templateData = [
    {
      nip: "198501012010011001",
      nidn: "0001018501",
      nama: "Dr. Contoh Nama, Sp.PD",
      email: "contoh@fk.unand.ac.id",
      telepon: "081234567890",
      departemen: "Ilmu Penyakit Dalam",
      jabatan: "Kepala Departemen",
      jabatan_fungsional: "Lektor Kepala",
      spesialisasi: "Penyakit Dalam - Gastroenterologi",
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Dosen")

  // Set column widths
  worksheet["!cols"] = [
    { wch: 20 }, // nip
    { wch: 15 }, // nidn
    { wch: 30 }, // nama
    { wch: 30 }, // email
    { wch: 15 }, // telepon
    { wch: 25 }, // departemen
    { wch: 20 }, // jabatan
    { wch: 15 }, // jabatan_fungsional
    { wch: 30 }, // spesialisasi
  ]

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=template_data_dosen.xlsx",
    },
  })
}
