import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashPassword, getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, username, password, full_name, role, department } = await request.json()

    if (!email || !username || !password || !full_name || !role) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if username or email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .or(`username.eq.${username},email.eq.${email}`)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "Username atau email sudah digunakan" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        username,
        password_hash: passwordHash,
        full_name,
        role,
        department: department || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 })
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: currentUser.id,
      action: `Membuat user baru: ${username}`,
      table_name: "users",
      new_data: { username, email, role },
    })

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
