import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Get total count
    const { count: total } = await supabase
      .from("dosen_members")
      .select("*", { count: "exact", head: true })

    // Get active count
    const { count: active } = await supabase
      .from("dosen_members")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get NIDN count
    const { count: nidn_count } = await supabase
      .from("dosen_members")
      .select("*", { count: "exact", head: true })
      .eq("identification_type", "NIDN")

    // Get NIDK count
    const { count: nidk_count } = await supabase
      .from("dosen_members")
      .select("*", { count: "exact", head: true })
      .eq("identification_type", "NIDK")

    return NextResponse.json({
      total: total || 0,
      active: active || 0,
      nidn_count: nidn_count || 0,
      nidk_count: nidk_count || 0,
    })
  } catch (error) {
    console.error("[v0] Dosen stats error:", error)
    return NextResponse.json(
      { message: "Gagal mengambil statistik dosen" },
      { status: 500 }
    )
  }
}
