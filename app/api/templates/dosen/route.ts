import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function GET() {
  try {
    const template = [
      {
        Nama: "Dr. Budi Santoso",
        NIDN: "0001056301",
        Email: "budi@unand.ac.id",
        Telepon: "08123456789",
        Departemen: "Anatomi",
        "Jabatan Akademik": "Prof. Dr.",
        "Posisi Fakultas": "Ketua Departemen",
        Kualifikasi: "S3",
        Spesialisasi: "Anatomi Klinis",
      },
      {
        Nama: "Dr. Siti Nurhaliza",
        NIDK: "0002078402",
        Email: "siti@unand.ac.id",
        Telepon: "08198765432",
        Departemen: "Fisiologi",
        "Jabatan Akademik": "Dr.",
        "Posisi Fakultas": "Dosen Tetap",
        Kualifikasi: "S3",
        Spesialisasi: "Fisiologi Manusia",
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(template)
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 25 },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Dosen")

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=Template_Data_Dosen.xlsx",
      },
    })
  } catch (error) {
    console.error("[v0] Template generation error:", error)
    return NextResponse.json(
      { message: "Gagal membuat template" },
      { status: 500 }
    )
  }
}
