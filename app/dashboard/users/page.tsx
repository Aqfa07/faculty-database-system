import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { UsersTable } from "@/components/users/users-table"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Only admin can access this page
  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} title="Manajemen User" description="Kelola akun pengguna sistem" />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-end">
          <AddUserDialog />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>{users?.length || 0} pengguna terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable data={users || []} currentUserId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
