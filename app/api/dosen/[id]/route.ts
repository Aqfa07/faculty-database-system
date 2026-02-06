import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = createAdminClient()

    const { full_name, identification_type, identification_number, ...otherData } = body

    const { data, error } = await supabase
      .from("dosen_members")
      .update({
        full_name,
        identification_type,
        identification_number,
        ...otherData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()

    if (error) {
      console.error("[v0] Dosen update error:", error)
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "Data dosen tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Dosen PUT error:", error)
    return NextResponse.json(
      { message: "Gagal mengubah data dosen" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("dosen_members")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("[v0] Dosen delete error:", error)
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: "Data dosen berhasil dihapus" })
  } catch (error) {
    console.error("[v0] Dosen DELETE error:", error)
    return NextResponse.json(
      { message: "Gagal menghapus data dosen" },
      { status: 500 }
    )
  }
}
