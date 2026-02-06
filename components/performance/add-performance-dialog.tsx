"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { PERFORMANCE_CATEGORIES } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface AddPerformanceDialogProps {
  year: number
  quarter: number
  userId: string
}

export function AddPerformanceDialog({ year, quarter, userId }: AddPerformanceDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    category: "",
    indicator: "",
    target_value: "",
    achieved_value: "",
    unit: "",
    notes: "",
    status: "pending",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("dean_performance").insert({
        year,
        quarter,
        category: formData.category,
        indicator: formData.indicator,
        target_value: formData.target_value ? Number.parseFloat(formData.target_value) : null,
        achieved_value: formData.achieved_value ? Number.parseFloat(formData.achieved_value) : null,
        unit: formData.unit || null,
        notes: formData.notes || null,
        status: formData.status,
        created_by: userId,
        updated_by: userId,
      })

      if (error) throw error

      // Log activity
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action: `Menambahkan indikator kinerja: ${formData.indicator}`,
        table_name: "dean_performance",
        new_data: formData,
      })

      setOpen(false)
      setFormData({
        category: "",
        indicator: "",
        target_value: "",
        achieved_value: "",
        unit: "",
        notes: "",
        status: "pending",
      })
      router.refresh()
    } catch (error) {
      console.error("Error adding performance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Indikator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Indikator Kinerja</DialogTitle>
          <DialogDescription>
            Tambahkan indikator kinerja baru untuk Q{quarter} {year}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {PERFORMANCE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicator">Indikator *</Label>
            <Input
              id="indicator"
              value={formData.indicator}
              onChange={(e) => setFormData({ ...formData, indicator: e.target.value })}
              placeholder="Nama indikator kinerja"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achieved">Capaian</Label>
              <Input
                id="achieved"
                type="number"
                step="0.01"
                value={formData.achieved_value}
                onChange={(e) => setFormData({ ...formData, achieved_value: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="%"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="on_track">On Track</SelectItem>
                <SelectItem value="achieved">Tercapai</SelectItem>
                <SelectItem value="not_achieved">Tidak Tercapai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
