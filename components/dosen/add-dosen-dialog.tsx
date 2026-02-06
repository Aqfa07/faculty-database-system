"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface AddDosenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddDosenDialog({ open, onOpenChange, onSuccess }: AddDosenDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    faculty_position: "",
    academic_rank: "",
    qualification: "",
    specialization: "",
    identification_type: "NIDN" as "NIDN" | "NIDK" | "NUPTK",
    identification_number: "",
    is_active: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.full_name || !formData.identification_number) {
      setError("Silakan isi nama lengkap dan nomor identifikasi")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/dosen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal menambah data Dosen")
      }

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        department: "",
        faculty_position: "",
        academic_rank: "",
        qualification: "",
        specialization: "",
        identification_type: "NIDN",
        identification_number: "",
        is_active: true,
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Data Dosen</DialogTitle>
          <DialogDescription>Tambahkan data dosen baru ke dalam sistem</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nama Lengkap *</label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap dosen"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Telepon</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nomor telepon"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Jenis Identifikasi *</label>
                  <select
                    name="identification_type"
                    value={formData.identification_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                    required
                  >
                    <option value="NIDN">NIDN - Nomor Identitas Dosen Nasional</option>
                    <option value="NIDK">NIDK - Nomor Identitas Dosen Khusus</option>
                    <option value="NUPTK">NUPTK - Nomor Unik Pendidik dan Tenaga Kependidikan</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nomor Identifikasi *</label>
                  <Input
                    name="identification_number"
                    value={formData.identification_number}
                    onChange={handleInputChange}
                    placeholder="Nomor identifikasi"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Akademik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Departemen</label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Departemen"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Jabatan Akademik</label>
                  <Input
                    name="academic_rank"
                    value={formData.academic_rank}
                    onChange={handleInputChange}
                    placeholder="Profesor, Dr., Ir., dll"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Posisi Fakultas</label>
                  <Input
                    name="faculty_position"
                    value={formData.faculty_position}
                    onChange={handleInputChange}
                    placeholder="Ketua Departemen, dll"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Kualifikasi</label>
                  <Input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="S1, S2, S3"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Spesialisasi</label>
                <Input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="Bidang keahlian atau spesialisasi"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked as boolean }))
                  }
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Data dosen aktif
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
