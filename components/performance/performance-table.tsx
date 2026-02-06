"use client"

import { useState } from "react"
import type { DeanPerformance } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditPerformanceDialog } from "./edit-performance-dialog"
import { DeletePerformanceDialog } from "./delete-performance-dialog"

interface PerformanceTableProps {
  data: DeanPerformance[]
  canEdit: boolean
  userId: string
}

const statusConfig = {
  achieved: { label: "Tercapai", variant: "default" as const, className: "bg-accent text-accent-foreground" },
  on_track: { label: "On Track", variant: "secondary" as const, className: "bg-primary text-primary-foreground" },
  pending: { label: "Pending", variant: "outline" as const, className: "" },
  not_achieved: {
    label: "Tidak Tercapai",
    variant: "destructive" as const,
    className: "bg-destructive text-destructive-foreground",
  },
}

export function PerformanceTable({ data, canEdit, userId }: PerformanceTableProps) {
  const [editItem, setEditItem] = useState<DeanPerformance | null>(null)
  const [deleteItem, setDeleteItem] = useState<DeanPerformance | null>(null)

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada data kinerja untuk periode ini.</p>
        {canEdit && <p className="text-sm text-muted-foreground mt-1">Klik tombol "Tambah Indikator" untuk memulai.</p>}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-40">Kategori</TableHead>
              <TableHead>Indikator</TableHead>
              <TableHead className="w-24 text-right">Target</TableHead>
              <TableHead className="w-24 text-right">Capaian</TableHead>
              <TableHead className="w-20">Satuan</TableHead>
              <TableHead className="w-32">Status</TableHead>
              {canEdit && <TableHead className="w-20 text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const status = statusConfig[item.status]
              const progress =
                item.target_value && item.achieved_value
                  ? Math.round((item.achieved_value / item.target_value) * 100)
                  : 0

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>
                    <div>
                      <p>{item.indicator}</p>
                      {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.target_value ?? "-"}</TableCell>
                  <TableCell className="text-right font-mono">{item.achieved_value ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{item.unit || "-"}</TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                    {progress > 0 && <span className="text-xs text-muted-foreground ml-2">{progress}%</span>}
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditItem(item)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteItem(item)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {editItem && (
        <EditPerformanceDialog
          item={editItem}
          userId={userId}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <DeletePerformanceDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}
    </>
  )
}
