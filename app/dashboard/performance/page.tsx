import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { PerformanceTable } from "@/components/performance/performance-table"
import { PerformanceFilters } from "@/components/performance/performance-filters"
import { PerformanceStats } from "@/components/performance/performance-stats"
import { AddPerformanceDialog } from "@/components/performance/add-performance-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageProps {
  searchParams: Promise<{
    year?: string
    quarter?: string
    category?: string
  }>
}

export default async function PerformancePage({ searchParams }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const params = await searchParams
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  const year = params.year ? Number.parseInt(params.year) : currentYear
  const quarter = params.quarter ? Number.parseInt(params.quarter) : currentQuarter
  const category = params.category || ""

  const supabase = await createClient()

  let query = supabase.from("dean_performance").select("*").eq("year", year).eq("quarter", quarter)

  if (category) {
    query = query.eq("category", category)
  }

  const { data: performanceData, error } = await query.order("category").order("indicator")

  if (error) {
    console.error("Error fetching performance data:", error)
  }

  const canEdit = user.role === "admin" || user.role === "pj"

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={user}
        title="Capaian Kinerja Dekan"
        description="Kelola dan pantau indikator kinerja dekan per kuartal"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <PerformanceFilters currentYear={year} currentQuarter={quarter} currentCategory={category} />
          {canEdit && <AddPerformanceDialog year={year} quarter={quarter} userId={user.id} />}
        </div>

        {/* Stats */}
        <PerformanceStats data={performanceData || []} year={year} quarter={quarter} />

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Data Kinerja Q{quarter} {year}
            </CardTitle>
            <CardDescription>
              {performanceData?.length || 0} indikator tercatat
              {category && ` dalam kategori ${category}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTable data={performanceData || []} canEdit={canEdit} userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
