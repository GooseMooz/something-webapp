"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/lib/auth-context"

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const { type, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && type !== "user") {
      router.replace("/login")
    }
  }, [isLoading, type, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-espresso/20 border-t-espresso animate-spin" />
      </div>
    )
  }

  if (type !== "user") return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
