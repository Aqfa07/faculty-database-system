"use client"

import type { User } from "@/lib/auth"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  user: User
  title: string
  description?: string
}

export function Header({ user, title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-background/95 backdrop-blur border-b border-border">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari..." className="pl-9 w-64" />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">{user.full_name}</p>
            <Badge variant="secondary" className="text-xs capitalize">
              {user.role}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
