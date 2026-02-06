import type { UploadLog } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"

interface UploadHistoryProps {
  data: UploadLog[]
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-muted text-muted-foreground" },
  processing: { label: "Proses", icon: Loader2, className: "bg-primary/20 text-primary" },
  completed: { label: "Selesai", icon: CheckCircle2, className: "bg-accent/20 text-accent" },
  failed: { label: "Gagal", icon: XCircle, className: "bg-destructive/20 text-destructive" },
}

const tableNameLabels: Record<string, string> = {
  faculty_members: "Data Dosen",
  dean_performance: "Capaian Kinerja",
}

export function UploadHistory({ data }: UploadHistoryProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Belum ada riwayat upload.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Nama File</TableHead>
            <TableHead>Tipe Data</TableHead>
            <TableHead className="text-right">Jumlah Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Waktu Upload</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const status = statusConfig[item.status]
            const StatusIcon = status.icon

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium truncate max-w-48">{item.file_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tableNameLabels[item.table_name] || item.table_name}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{item.records_count}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                  {item.error_message && (
                    <p className="text-xs text-destructive mt-1 truncate max-w-32" title={item.error_message}>
                      {item.error_message}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(item.created_at).toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
