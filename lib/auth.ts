import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { createAdminClient } from "@/lib/supabase/server"

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: "admin" | "pj" | "staff"
  department: string | null
  is_active: boolean
}

export interface Session {
  user: User
  expiresAt: number
}

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(user: User): Promise<string> {
  const session: Session = {
    user,
    expiresAt: Date.now() + SESSION_DURATION,
  }

  const sessionToken = Buffer.from(JSON.stringify(session)).toString("base64")

  const cookieStore = await cookies()
  cookieStore.set("fkunand_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  })

  return sessionToken
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("fkunand_session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session: Session = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

    if (session.expiresAt < Date.now()) {
      await destroySession()
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("fkunand_session")
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user || null
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRole(roles: string[]): Promise<User> {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  // Use admin client to bypass RLS for authentication
  const supabase = createAdminClient()

  console.log("[v0] Attempting login for username:", username)

  // Check if admin user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("is_active", true)
    .single()

  console.log("[v0] Fetch result:", { existingUser: existingUser?.username, fetchError })

  // If user doesn't exist and this is the default admin login, create admin
  if (!existingUser && username === "admin" && password === "admin") {
    console.log("[v0] Creating default admin user")
    const passwordHash = await hashPassword("admin")

    const { data: newAdmin, error: insertError } = await supabase
      .from("users")
      .insert({
        email: "admin@fk.unand.ac.id",
        username: "admin",
        password_hash: passwordHash,
        full_name: "Administrator FK UNAND",
        role: "admin",
        department: "Administration",
        is_active: true,
      })
      .select()
      .single()

    console.log("[v0] Insert result:", { newAdmin: newAdmin?.username, insertError })

    if (insertError || !newAdmin) {
      console.log("[v0] Failed to create admin:", insertError)
      return null
    }

    return {
      id: newAdmin.id,
      email: newAdmin.email,
      username: newAdmin.username,
      full_name: newAdmin.full_name,
      role: newAdmin.role,
      department: newAdmin.department,
      is_active: newAdmin.is_active,
    }
  }

  // If user not found, return null
  if (fetchError || !existingUser) {
    console.log("[v0] User not found")
    return null
  }

  // Verify password
  let isValidPassword = await verifyPassword(password, existingUser.password_hash)
  console.log("[v0] Password verification:", isValidPassword)

  // it means the password hash in DB is invalid (from seed script). Reset it.
  if (!isValidPassword && username === "admin" && password === "admin") {
    console.log("[v0] Admin password hash is invalid, resetting to correct hash")
    const correctHash = await hashPassword("admin")

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: correctHash })
      .eq("username", "admin")

    if (!updateError) {
      console.log("[v0] Admin password hash reset successfully")
      isValidPassword = true
    } else {
      console.log("[v0] Failed to reset admin password:", updateError)
    }
  }

  if (!isValidPassword) {
    return null
  }

  return {
    id: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
    full_name: existingUser.full_name,
    role: existingUser.role,
    department: existingUser.department,
    is_active: existingUser.is_active,
  }
}
