"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"
import { DosenFilters } from "@/components/dosen/dosen-filters"
import { DosenTable } from "@/components/dosen/dosen-table"
import { DosenStats } from "@/components/dosen/dosen-stats"
import { AddDosenDialog } from "@/components/dosen/add-dosen-dialog"
import { DosenExcelUploader } from "@/components/dosen/dosen-excel-uploader"

export default function DosenPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [identificationFilter, setIdentificationFilter] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleUploadSuccess = () => {
    setIsUploadDialogOpen(false)
    setRefreshTrigger((prev) => prev + 1)
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/templates/dosen")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "Template_Data_Dosen.xlsx"
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("[v0] Failed to download template:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen p-4 md:p-6 bg-background">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Dosen</h1>
            <p className="text-sm text-muted-foreground">Manajemen Data Dosen dan Tenaga Pengajar FK UNAND</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Data
            </Button>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              variant="outline"
              className="gap-2"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              Upload Excel
            </Button>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="gap-2 bg-transparent"
              size="sm"
            >
              <Download className="w-4 h-4" />
              Template
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <DosenStats refreshTrigger={refreshTrigger} />

      {/* Main Content with Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="list">Daftar Data</TabsTrigger>
          <TabsTrigger value="filter">Filter</TabsTrigger>
          <TabsTrigger value="upload" className="hidden md:block">Upload</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4 mt-4">
          <DosenTable
            searchQuery={searchQuery}
            departmentFilter={departmentFilter}
            statusFilter={statusFilter}
            identificationFilter={identificationFilter}
            refreshTrigger={refreshTrigger}
            onDataRefresh={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </TabsContent>

        {/* Filter View */}
        <TabsContent value="filter" className="mt-4">
          <DosenFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            identificationFilter={identificationFilter}
            setIdentificationFilter={setIdentificationFilter}
          />
        </TabsContent>

        {/* Upload View */}
        <TabsContent value="upload" className="mt-4 md:hidden">
          <DosenExcelUploader onSuccess={handleUploadSuccess} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddDosenDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      <DosenExcelUploader
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}
