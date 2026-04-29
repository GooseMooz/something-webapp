"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Building2, Briefcase, Mail, LogOut, Menu, Sparkles, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/users",         label: "Users",         icon: Users },
  { href: "/admin/orgs",          label: "Organizations", icon: Building2 },
  { href: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/admin/campaigns",     label: "Campaigns",     icon: Mail },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { admin, logout } = useAuth()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: "var(--espresso)", color: "var(--cream)" }}>
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <Sparkles className="h-4 w-4" style={{ color: "var(--cream)" }} />
        </div>
        <div>
          <div className="font-display text-sm tracking-wide" style={{ color: "var(--cream)" }}>Something</div>
          <div className="text-[10px] uppercase tracking-widest opacity-40">Admin</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto opacity-50 hover:opacity-80 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/15 opacity-100" : "opacity-50 hover:bg-white/8 hover:opacity-75"
              )}
              style={{ color: "var(--cream)" }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{ backgroundColor: "var(--caramel)", color: "var(--espresso)" }}>
            {admin?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: "var(--cream)" }}>{admin?.name ?? "Admin"}</div>
            <div className="text-[10px] truncate opacity-40">{admin?.email ?? ""}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs opacity-50 hover:bg-white/8 hover:opacity-75 transition-all"
          style={{ color: "var(--cream)" }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { type, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) return
    if (!isLoading && type !== "admin") {
      router.replace("/admin/login")
    }
  }, [isLoading, type, router, isLoginPage])

  // Login page renders without the sidebar shell
  if (isLoginPage) return <>{children}</>

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-espresso/20 border-t-espresso animate-spin" />
      </div>
    )
  }

  if (type !== "admin") return null

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col fixed inset-y-0 left-0 z-30">
        <AdminSidebar />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ backgroundColor: "var(--espresso)" }}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--cream)" }} />
          </div>
          <span className="font-display text-sm tracking-wide" style={{ color: "var(--cream)" }}>Admin</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: "var(--cream)" }}>
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-56 border-0">
            <AdminSidebar onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56">
        <div className="pt-14 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
