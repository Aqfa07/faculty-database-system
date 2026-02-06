"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface TendikFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  departmentFilter: string
  setDepartmentFilter: (dept: string) => void
  positionFilter: string
  setPositionFilter: (pos: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  rankFilter: string
  setRankFilter: (rank: string) => void
}

const departments = [
  "All Departments",
  "Administrasi Akademik",
  "Administrasi Keuangan",
  "Perpustakaan",
  "Laboratorium",
  "Klinik",
  "Keamanan",
  "Kebersihan",
  "Maintenance",
]

const positions = [
  "All Positions",
  "Pengadministrasi Akademik",
  "Pengadministrasi Keuangan",
  "Teknisi Peralatan Kantor",
  "Pustakawan Mahir",
  "Perawat Pelaksana",
  "Petugas Keamanan",
  "Pengemudi",
  "Pramu Bakti",
]

const statuses = ["Semua Status", "PNS", "PTT", "PHL", "Kontrak"]

const ranks = [
  "All Ranks",
  "I/a",
  "I/b",
  "I/c",
  "II/a",
  "II/b",
  "II/c",
  "III/a",
  "III/b",
  "III/c",
  "IV/a",
  "IV/b",
  "IV/c",
]

export function TendikFilters({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  positionFilter,
  setPositionFilter,
  statusFilter,
  setStatusFilter,
  rankFilter,
  setRankFilter,
}: TendikFiltersProps) {
  const hasActiveFilters = searchQuery || departmentFilter || positionFilter || statusFilter || rankFilter

  const handleClearFilters = () => {
    setSearchQuery("")
    setDepartmentFilter("")
    setPositionFilter("")
    setStatusFilter("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Lanjutan</CardTitle>
        <CardDescription>Cari dan filter data Tendik berdasarkan kriteria spesifik</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium mb-2 block">Cari Nama atau NIP</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ketik nama atau NIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Department Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Unit/Departemen</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept === "All Departments" ? "" : dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Position Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Jabatan</label>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos === "All Positions" ? "" : pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {/* Status Kepegawaian Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Status Kepegawaian</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            {statuses.map((status) => (
              <option key={status} value={status === "Semua Status" ? "" : status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full gap-2 bg-transparent"
            onClick={handleClearFilters}
          >
            <X className="w-4 h-4" />
            Hapus Filter
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
