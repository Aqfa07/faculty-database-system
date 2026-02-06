import { createAdminClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Get total count
    const { count: total, error: totalError } = await supabase
      .from("tendik_members")
      .select("*", { count: "exact", head: true })

    if (totalError) throw totalError

    // Get active count
    const { count: active, error: activeError } = await supabase
      .from("tendik_members")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (activeError) throw activeError

    // Get inactive count
    const { count: inactive, error: inactiveError } = await supabase
      .from("tendik_members")
      .select("*", { count: "exact", head: true })
      .eq("is_active", false)

    if (inactiveError) throw inactiveError

    // Get unique positions count
    const { data: positions, error: posError } = await supabase
      .from("tendik_members")
      .select("position", { head: false })
      .eq("is_active", true)

    if (posError) throw posError

    const uniquePositions = new Set(positions?.map((p) => p.position) || []).size

    return NextResponse.json({
      total: total || 0,
      active: active || 0,
      inactive: inactive || 0,
      positions: uniquePositions,
    })
  } catch (error) {
    console.error("[v0] Tendik stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tendik stats" },
      { status: 500 }
    )
  }
}
