import { createAdminClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabase
      .from("tendik_members")
      .update({
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
        updated_by: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Tendik member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Tendik PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update tendik member" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from("tendik_members")
      .delete()
      .eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Tendik DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete tendik member" },
      { status: 500 }
    )
  }
}
