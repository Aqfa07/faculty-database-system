"use client"

import React, { useState, useEffect } from "react"
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
}

interface EditDosenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dosen: DosenMember
  onSuccess?: () => void
}

export function EditDosenDialog({ open, onOpenChange, dosen, onSuccess }: EditDosenDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState(dosen)

  useEffect(() => {
    setFormData(dosen)
  }, [dosen, open])

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

    if (!formData.full_name) {
      setError("Silakan isi nama lengkap")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/dosen/${dosen.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal mengubah data Dosen")
      }

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
          <DialogTitle>Edit Data Dosen</DialogTitle>
          <DialogDescription>Ubah informasi data dosen</DialogDescription>
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
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Telepon</label>
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Nomor telepon"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          {formData.identification && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identifikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Jenis: {formData.identification.type}</p>
                  <p className="text-sm">Nomor: {formData.identification.number}</p>
                </div>
              </CardContent>
            </Card>
          )}

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
                    value={formData.department || ""}
                    onChange={handleInputChange}
                    placeholder="Departemen"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Jabatan Akademik</label>
                  <Input
                    name="academic_rank"
                    value={formData.academic_rank || ""}
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
                    value={formData.faculty_position || ""}
                    onChange={handleInputChange}
                    placeholder="Ketua Departemen, dll"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Kualifikasi</label>
                  <Input
                    name="qualification"
                    value={formData.qualification || ""}
                    onChange={handleInputChange}
                    placeholder="S1, S2, S3"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Spesialisasi</label>
                <Input
                  name="specialization"
                  value={formData.specialization || ""}
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
