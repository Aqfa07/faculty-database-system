"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PERFORMANCE_CATEGORIES, QUARTERS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface PerformanceFiltersProps {
  currentYear: number
  currentQuarter: number
  currentCategory: string
}

export function PerformanceFilters({ currentYear, currentQuarter, currentCategory }: PerformanceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/dashboard/performance?${params.toString()}`)
  }

  const resetFilters = () => {
    router.push("/dashboard/performance")
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={currentYear.toString()} onValueChange={(v) => updateFilter("year", v)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentQuarter.toString()} onValueChange={(v) => updateFilter("quarter", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Kuartal" />
        </SelectTrigger>
        <SelectContent>
          {QUARTERS.map((q) => (
            <SelectItem key={q.value} value={q.value.toString()}>
              {q.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentCategory || "all"} onValueChange={(v) => updateFilter("category", v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {PERFORMANCE_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset Filter">
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  )
}
