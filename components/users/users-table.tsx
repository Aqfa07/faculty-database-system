"use client"

import type { User } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, UserCog, UserIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UsersTableProps {
  data: User[]
  currentUserId: string
}

const roleConfig = {
  admin: { label: "Admin", icon: Shield, className: "bg-primary text-primary-foreground" },
  pj: { label: "Penanggung Jawab", icon: UserCog, className: "bg-accent text-accent-foreground" },
  staff: { label: "Staff", icon: UserIcon, className: "bg-muted text-muted-foreground" },
}

export function UsersTable({ data, currentUserId }: UsersTableProps) {
  const router = useRouter()

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const supabase = createClient()
    await supabase.from("users").update({ is_active: !isActive }).eq("id", userId)
    router.refresh()
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    const supabase = createClient()
    await supabase.from("users").update({ role: newRole }).eq("id", userId)
    router.refresh()
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tidak ada pengguna terdaftar.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Pengguna</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => {
            const role = roleConfig[user.role as keyof typeof roleConfig]
            const RoleIcon = role?.icon || UserIcon

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{user.username}</TableCell>
                <TableCell>{user.department || "-"}</TableCell>
                <TableCell>
                  <Badge className={role?.className}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {role?.label || user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {user.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "admin")}>
                          Set sebagai Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "pj")}>
                          Set sebagai PJ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeRole(user.id, "staff")}>
                          Set sebagai Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(user.id, user.is_active)}>
                          {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
