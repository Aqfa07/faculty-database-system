import type { DeanPerformance } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertTriangle, Target } from "lucide-react"

interface PerformanceStatsProps {
  data: DeanPerformance[]
  year: number
  quarter: number
}

export function PerformanceStats({ data, year, quarter }: PerformanceStatsProps) {
  const achieved = data.filter((d) => d.status === "achieved").length
  const onTrack = data.filter((d) => d.status === "on_track").length
  const pending = data.filter((d) => d.status === "pending").length
  const notAchieved = data.filter((d) => d.status === "not_achieved").length
  const total = data.length

  const achievementRate = total > 0 ? Math.round((achieved / total) * 100) : 0

  const stats = [
    {
      label: "Tercapai",
      value: achieved,
      icon: CheckCircle2,
      color: "text-accent bg-accent/10",
    },
    {
      label: "On Track",
      value: onTrack,
      icon: Target,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-chart-3 bg-chart-3/10",
    },
    {
      label: "Tidak Tercapai",
      value: notAchieved,
      icon: AlertTriangle,
      color: "text-destructive bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
