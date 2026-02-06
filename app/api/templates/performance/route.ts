import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function GET() {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  // Create template workbook
  const templateData = [
    {
      tahun: currentYear,
      kuartal: currentQuarter,
      kategori: "Pendidikan",
      indikator: "Jumlah Lulusan Tepat Waktu",
      target: 85,
      capaian: 80,
      satuan: "%",
      status: "on_track",
      catatan: "Dalam proses pencapaian",
    },
    {
      tahun: currentYear,
      kuartal: currentQuarter,
      kategori: "Penelitian",
      indikator: "Publikasi Internasional",
      target: 50,
      capaian: 45,
      satuan: "artikel",
      status: "on_track",
      catatan: "",
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Capaian Kinerja")

  // Set column widths
  worksheet["!cols"] = [
    { wch: 10 }, // tahun
    { wch: 10 }, // kuartal
    { wch: 25 }, // kategori
    { wch: 35 }, // indikator
    { wch: 10 }, // target
    { wch: 10 }, // capaian
    { wch: 10 }, // satuan
    { wch: 15 }, // status
    { wch: 30 }, // catatan
  ]

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=template_capaian_kinerja.xlsx",
    },
  })
}
