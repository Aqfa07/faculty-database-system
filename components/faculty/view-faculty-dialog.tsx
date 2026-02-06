import type { FacultyMember } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Building, GraduationCap, Briefcase, Award as IdCard } from "lucide-react"

interface ViewFacultyDialogProps {
  item: FacultyMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewFacultyDialog({ item, open, onOpenChange }: ViewFacultyDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Dosen</DialogTitle>
          <DialogDescription>Informasi lengkap profil dosen</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={item.photo_url || undefined} alt={item.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(item.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{item.full_name}</h3>
              {item.academic_rank && (
                <Badge variant="secondary" className="mt-1">
                  {item.academic_rank}
                </Badge>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <IdCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">NIP / NIDN</p>
                <p className="font-medium font-mono">
                  {item.nip} {item.nidn && `/ ${item.nidn}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Departemen</p>
                <p className="font-medium">{item.department}</p>
              </div>
            </div>

            {item.position && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Jabatan Struktural</p>
                  <p className="font-medium">{item.position}</p>
                </div>
              </div>
            )}

            {item.specialization && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Spesialisasi</p>
                  <p className="font-medium">{item.specialization}</p>
                </div>
              </div>
            )}

            {item.email && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${item.email}`} className="font-medium text-primary hover:underline">
                    {item.email}
                  </a>
                </div>
              </div>
            )}

            {item.phone && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <a href={`tel:${item.phone}`} className="font-medium text-primary hover:underline">
                    {item.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t border-border text-xs text-muted-foreground">
            <p>Ditambahkan: {new Date(item.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
            <p>Diperbarui: {new Date(item.updated_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
