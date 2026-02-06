import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, FileSpreadsheet, Activity, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

async function getDashboardStats() {
  const supabase = await createClient()

  const [facultyResult, performanceResult, uploadsResult, activityResult] = await Promise.all([
    supabase.from("faculty_members").select("id", { count: "exact" }).eq("is_active", true),
    supabase.from("dean_performance").select("id, status", { count: "exact" }),
    supabase.from("upload_logs").select("id", { count: "exact" }),
    supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(5),
  ])

  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  const quarterlyPerformance = await supabase
    .from("dean_performance")
    .select("*")
    .eq("year", currentYear)
    .eq("quarter", currentQuarter)

  const achievedCount = quarterlyPerformance.data?.filter((p) => p.status === "achieved").length || 0
  const totalIndicators = quarterlyPerformance.data?.length || 0

  return {
    facultyCount: facultyResult.count || 0,
    performanceCount: performanceResult.count || 0,
    uploadsCount: uploadsResult.count || 0,
    recentActivity: activityResult.data || [],
    achievedCount,
    totalIndicators,
    currentQuarter,
    currentYear,
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const stats = await getDashboardStats()

  const achievementRate =
    stats.totalIndicators > 0 ? Math.round((stats.achievedCount / stats.totalIndicators) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} title="Dashboard" description="Selamat datang di Sistem Database FK UNAND" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Dosen Aktif"
            value={stats.facultyCount}
            description="Dosen terdaftar di sistem"
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Indikator Kinerja"
            value={stats.performanceCount}
            description="Total indikator tercatat"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatsCard
            title="Upload Data"
            value={stats.uploadsCount}
            description="File berhasil diupload"
            icon={<FileSpreadsheet className="w-6 h-6" />}
          />
          <StatsCard
            title="Capaian Q{stats.currentQuarter}"
            value={`${achievementRate}%`}
            description={`${stats.achievedCount}/${stats.totalIndicators} tercapai`}
            icon={<Activity className="w-6 h-6" />}
            trend={achievementRate > 0 ? { value: achievementRate, isPositive: achievementRate >= 75 } : undefined}
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Quarter Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Status Kuartal {stats.currentQuarter} - {stats.currentYear}
              </CardTitle>
              <CardDescription>Ringkasan capaian kinerja dekan periode ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/20 text-accent">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Tercapai</p>
                      <p className="text-sm text-muted-foreground">Target terpenuhi</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-accent">{stats.achievedCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chart-3/20 text-chart-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Dalam Proses</p>
                      <p className="text-sm text-muted-foreground">Sedang berjalan</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-chart-3">{stats.totalIndicators - stats.achievedCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Total Indikator</p>
                      <p className="text-sm text-muted-foreground">Kuartal ini</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary">{stats.totalIndicators}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription>Log aktivitas sistem terkini</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Belum ada aktivitas tercatat</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.table_name && (
                            <Badge variant="outline" className="mr-2">
                              {activity.table_name}
                            </Badge>
                          )}
                          {new Date(activity.created_at).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Shortcut untuk tugas yang sering dilakukan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="/dashboard/performance"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Input Capaian Kinerja</p>
                  <p className="text-sm text-muted-foreground">Update data performa dekan</p>
                </div>
              </a>
              <a
                href="/dashboard/faculty"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Kelola Data Dosen</p>
                  <p className="text-sm text-muted-foreground">Tambah atau edit profil dosen</p>
                </div>
              </a>
              <a
                href="/dashboard/upload"
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-chart-3/10 text-chart-3">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Upload Excel</p>
                  <p className="text-sm text-muted-foreground">Import data dari file Excel</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
