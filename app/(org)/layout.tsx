"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles, Search, LayoutDashboard, FileText, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/org/opportunities", label: "My Opportunities", icon: Search },
  { href: "/org/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/org/applications", label: "Applications", icon: FileText },
  { href: "/org/profile", label: "Profile", icon: Building2 },
]

export default function OrgShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/org/opportunities" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky text-card">
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-espresso">Something</span>
            <span className="rounded-full bg-sky/15 px-2 py-0.5 text-[10px] font-bold text-sky-dark">ORG</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn("relative rounded-full px-4 py-2 text-sm font-semibold transition-colors", pathname === link.href ? "text-espresso" : "text-espresso/45 hover:text-espresso")}>
                {pathname === link.href && (
                  <motion.span layoutId="org-navbar-indicator" className="absolute inset-0 rounded-full bg-sky/15" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link href="/org/profile">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex h-9 w-9 items-center justify-center rounded-full bg-sky/20 text-xs font-bold text-espresso cursor-pointer">
                NB
              </motion.div>
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl text-espresso md:hidden" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="fixed inset-x-0 top-[61px] z-40 border-b border-border bg-card p-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-colors", pathname === link.href ? "bg-sky/15 text-espresso" : "text-espresso/50 hover:bg-latte")}>
                  <link.icon className="h-5 w-5" /> {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href} className={cn("relative flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition-colors", isActive ? "text-espresso" : "text-espresso/30")}>
                {isActive && <motion.span layoutId="org-mobile-nav" className="absolute inset-0 rounded-2xl bg-sky/15" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                <tab.icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10 text-[10px] font-bold">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <main className="pb-20 md:pb-0">{children}</main>
    </div>
  )
}
