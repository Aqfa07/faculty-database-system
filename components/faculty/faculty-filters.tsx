"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DEPARTMENTS, ACADEMIC_RANKS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RotateCcw, Search } from "lucide-react"
import { useState } from "react"

interface FacultyFiltersProps {
  currentDepartment: string
  currentRank: string
  currentSearch: string
}

export function FacultyFilters({ currentDepartment, currentRank, currentSearch }: FacultyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch)

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/dashboard/faculty?${params.toString()}`)
  }

  const handleSearch = () => {
    updateFilter("search", searchValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const resetFilters = () => {
    setSearchValue("")
    router.push("/dashboard/faculty")
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama/NIP/NIDN..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 w-64"
        />
      </div>

      <Select value={currentDepartment || "all"} onValueChange={(v) => updateFilter("department", v)}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Departemen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Departemen</SelectItem>
          {DEPARTMENTS.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentRank || "all"} onValueChange={(v) => updateFilter("rank", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Jabatan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Jabatan</SelectItem>
          {ACADEMIC_RANKS.map((rank) => (
            <SelectItem key={rank} value={rank}>
              {rank}
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
