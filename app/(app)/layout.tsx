"use client"

import { Navbar } from "@/components/navbar"
import { MobileNav } from "@/components/mobile-nav"

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
