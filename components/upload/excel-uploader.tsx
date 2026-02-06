"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExcelUploaderProps {
  tableName: "faculty_members" | "dean_performance"
  userId: string
}

export function ExcelUploader({ tableName, userId }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile)
      setResult(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const isValidFile = (file: File) => {
    const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
    return validTypes.includes(file.type) || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("tableName", tableName)
    formData.append("userId", userId)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload/excel", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message, count: data.count })
        setFile(null)
        router.refresh()
      } else {
        setResult({ success: false, message: data.error || "Upload gagal" })
      }
    } catch (error) {
      setResult({ success: false, message: "Terjadi kesalahan saat upload" })
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          file && "border-primary bg-primary/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet className="w-10 h-10 text-primary" />
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-2" onClick={clearFile} disabled={isUploading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop file Excel di sini</p>
            <p className="text-xs text-muted-foreground">atau klik untuk memilih file</p>
          </div>
        )}
      </div>

      {/* Progress */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">Memproses file... {progress}%</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg",
            result.success ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive",
          )}
        >
          {result.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm">
            {result.message}
            {result.count !== undefined && ` (${result.count} data)`}
          </span>
        </div>
      )}

      {/* Upload Button */}
      <Button className="w-full" onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Mengupload..." : "Upload File"}
      </Button>
    </div>
  )
}
