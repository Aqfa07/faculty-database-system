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
import { ViewDosenDialog } from "./view-dosen-dialog"
import { EditDosenDialog } from "./edit-dosen-dialog"
import { DeleteDosenDialog } from "./delete-dosen-dialog"

interface Identification {
  type: "NIDN" | "NIDK" | "NUPTK"
  number: string
}

interface DosenMember {
  id: string
  full_name: string
  email?: string
  phone?: string
  department?: string
  faculty_position?: string
  academic_rank?: string
  identification?: Identification
  is_active: boolean
  created_at?: string
}

interface DosenTableProps {
  searchQuery: string
  departmentFilter: string
  statusFilter: string
  identificationFilter: string
  refreshTrigger: number
  onDataRefresh?: () => void
}

export function DosenTable({
  searchQuery,
  departmentFilter,
  statusFilter,
  identificationFilter,
  refreshTrigger,
  onDataRefresh,
}: DosenTableProps) {
  const [dosenMembers, setDosenMembers] = useState<DosenMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDosen, setSelectedDosen] = useState<DosenMember | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchDosenMembers = async () => {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("search", searchQuery)
        if (departmentFilter) params.append("department", departmentFilter)
        if (statusFilter) params.append("status", statusFilter)
        if (identificationFilter) params.append("identification", identificationFilter)

        const response = await fetch(`/api/dosen?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setDosenMembers(data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch dosen members:", error)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchDosenMembers()
  }, [searchQuery, departmentFilter, statusFilter, identificationFilter, refreshTrigger])

  const handleEdit = (dosen: DosenMember) => {
    setSelectedDosen(dosen)
    setEditDialogOpen(true)
  }

  const handleDelete = (dosen: DosenMember) => {
    setSelectedDosen(dosen)
    setDeleteDialogOpen(true)
  }

  const handleView = (dosen: DosenMember) => {
    setSelectedDosen(dosen)
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

  if (dosenMembers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
            <p className="text-muted-foreground">Tidak ada data Dosen yang ditemukan</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Dosen</CardTitle>
          <CardDescription>Total: {dosenMembers.length} dosen dan tenaga pengajar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifikasi</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Jabatan Akademik</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenMembers.map((dosen) => (
                  <TableRow key={dosen.id} className={!dosen.is_active ? "opacity-50" : ""}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex flex-col gap-1">
                        {dosen.identification && (
                          <>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit ${
                              dosen.identification.type === 'NIDN' ? 'bg-blue-100 text-blue-800' :
                              dosen.identification.type === 'NIDK' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {dosen.identification.type}
                            </span>
                            <span className="text-xs">{dosen.identification.number}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{dosen.full_name}</TableCell>
                    <TableCell className="text-sm">{dosen.email || "-"}</TableCell>
                    <TableCell className="text-sm">{dosen.department || "-"}</TableCell>
                    <TableCell className="text-sm">{dosen.faculty_position || dosen.academic_rank || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dosen.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dosen.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(dosen)}
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(dosen)}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(dosen)}
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
      {selectedDosen && (
        <>
          <ViewDosenDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            dosen={selectedDosen}
          />
          <EditDosenDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            dosen={selectedDosen}
            onSuccess={handleEditSuccess}
          />
          <DeleteDosenDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            dosen={selectedDosen}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </>
  )
}
