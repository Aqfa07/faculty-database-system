import { createAdminClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const department = searchParams.get("department")
    const position = searchParams.get("position")
    const status = searchParams.get("status")

    let query = supabase.from("tendik_members").select("*").eq("is_active", true)

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,nip.ilike.%${search}%`
      )
    }

    if (department && department !== "All Departments") {
      query = query.eq("department", department)
    }

    if (position && position !== "All Positions") {
      query = query.eq("position", position)
    }

    if (status && status !== "Semua Status") {
      query = query.eq("status_kepegawaian", status)
    }

    const { data, error } = await query.order("full_name", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Tendik GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tendik members" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !["admin", "pj"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const supabase = createAdminClient()

    // Validate required fields
    if (!body.nip || !body.full_name || !body.position) {
      return NextResponse.json(
        { error: "NIP, name, and position are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from("tendik_members").insert([
      {
        nip: body.nip,
        full_name: body.full_name,
        gender: body.gender || null,
        place_of_birth: body.place_of_birth || null,
        date_of_birth: body.date_of_birth || null,
        retirement_date: body.retirement_date || null,
        email: body.email || null,
        phone: body.phone || null,
        position: body.position,
        department: body.department || null,
        rank_golongan: body.rank_golongan || null,
        rank_tmt: body.rank_tmt || null,
        education_level: body.education_level || null,
        education_field: body.education_field || null,
        graduation_year: body.graduation_year ? parseInt(body.graduation_year) : null,
        years_of_service: body.years_of_service ? parseInt(body.years_of_service) : null,
        duty_unit: body.duty_unit || null,
        appointment_date: body.appointment_date || null,
        is_active: body.is_active !== false,
        created_by: session.id,
      },
    ]).select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Tendik POST error:", error)
    return NextResponse.json(
      { error: "Failed to create tendik member" },
      { status: 500 }
    )
  }
}
