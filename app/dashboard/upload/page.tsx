import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { ExcelUploader } from "@/components/upload/excel-uploader"
import { UploadHistory } from "@/components/upload/upload-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default async function UploadPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Only admin and pj can access this page
  if (user.role !== "admin" && user.role !== "pj") {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  const { data: uploadLogs } = await supabase
    .from("upload_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} title="Upload Data" description="Import data dari file Excel untuk pembaruan massal" />

      <div className="flex-1 p-6 space-y-6">
        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Petunjuk Upload</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>File harus dalam format .xlsx atau .xls</li>
              <li>Baris pertama harus berisi header kolom</li>
              <li>Pastikan nama kolom sesuai dengan format template</li>
              <li>Maksimal ukuran file: 5MB</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Upload Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Faculty Data Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Upload Data Dosen
              </CardTitle>
              <CardDescription>Import atau update data dosen dari file Excel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ExcelUploader tableName="faculty_members" userId={user.id} />

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">Download Template</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/templates/faculty" download>
                    <Download className="w-4 h-4 mr-2" />
                    Template Data Dosen
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Data Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-accent" />
                Upload Capaian Kinerja
              </CardTitle>
              <CardDescription>Import data indikator kinerja dekan dari file Excel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ExcelUploader tableName="dean_performance" userId={user.id} />

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">Download Template</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/templates/performance" download>
                    <Download className="w-4 h-4 mr-2" />
                    Template Capaian Kinerja
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Upload</CardTitle>
            <CardDescription>Daftar file yang telah diupload ke sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadHistory data={uploadLogs || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
