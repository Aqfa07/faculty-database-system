"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { DeanPerformance } from "@/lib/types"
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
import { PERFORMANCE_CATEGORIES } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface EditPerformanceDialogProps {
  item: DeanPerformance
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPerformanceDialog({ item, userId, open, onOpenChange }: EditPerformanceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    category: item.category,
    indicator: item.indicator,
    target_value: item.target_value?.toString() || "",
    achieved_value: item.achieved_value?.toString() || "",
    unit: item.unit || "",
    notes: item.notes || "",
    status: item.status,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const updateData = {
        category: formData.category,
        indicator: formData.indicator,
        target_value: formData.target_value ? Number.parseFloat(formData.target_value) : null,
        achieved_value: formData.achieved_value ? Number.parseFloat(formData.achieved_value) : null,
        unit: formData.unit || null,
        notes: formData.notes || null,
        status: formData.status,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("dean_performance").update(updateData).eq("id", item.id)

      if (error) throw error

      // Log activity
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action: `Mengupdate indikator kinerja: ${formData.indicator}`,
        table_name: "dean_performance",
        record_id: item.id,
        old_data: item,
        new_data: updateData,
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating performance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Indikator Kinerja</DialogTitle>
          <DialogDescription>Perbarui data indikator kinerja</DialogDescription>
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
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v as DeanPerformance["status"] })}
            >
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
