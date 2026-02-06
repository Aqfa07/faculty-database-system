"use client"

import React from "react"

import { useState } from "react"
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

interface AddTendikDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddTendikDialog({ open, onOpenChange, onSuccess }: AddTendikDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nip: "",
    full_name: "",
    gender: "L",
    place_of_birth: "",
    date_of_birth: "",
    retirement_date: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    rank_golongan: "",
    rank_tmt: "",
    education_level: "",
    education_field: "",
    graduation_year: "",
    years_of_service: "",
    duty_unit: "",
    appointment_date: "",
    status_kepegawaian: "PNS",
    penempatan_saat_ini: "",
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

    if (!formData.nip || !formData.full_name || !formData.position) {
      setError("Silakan isi NIP, nama, dan jabatan")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/tendik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal menambah data Tendik")
      }

      setFormData({
        nip: "",
        full_name: "",
        gender: "L",
        place_of_birth: "",
        date_of_birth: "",
        retirement_date: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        rank_golongan: "",
        rank_tmt: "",
        education_level: "",
        education_field: "",
        graduation_year: "",
        years_of_service: "",
        duty_unit: "",
        appointment_date: "",
        status_kepegawaian: "PNS",
        penempatan_saat_ini: "",
        is_active: true,
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Tendik Baru</DialogTitle>
          <DialogDescription>Masukkan informasi tenaga kependidikan baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">NIP *</label>
                  <Input
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    placeholder="Nomor Induk Pegawai"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Lengkap *</label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tempat Lahir</label>
                  <Input
                    name="place_of_birth"
                    value={formData.place_of_birth}
                    onChange={handleInputChange}
                    placeholder="Tempat lahir"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tanggal Lahir</label>
                  <Input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Telepon</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nomor telepon"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tanggal Pensiun</label>
                  <Input
                    name="retirement_date"
                    type="date"
                    value={formData.retirement_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position & Department */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jabatan & Status Kepegawaian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Jabatan *</label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Jabatan"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status Kepegawaian</label>
                  <select
                    name="status_kepegawaian"
                    value={formData.status_kepegawaian}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PTT">PTT</option>
                    <option value="PHL">PHL</option>
                    <option value="Kontrak">Kontrak</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Penempatan Saat Ini</label>
                <Input
                  name="penempatan_saat_ini"
                  value={formData.penempatan_saat_ini}
                  onChange={handleInputChange}
                  placeholder="Lokasi penempatan saat ini"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Departemen/Unit</label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Departemen/Unit"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Golongan</label>
                  <Input
                    name="rank_golongan"
                    value={formData.rank_golongan}
                    onChange={handleInputChange}
                    placeholder="Golongan (contoh: III/a)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">TMT Golongan</label>
                  <Input
                    name="rank_tmt"
                    type="date"
                    value={formData.rank_tmt}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tanggal Pengangkatan</label>
                  <Input
                    name="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Unit Tugas</label>
                <Input
                  name="duty_unit"
                  value={formData.duty_unit}
                  onChange={handleInputChange}
                  placeholder="Unit tugas"
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pendidikan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tingkat Pendidikan</label>
                  <Input
                    name="education_level"
                    value={formData.education_level}
                    onChange={handleInputChange}
                    placeholder="S1, D3, dsb"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Bidang Studi</label>
                  <Input
                    name="education_field"
                    value={formData.education_field}
                    onChange={handleInputChange}
                    placeholder="Bidang studi"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tahun Lulus</label>
                  <Input
                    name="graduation_year"
                    type="number"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Masa Kerja (Tahun)</label>
                  <Input
                    name="years_of_service"
                    type="number"
                    value={formData.years_of_service}
                    onChange={handleInputChange}
                    placeholder="Tahun"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">Aktif</span>
              </label>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
