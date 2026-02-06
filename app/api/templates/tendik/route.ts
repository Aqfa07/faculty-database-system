import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create a basic CSV template for Tendik data
    const csvContent = `DAFTAR URUT KEPANGKATAN PEGAWAI NEGERI SIPIL TENAGA KEPENDIDIKAN
,,,,,,,,,,,,,,LAMPIRAN,,,,: SE KBAKN
,UNIVERSITAS ANDALAS,,,,,,,,,,,,,,NOMOR ,,,,: 03/SE/1980
,KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN,,,,,,,,,,,,,,TANGGAL,,,,: 11 FEBRUARI 1980
,,,,,,,,,,,,,,,,GOLONGAN,,,,: I s/d IV
,,Jumlah :,SESUAIKAN,,,,,,,,,,,,KEADAAN,,,,:  FEBRUARI 2025
,,,,,,,,,,,,,,,UNIT KERJA,,,,: FAKULTAS KEDOKTERAN UNIVERSITAS ANDALAS
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
No,Nama,L/P,NIP BARU,Tempat Lahir,Tanggal Lahir,TMT Pensiun,Pendidikan,Golongan,Jabatan,Unit Kerja,Status Kepegawaian,Penempatan Saat Ini
1,NAMA LENGKAP,P,197504032000122001,Padang,03-04-1975,01-04-2025,Magister,IV/a,Analis Kepegawaian Ahli Muda,Administrasi,PNS,Kantor Dekan
2,NAMA LENGKAP,L,19661017198902001,Padang,17-10-1966,01-11-2024,Sarjana,IV/a,Pranata Laboratorium Pendidikan Madya,Laboratorium,PNS,Laboratorium Utama`

    const buffer = Buffer.from(csvContent)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Template_Data_Tendik.csv"',
      },
    })
  } catch (error) {
    console.error("[v0] Template error:", error)
    return NextResponse.json(
      { error: "Gagal membuat template" },
      { status: 500 }
    )
  }
}
