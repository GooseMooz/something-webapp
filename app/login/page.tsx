"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

type Role = "youth" | "organization"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("youth")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push(role === "youth" ? "/opportunities" : "/org/opportunities")
    }, 1200)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-40 w-40 rounded-full bg-matcha/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] bottom-[20%] h-32 w-32 rounded-full bg-sky/10 blur-3xl" />

      <FadeIn className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha text-espresso">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-espresso">Something</span>
        </Link>

        <Card className="border-border/60 bg-card shadow-xl shadow-espresso/5">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-extrabold text-espresso">Welcome Back</h1>
              <p className="mt-1.5 text-sm text-espresso/50">
                Pick up right where you left off.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="mb-6 flex rounded-full bg-muted p-1">
              {(["youth", "organization"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "relative flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
                    role === r ? "text-espresso" : "text-espresso/40 hover:text-espresso/60"
                  )}
                >
                  {role === r && (
                    <motion.span
                      layoutId="login-role-tab"
                      className="absolute inset-0 rounded-full bg-card shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{r}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-espresso/70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="maya@example.com"
                  required
                  className="rounded-xl border-border bg-background h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-espresso/70">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-matcha-dark hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="rounded-xl border-border bg-background h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <ScaleOnTap className="w-full mt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-matcha font-bold text-espresso hover:bg-matcha-dark h-11 text-base"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso"
                    />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </ScaleOnTap>
            </form>

            <p className="mt-6 text-center text-sm text-espresso/50">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="font-semibold text-matcha-dark hover:underline"
              >
                Sign up free
              </Link>
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
