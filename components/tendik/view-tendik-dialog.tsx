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

interface TendikMember {
  id: string
  nip: string
  full_name: string
  gender?: string
  place_of_birth?: string
  date_of_birth?: string
  retirement_date?: string
  email?: string
  phone?: string
  position: string
  department?: string
  rank_golongan?: string
  rank_tmt?: string
  education_level?: string
  education_field?: string
  graduation_year?: number
  years_of_service?: number
  duty_unit?: string
  appointment_date?: string
  is_active: boolean
}

interface ViewTendikDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tendik: TendikMember
}

export function ViewTendikDialog({ open, onOpenChange, tendik }: ViewTendikDialogProps) {
  const formatDate = (date?: string) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Tendik</DialogTitle>
          <DialogDescription>Informasi lengkap tenaga kependidikan</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">NIP</p>
                <p className="font-mono text-sm font-medium">{tendik.nip}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-medium">{tendik.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-sm">{tendik.gender === "L" ? "Laki-laki" : "Perempuan"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempat Lahir</p>
                <p className="text-sm">{tendik.place_of_birth || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                <p className="text-sm">{formatDate(tendik.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{tendik.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="text-sm">{tendik.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={tendik.is_active ? "default" : "destructive"}>
                  {tendik.is_active ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Position & Department */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jabatan & Departemen</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Jabatan</p>
                <p className="font-medium">{tendik.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Kerja</p>
                <p className="text-sm">{tendik.department || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Golongan</p>
                <p className="text-sm font-mono">{tendik.rank_golongan || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TMT Golongan</p>
                <p className="text-sm">{formatDate(tendik.rank_tmt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Tugas</p>
                <p className="text-sm">{tendik.duty_unit || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pengangkatan</p>
                <p className="text-sm">{formatDate(tendik.appointment_date)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pendidikan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tingkat Pendidikan</p>
                <p className="text-sm">{tendik.education_level || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bidang Studi</p>
                <p className="text-sm">{tendik.education_field || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tahun Lulus</p>
                <p className="text-sm">{tendik.graduation_year || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Masa Kerja (Tahun)</p>
                <p className="text-sm">{tendik.years_of_service || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Retirement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pensiun</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pensiun</p>
                <p className="text-sm font-medium">{formatDate(tendik.retirement_date)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
