import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const identification = searchParams.get("identification")

    let query = supabase.from("dosen_members").select("*").eq("is_active", true)

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,identification_number.ilike.%${search}%`
      )
    }

    if (department) {
      query = query.eq("department", department)
    }

    if (identification) {
      query = query.eq("identification_type", identification)
    }

    if (status && status !== "Aktif") {
      if (status === "Non-Aktif") {
        query = query.eq("is_active", false)
      } else if (status === "Pensiunan") {
        query = query.eq("is_retired", true)
      }
    }

    const { data, error } = await query.order("full_name")

    if (error) {
      console.error("[v0] Dosen fetch error:", error)
      return NextResponse.json(
        { message: "Gagal mengambil data dosen", error: error.message },
        { status: 500 }
      )
    }

    // Map the data to include identification object
    const mappedData = data.map((member: any) => ({
      ...member,
      identification: member.identification_type ? {
        type: member.identification_type,
        number: member.identification_number,
      } : null,
    }))

    return NextResponse.json(mappedData)
  } catch (error) {
    console.error("[v0] Dosen API error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data dosen" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createAdminClient()

    const { full_name, identification_type, identification_number, ...otherData } = body

    if (!full_name || !identification_number) {
      return NextResponse.json(
        { message: "Nama dan nomor identifikasi wajib diisi" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("dosen_members")
      .insert([
        {
          full_name,
          identification_type: identification_type || "NIDN",
          identification_number,
          ...otherData,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Dosen creation error:", error)
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Dosen POST error:", error)
    return NextResponse.json(
      { message: "Gagal membuat data dosen" },
      { status: 500 }
    )
  }
}
