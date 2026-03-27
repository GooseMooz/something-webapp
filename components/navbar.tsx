"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles, Search, LayoutDashboard, FileText, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScaleOnTap } from "@/components/motion-wrapper"
import { haptic } from "@/lib/haptics"

const navLinks = [
  { href: "/opportunities", label: "Browse", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
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
            <span className="font-serif font-semibold text-lg text-espresso">
              Something
            </span>
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
                  pathname === link.href
                    ? "text-espresso"
                    : "text-espresso/45 hover:text-espresso"
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

          {/* Desktop Avatar */}
          <div className="hidden md:flex items-center">
            <ScaleOnTap>
              <Link href="/profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha/20 font-display text-xs tracking-wide text-espresso cursor-pointer hover:bg-matcha/30 transition-colors">
                  CL
                </div>
              </Link>
            </ScaleOnTap>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => { setMobileOpen(!mobileOpen); haptic("light") }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-espresso/70 hover:text-espresso hover:bg-latte/50 transition-colors md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-[57px] z-40 border-b border-border/50 bg-card/95 backdrop-blur-xl p-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { setMobileOpen(false); haptic("selection") }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-latte/70 text-espresso"
                      : "text-espresso/50 hover:bg-latte/40 hover:text-espresso"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
