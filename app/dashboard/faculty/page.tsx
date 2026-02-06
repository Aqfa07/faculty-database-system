import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { FacultyTable } from "@/components/faculty/faculty-table"
import { FacultyFilters } from "@/components/faculty/faculty-filters"
import { AddFacultyDialog } from "@/components/faculty/add-faculty-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Users, GraduationCap, Building, UserCheck } from "lucide-react"

interface PageProps {
  searchParams: Promise<{
    department?: string
    rank?: string
    search?: string
  }>
}

export default async function FacultyPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const params = await searchParams
  const department = params.department || ""
  const rank = params.rank || ""
  const search = params.search || ""

  const supabase = await createClient()

  let query = supabase.from("faculty_members").select("*").eq("is_active", true)

  if (department) {
    query = query.eq("department", department)
  }

  if (rank) {
    query = query.eq("academic_rank", rank)
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,nip.ilike.%${search}%,nidn.ilike.%${search}%`)
  }

  const { data: facultyData, error } = await query.order("full_name")

  if (error) {
    console.error("Error fetching faculty data:", error)
  }

  // Get stats
  const { data: allFaculty } = await supabase.from("faculty_members").select("department, academic_rank, is_active")

  const activeFaculty = allFaculty?.filter((f) => f.is_active) || []
  const uniqueDepartments = new Set(activeFaculty.map((f) => f.department)).size
  const professorCount = activeFaculty.filter((f) => f.academic_rank === "Guru Besar").length

  const canEdit = user.role === "admin" || user.role === "pj"

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} title="Data Dosen" description="Kelola profil dan informasi dosen FK UNAND" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Dosen Aktif"
            value={activeFaculty.length}
            description="Dosen terdaftar"
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Departemen"
            value={uniqueDepartments}
            description="Unit kerja"
            icon={<Building className="w-6 h-6" />}
          />
          <StatsCard
            title="Guru Besar"
            value={professorCount}
            description="Profesor aktif"
            icon={<GraduationCap className="w-6 h-6" />}
          />
          <StatsCard
            title="Hasil Filter"
            value={facultyData?.length || 0}
            description="Dosen ditampilkan"
            icon={<UserCheck className="w-6 h-6" />}
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <FacultyFilters currentDepartment={department} currentRank={rank} currentSearch={search} />
          {canEdit && <AddFacultyDialog userId={user.id} />}
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Dosen</CardTitle>
            <CardDescription>
              {facultyData?.length || 0} dosen ditemukan
              {(department || rank || search) && " dengan filter aktif"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacultyTable data={facultyData || []} canEdit={canEdit} userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
