"use client"

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
import { AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DeletePerformanceDialogProps {
  item: DeanPerformance
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePerformanceDialog({ item, open, onOpenChange }: DeletePerformanceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("dean_performance").delete().eq("id", item.id)

      if (error) throw error

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting performance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Hapus Indikator</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Apakah Anda yakin ingin menghapus indikator <strong>&quot;{item.indicator}&quot;</strong>? Tindakan ini
            tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
