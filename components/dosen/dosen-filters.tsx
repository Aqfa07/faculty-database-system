"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface DosenFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  departmentFilter: string
  setDepartmentFilter: (dept: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  identificationFilter: string
  setIdentificationFilter: (id: string) => void
}

const departments = [
  "Semua Departemen",
  "Anatomi",
  "Fisiologi",
  "Biokimia",
  "Farmakologi",
  "Mikrobiologi",
  "Patologi",
  "Ilmu Kesehatan Masyarakat",
  "Kedokteran Klinis",
]

const statuses = ["Semua Status", "Aktif", "Non-Aktif", "Pensiunan"]
const identifications = ["Semua Identifikasi", "NIDN", "NIDK", "NUPTK"]

export function DosenFilters({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  identificationFilter,
  setIdentificationFilter,
}: DosenFiltersProps) {
  const hasActiveFilters = searchQuery || departmentFilter || statusFilter || identificationFilter

  const handleClearFilters = () => {
    setSearchQuery("")
    setDepartmentFilter("")
    setStatusFilter("")
    setIdentificationFilter("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Data Dosen</CardTitle>
        <CardDescription>Gunakan filter untuk mencari data dosen secara spesifik</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium mb-2 block">Cari Nama atau ID</label>
            <Input
              placeholder="Masukkan nama atau nomor identifikasi"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Departemen</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept === "Semua Departemen" ? "" : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
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

          {/* Identification Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Jenis Identifikasi</label>
            <select
              value={identificationFilter}
              onChange={(e) => setIdentificationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              {identifications.map((id) => (
                <option key={id} value={id === "Semua Identifikasi" ? "" : id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2 bg-transparent"
          >
            <X className="w-4 h-4" />
            Hapus Semua Filter
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
