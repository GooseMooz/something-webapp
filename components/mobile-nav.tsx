"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, LayoutDashboard, User, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const tabs = [
  { href: "/opportunities", icon: Search, label: "Browse" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/applications", icon: FileText, label: "My Apps" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition-colors",
                isActive ? "text-espresso" : "text-espresso/30"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-0 rounded-2xl bg-matcha/15"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <tab.icon className="relative z-10 h-5 w-5" />
              <span className="relative z-10 text-[10px] font-bold">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
