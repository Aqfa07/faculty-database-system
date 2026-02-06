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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, AlertCircle, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TendikExcelUploaderProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function TendikExcelUploader({
  open = false,
  onOpenChange,
  onSuccess,
}: TendikExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [uploadStats, setUploadStats] = useState({ created: 0, updated: 0, failed: 0 })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls") || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
        setUploadStatus("idle")
        setUploadMessage("")
      } else {
        setUploadStatus("error")
        setUploadMessage("Hanya file Excel (.xlsx, .xls) atau CSV (.csv) yang diizinkan")
      }
    }
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/templates/tendik")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "Template_Data_Tendik.xlsx"
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("[v0] Failed to download template:", error)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("error")
      setUploadMessage("Silakan pilih file terlebih dahulu")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "tendik")

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            setUploadStatus("success")
            setUploadMessage(response.message || "File berhasil diunggah")
            setUploadStats(response.stats || { created: 0, updated: 0, failed: 0 })
            setFile(null)
            setTimeout(() => {
              onSuccess?.()
              onOpenChange?.(false)
            }, 2000)
          } catch {
            setUploadStatus("error")
            setUploadMessage("Error parsing response dari server")
          }
        } else {
          const errorData = JSON.parse(xhr.responseText)
          setUploadStatus("error")
          setUploadMessage(errorData.error || "Gagal mengunggah file")
        }
      })

      xhr.addEventListener("error", () => {
        setUploadStatus("error")
        setUploadMessage("Gagal menghubungi server")
      })

      xhr.open("POST", "/api/upload/tendik")
      xhr.send(formData)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadStatus("error")
      setUploadMessage("Terjadi kesalahan saat mengunggah file")
    } finally {
      setUploading(false)
    }
  }

  if (onOpenChange === undefined) {
    // Standalone mode - render as card
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload Data Tendik</CardTitle>
          <CardDescription>Unggah file Excel untuk import data tenaga kependidikan secara massal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih File</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{file ? file.name : "Drag file atau klik untuk memilih"}</p>
                <p className="text-xs text-muted-foreground mt-1">Format: Excel (.xlsx, .xls) atau CSV (.csv)</p>
              </label>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Progress: {Math.round(uploadProgress)}%</p>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{uploadMessage}</AlertDescription>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-green-700">
                <div>Ditambah: {uploadStats.created}</div>
                <div>Diperbarui: {uploadStats.updated}</div>
                <div>Gagal: {uploadStats.failed}</div>
              </div>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{uploadMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={downloadTemplate} variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="gap-2 flex-1"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Mengunggah..." : "Upload File"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Dialog mode
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Data Tendik</DialogTitle>
          <DialogDescription>Unggah file Excel untuk import data tenaga kependidikan</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih File</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="dialog-file-input"
              />
              <label htmlFor="dialog-file-input" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{file ? file.name : "Klik untuk memilih file"}</p>
                <p className="text-xs text-muted-foreground mt-1">.xlsx, .xls, atau .csv</p>
              </label>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Progress: {Math.round(uploadProgress)}%</p>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{uploadMessage}</AlertDescription>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-green-700">
                <div>Ditambah: {uploadStats.created}</div>
                <div>Diperbarui: {uploadStats.updated}</div>
                <div>Gagal: {uploadStats.failed}</div>
              </div>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{uploadMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={downloadTemplate} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="w-3 h-3" />
              Template
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="gap-2 flex-1"
              size="sm"
            >
              <Upload className="w-3 h-3" />
              {uploading ? "Mengunggah..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
