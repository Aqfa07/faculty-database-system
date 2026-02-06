"use client"

import { useState } from "react"
import type { FacultyMember } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, MoreHorizontal, Eye, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditFacultyDialog } from "./edit-faculty-dialog"
import { DeleteFacultyDialog } from "./delete-faculty-dialog"
import { ViewFacultyDialog } from "./view-faculty-dialog"

interface FacultyTableProps {
  data: FacultyMember[]
  canEdit: boolean
  userId: string
}

export function FacultyTable({ data, canEdit, userId }: FacultyTableProps) {
  const [editItem, setEditItem] = useState<FacultyMember | null>(null)
  const [deleteItem, setDeleteItem] = useState<FacultyMember | null>(null)
  const [viewItem, setViewItem] = useState<FacultyMember | null>(null)

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tidak ada data dosen yang ditemukan.</p>
        {canEdit && <p className="text-sm text-muted-foreground mt-1">Klik tombol "Tambah Dosen" untuk memulai.</p>}
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-72">Nama</TableHead>
              <TableHead className="w-32">NIP</TableHead>
              <TableHead className="w-48">Departemen</TableHead>
              <TableHead className="w-32">Jabatan</TableHead>
              <TableHead className="w-40">Kontak</TableHead>
              <TableHead className="w-20 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={item.photo_url || undefined} alt={item.full_name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(item.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.full_name}</p>
                      {item.specialization && (
                        <p className="text-xs text-muted-foreground truncate max-w-48">{item.specialization}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{item.nip}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="truncate max-w-40">
                    {item.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.academic_rank ? (
                    <Badge variant="secondary">{item.academic_rank}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {item.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-28">{item.email}</span>
                      </div>
                    )}
                    {item.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{item.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewItem(item)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      {canEdit && (
                        <>
                          <DropdownMenuItem onClick={() => setEditItem(item)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteItem(item)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {viewItem && (
        <ViewFacultyDialog item={viewItem} open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)} />
      )}

      {editItem && (
        <EditFacultyDialog
          item={editItem}
          userId={userId}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <DeleteFacultyDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        />
      )}
    </>
  )
}
