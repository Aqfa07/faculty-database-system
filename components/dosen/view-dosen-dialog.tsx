"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  qualification?: string
  specialization?: string
  identification?: Identification
  is_active: boolean
  created_at?: string
}

interface ViewDosenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dosen: DosenMember
}

export function ViewDosenDialog({ open, onOpenChange, dosen }: ViewDosenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Data Dosen</DialogTitle>
          <DialogDescription>Informasi lengkap profil dosen</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                  <p className="text-sm font-semibold">{dosen.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={dosen.is_active ? "default" : "secondary"}>
                    {dosen.is_active ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{dosen.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                  <p className="text-sm">{dosen.phone || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          {dosen.identification && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jenis Identifikasi</p>
                    <Badge>{dosen.identification.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nomor</p>
                    <p className="text-sm font-mono">{dosen.identification.number}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Akademik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departemen</p>
                  <p className="text-sm">{dosen.department || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jabatan Akademik</p>
                  <p className="text-sm">{dosen.academic_rank || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posisi Fakultas</p>
                  <p className="text-sm">{dosen.faculty_position || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kualifikasi</p>
                  <p className="text-sm">{dosen.qualification || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Spesialisasi</p>
                <p className="text-sm">{dosen.specialization || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
