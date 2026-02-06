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

interface TendikMember {
  id: string
  nip: string
  full_name: string
  position: string
}

interface DeleteTendikDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tendik: TendikMember
  onSuccess?: () => void
}

export function DeleteTendikDialog({
  open,
  onOpenChange,
  tendik,
  onSuccess,
}: DeleteTendikDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/tendik/${tendik.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Gagal menghapus data Tendik")
      }

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Data Tendik</DialogTitle>
          <DialogDescription>Tindakan ini tidak dapat dibatalkan</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-foreground mb-2">
              Anda akan menghapus data Tendik berikut:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">NIP:</span> {tendik.nip}
              </p>
              <p>
                <span className="font-medium">Nama:</span> {tendik.full_name}
              </p>
              <p>
                <span className="font-medium">Jabatan:</span> {tendik.position}
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Data yang dihapus tidak dapat dipulihkan. Pastikan Anda yakin sebelum melanjutkan.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Trash2 className="w-4 h-4" />
            Hapus Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
