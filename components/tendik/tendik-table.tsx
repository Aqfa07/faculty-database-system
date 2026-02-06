"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, AlertCircle } from "lucide-react"
import { ViewTendikDialog } from "./view-tendik-dialog"
import { EditTendikDialog } from "./edit-tendik-dialog"
import { DeleteTendikDialog } from "./delete-tendik-dialog"

interface TendikMember {
  id: string
  nip: string
  full_name: string
  gender?: string
  position: string
  department?: string
  rank_golongan?: string
  status_kepegawaian?: string
  penempatan_saat_ini?: string
  phone?: string
  email?: string
  is_active: boolean
}

interface TendikTableProps {
  searchQuery: string
  departmentFilter: string
  positionFilter: string
  statusFilter: string
  refreshTrigger: number
  onDataRefresh?: () => void
}

export function TendikTable({
  searchQuery,
  departmentFilter,
  positionFilter,
  statusFilter,
  refreshTrigger,
  onDataRefresh,
}: TendikTableProps) {
  const [tendikMembers, setTendikMembers] = useState<TendikMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTendik, setSelectedTendik] = useState<TendikMember | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rankFilter, setRankFilter] = useState<string>("") // Declare rankFilter variable

  useEffect(() => {
    const fetchTendikMembers = async () => {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("search", searchQuery)
        if (departmentFilter) params.append("department", departmentFilter)
        if (positionFilter) params.append("position", positionFilter)
        if (statusFilter) params.append("status", statusFilter)

        const response = await fetch(`/api/tendik?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setTendikMembers(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch tendik members:", error)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchTendikMembers()
  }, [searchQuery, departmentFilter, positionFilter, statusFilter, refreshTrigger])

  const handleEdit = (tendik: TendikMember) => {
    setSelectedTendik(tendik)
    setEditDialogOpen(true)
  }

  const handleDelete = (tendik: TendikMember) => {
    setSelectedTendik(tendik)
    setDeleteDialogOpen(true)
  }

  const handleView = (tendik: TendikMember) => {
    setSelectedTendik(tendik)
    setViewDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    onDataRefresh?.()
  }

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false)
    onDataRefresh?.()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tendikMembers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
            <p className="text-muted-foreground">Tidak ada data Tendik yang ditemukan</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Tendik</CardTitle>
          <CardDescription>Total: {tendikMembers.length} tenaga kependidikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Status Kepegawaian</TableHead>
                  <TableHead>Penempatan</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Aktif</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tendikMembers.map((tendik) => (
                  <TableRow key={tendik.id} className={!tendik.is_active ? "opacity-50" : ""}>
                    <TableCell className="font-mono text-sm">{tendik.nip}</TableCell>
                    <TableCell className="font-medium">{tendik.full_name}</TableCell>
                    <TableCell className="text-sm">{tendik.position}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tendik.status_kepegawaian === 'PNS' ? 'bg-blue-100 text-blue-800' :
                        tendik.status_kepegawaian === 'PTT' ? 'bg-amber-100 text-amber-800' :
                        tendik.status_kepegawaian === 'PHL' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tendik.status_kepegawaian || "PNS"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{tendik.penempatan_saat_ini || "-"}</TableCell>
                    <TableCell className="text-sm">{tendik.department || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tendik.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tendik.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(tendik)}
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tendik)}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(tendik)}
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedTendik && (
        <>
          <ViewTendikDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            tendik={selectedTendik}
          />
          <EditTendikDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            tendik={selectedTendik}
            onSuccess={handleEditSuccess}
          />
          <DeleteTendikDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            tendik={selectedTendik}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </>
  )
}
