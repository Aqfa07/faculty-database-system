"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Briefcase } from "lucide-react"

interface TendikStatsProps {
  refreshTrigger: number
}

interface Stats {
  total: number
  active: number
  inactive: number
  positions: number
}

export function TendikStats({ refreshTrigger }: TendikStatsProps) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
    positions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/tendik/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch tendik stats:", error)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchStats()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tendik</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Aktif</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive */}
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tidak Aktif</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <UserX className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions */}
      <Card className="border-l-4 border-l-accent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jenis Jabatan</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.positions}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
