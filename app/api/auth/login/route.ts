import { NextResponse } from "next/server"
import { loginUser, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password diperlukan" }, { status: 400 })
    }

    const user = await loginUser(username, password)

    if (!user) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    }

    await createSession(user)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 })
  }
}
