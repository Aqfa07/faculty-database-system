"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Briefcase } from "lucide-react"

interface Stats {
  total: number
  active: number
  nidn_count: number
  nidk_count: number
}

export function DosenStats({ refreshTrigger }: { refreshTrigger: number }) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    nidn_count: 0,
    nidk_count: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dosen/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch dosen stats:", error)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchStats()
  }, [refreshTrigger])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Total dosen dan tenaga pengajar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dosen Aktif</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dosen NIDN</CardTitle>
          <Briefcase className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nidn_count}</div>
          <p className="text-xs text-muted-foreground">Dosen Nomor Identitas Dosen Nasional</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dosen NIDK</CardTitle>
          <Briefcase className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nidk_count}</div>
          <p className="text-xs text-muted-foreground">Dosen Nomor Identitas Dosen Khusus</p>
        </CardContent>
      </Card>
    </div>
  )
}
