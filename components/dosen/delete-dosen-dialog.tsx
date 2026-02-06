"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Trash2 } from "lucide-react"

interface Identification {
  type: "NIDN" | "NIDK" | "NUPTK"
  number: string
}

interface DosenMember {
  id: string
  full_name: string
  department?: string
  identification?: Identification
}

interface DeleteDosenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dosen: DosenMember
  onSuccess?: () => void
}

export function DeleteDosenDialog({ open, onOpenChange, dosen, onSuccess }: DeleteDosenDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/dosen/${dosen.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal menghapus data Dosen")
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Hapus Data Dosen
          </DialogTitle>
          <DialogDescription>
            Aksi ini tidak dapat dibatalkan. Pastikan Anda yakin ingin menghapus data ini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nama</p>
              <p className="font-semibold">{dosen.full_name}</p>
            </div>
            {dosen.identification && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Identifikasi</p>
                <p className="font-semibold">{dosen.identification.type}: {dosen.identification.number}</p>
              </div>
            )}
            {dosen.department && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departemen</p>
                <p className="font-semibold">{dosen.department}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading} className="gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
