"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { FacultyMember } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DEPARTMENTS, ACADEMIC_RANKS } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EditFacultyDialogProps {
  item: FacultyMember
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFacultyDialog({ item, userId, open, onOpenChange }: EditFacultyDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    nip: item.nip,
    nidn: item.nidn || "",
    full_name: item.full_name,
    email: item.email || "",
    phone: item.phone || "",
    department: item.department,
    position: item.position || "",
    academic_rank: item.academic_rank || "",
    specialization: item.specialization || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const updateData = {
        ...formData,
        nidn: formData.nidn || null,
        email: formData.email || null,
        phone: formData.phone || null,
        position: formData.position || null,
        academic_rank: formData.academic_rank || null,
        specialization: formData.specialization || null,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("faculty_members").update(updateData).eq("id", item.id)

      if (error) throw error

      // Log activity
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action: `Mengupdate data dosen: ${formData.full_name}`,
        table_name: "faculty_members",
        record_id: item.id,
        old_data: item,
        new_data: updateData,
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating faculty:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Data Dosen</DialogTitle>
          <DialogDescription>Perbarui informasi dosen</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Data Dasar</TabsTrigger>
              <TabsTrigger value="academic">Data Akademik</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP *</Label>
                  <Input
                    id="nip"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Nomor Induk Pegawai"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nidn">NIDN</Label>
                  <Input
                    id="nidn"
                    value={formData.nidn}
                    onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                    placeholder="Nomor Induk Dosen Nasional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nama lengkap dengan gelar"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@fk.unand.ac.id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="department">Departemen *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) => setFormData({ ...formData, department: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Jabatan Struktural</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Contoh: Kepala Departemen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic_rank">Jabatan Fungsional</Label>
                  <Select
                    value={formData.academic_rank}
                    onValueChange={(v) => setFormData({ ...formData, academic_rank: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_RANKS.map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Spesialisasi/Keahlian</Label>
                <Textarea
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Bidang keahlian atau spesialisasi"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
