import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

export default async function LogsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  const { data: logs } = await supabase
    .from("activity_logs")
    .select("*, users(full_name)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} title="Log Aktivitas" description="Riwayat aktivitas pengguna dalam sistem" />

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>{logs?.length || 0} aktivitas tercatat</CardDescription>
          </CardHeader>
          <CardContent>
            {!logs || logs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Belum ada aktivitas tercatat.</p>
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Waktu</TableHead>
                      <TableHead>Pengguna</TableHead>
                      <TableHead>Aktivitas</TableHead>
                      <TableHead>Tabel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {(log.users as { full_name: string } | null)?.full_name || "System"}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.table_name && <Badge variant="outline">{log.table_name}</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
