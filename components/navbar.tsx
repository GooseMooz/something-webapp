"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Search, LayoutDashboard, FileText, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScaleOnTap } from "@/components/motion-wrapper"
import { haptic } from "@/lib/haptics"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { href: "/opportunities", label: "Browse", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  function handleLogout() {
    haptic("medium")
    logout()
    router.push("/login")
  }

  return (
    <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/85 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          {/* Logo */}
          <Link href="/opportunities" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso text-cream">
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </div>
            <span className="font-serif font-semibold text-lg text-espresso">Something</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => haptic("selection")}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "text-espresso" : "text-espresso/45 hover:text-espresso"
                )}
              >
                {pathname === link.href && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-full bg-latte/80"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop: avatar + logout */}
          <div className="hidden md:flex items-center gap-2">
            <ScaleOnTap>
              <Link href="/profile">
                {user?.s3_pfp ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.s3_pfp}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-matcha/40 transition-all"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha/20 font-display text-xs tracking-wide text-espresso cursor-pointer hover:bg-matcha/30 transition-colors">
                    {initials}
                  </div>
                )}
              </Link>
            </ScaleOnTap>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-full text-espresso/30 hover:text-espresso hover:bg-latte/50 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile: avatar + logout */}
          <div className="flex md:hidden items-center gap-1.5">
            <ScaleOnTap>
              <Link href="/profile">
                {user?.s3_pfp ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.s3_pfp}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-matcha/40 transition-all"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha/20 font-display text-xs tracking-wide text-espresso cursor-pointer hover:bg-matcha/30 transition-colors">
                    {initials}
                  </div>
                )}
              </Link>
            </ScaleOnTap>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-full text-espresso/30 hover:text-espresso hover:bg-latte/50 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
    </motion.header>
  )
}
