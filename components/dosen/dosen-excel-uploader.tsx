"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, CheckCircle2, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadResult {
  success: boolean
  message: string
  success_count: number
  error_count: number
  errors?: string[]
}

interface DosenExcelUploaderProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function DosenExcelUploader({
  open,
  onOpenChange,
  onSuccess,
}: DosenExcelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return

    const file = files[0]
    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      setError("Format file harus Excel (.xlsx, .xls) atau CSV (.csv)")
      return
    }

    setError("")
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload/dosen", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Gagal upload file")
      }

      setResult(data)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat upload")
      setResult(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleClose = () => {
    setResult(null)
    setError("")
    setIsDragging(false)
    onOpenChange?.(false)
  }

  const dialogOpen = open !== undefined ? open : true

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Data Dosen</DialogTitle>
          <DialogDescription>
            Impor data dosen dari file Excel (NIDN/NIDK)
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <Alert className={result.error_count === 0 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
              <CheckCircle2 className={result.error_count === 0 ? "text-green-600" : "text-amber-600"} />
              <AlertDescription className={result.error_count === 0 ? "text-green-800" : "text-amber-800"}>
                {result.success_count} data berhasil{result.error_count > 0 && `, ${result.error_count} gagal`}
              </AlertDescription>
            </Alert>

            {result.errors && result.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Ada {result.errors.length} baris dengan error:</p>
                  <ul className="space-y-1 text-xs">
                    {result.errors.slice(0, 3).map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                    {result.errors.length > 3 && (
                      <li className="text-amber-600">... dan {result.errors.length - 3} error lainnya</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleClose} className="w-full">
              Selesai
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Upload Area - Compact */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div onClick={() => fileInputRef.current?.click()} className="space-y-2">
                <Upload className="w-6 h-6 mx-auto text-primary" />
                <div>
                  <p className="text-sm font-medium">Tarik file atau klik untuk pilih</p>
                  <p className="text-xs text-muted-foreground">Format: .xlsx, .xls, atau .csv</p>
                </div>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={50} className="h-1" />
                <p className="text-xs text-center text-muted-foreground">
                  Memproses file...
                </p>
              </div>
            )}

            {/* Validation Requirements - Compact */}
            <Alert className="bg-blue-50 border-blue-200 p-3">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-900 ml-2">
                <div className="space-y-1">
                  <p className="font-medium">Validasi Data Wajib:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><span className="font-medium">Nama:</span> Harus ada di setiap baris</li>
                    <li><span className="font-medium">NIDK/NIDN:</span> Nomor identifikasi wajib diisi</li>
                    <li><span className="font-medium">Format Excel:</span> Pastikan header tidak tercampur dengan data</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Format Info - Compact */}
            <Alert className="bg-amber-50 border-amber-200 p-3">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-900 ml-2">
                <p className="font-medium mb-1">Format File yang Benar:</p>
                <div className="space-y-0.5 text-amber-800">
                  <p>Kolom minimum: <span className="font-mono bg-white px-1 rounded">Nama, NIDK/NIDN</span></p>
                  <p>Sistem otomatis mengenali: NIDN (biru), NIDK (hijau)</p>
                  <p>Hapus baris header yang tidak perlu sebelum upload</p>
                </div>
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
              variant="outline"
              size="sm"
            >
              {uploading ? "Mengupload..." : "Pilih File"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
