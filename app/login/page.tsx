"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { haptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

type Role = "youth" | "organization"

/* ── Decorative helpers ─────────────────────────────────── */
function Asterisk({ size = 20, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {[0, 45, 90, 135].map((angle) => (
        <line key={angle} x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2.2" strokeLinecap="round"
          transform={`rotate(${angle} 12 12)`} />
      ))}
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("youth")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null)

  function handleSocialLogin(provider: "google" | "apple") {
    haptic("medium")
    setSocialLoading(provider)
    setTimeout(() => {
      haptic("success")
      setSocialLoading(null)
      router.push(role === "youth" ? "/opportunities" : "/org/opportunities")
    }, 1200)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    haptic("medium")
    setIsLoading(true)
    setTimeout(() => {
      haptic("success")
      setIsLoading(false)
      router.push(role === "youth" ? "/opportunities" : "/org/opportunities")
    }, 1200)
  }

  const roleColors: Record<Role, { bg: string; ring: string; text: string }> = {
    youth:        { bg: "bg-matcha/15",  ring: "ring-matcha/30",  text: "text-matcha-dark" },
    organization: { bg: "bg-sky/15",     ring: "ring-sky/30",     text: "text-sky-dark" },
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-matcha/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] bottom-[15%] h-56 w-56 rounded-full bg-sky/12 blur-3xl" />
      <div className="pointer-events-none absolute left-[45%] bottom-[25%] h-44 w-44 rounded-full bg-honey/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[25%] top-[10%] h-36 w-36 rounded-full bg-rose/8 blur-3xl" />

      {/* Floating asterisk decorations */}
      {[
        { x: "8%",  y: "18%", color: "var(--matcha)", size: 22, dur: 10, delay: 0 },
        { x: "88%", y: "12%", color: "var(--honey)",  size: 16, dur: 14, delay: 1 },
        { x: "92%", y: "72%", color: "var(--sky)",    size: 20, dur: 11, delay: 0.5 },
        { x: "5%",  y: "80%", color: "var(--rose)",   size: 14, dur: 9,  delay: 1.5 },
        { x: "50%", y: "6%",  color: "var(--caramel)",size: 18, dur: 13, delay: 0.8 },
      ].map((a, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: a.x, top: a.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.55, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.3 + i * 0.15, duration: 0.6 },
            scale:   { delay: 0.3 + i * 0.15, duration: 0.5, type: "spring", stiffness: 280 },
            y:       { duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: a.delay },
          }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: a.dur, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={a.size} color={a.color} />
          </motion.div>
        </motion.div>
      ))}

      <FadeIn className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5" onClick={() => haptic("light")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso text-cream">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-serif font-semibold text-xl text-espresso">Something</span>
        </Link>

        <Card className="border-border/60 bg-card shadow-lg shadow-espresso/[0.06]">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl tracking-wide text-espresso">Welcome back</h1>
              <p className="font-serif mt-1.5 text-sm italic text-espresso/50">
                Pick up right where you left off.
              </p>
            </div>

            {/* Role Tabs — colored by role */}
            <div className="mb-6 flex rounded-xl bg-muted/60 p-1 border border-border/40">
              {(["youth", "organization"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); haptic("selection") }}
                  className={cn(
                    "relative flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                    role === r ? roleColors[r].text : "text-espresso/40 hover:text-espresso/60"
                  )}
                >
                  {role === r && (
                    <motion.span
                      layoutId="login-role-tab"
                      className={cn("absolute inset-0 rounded-lg shadow-sm ring-1", roleColors[r].bg, roleColors[r].ring)}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{r}</span>
                </button>
              ))}
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3 mb-5">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading !== null || isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-medium text-espresso/80 transition-all hover:bg-latte/50 hover:border-border/80 hover:shadow-sm disabled:opacity-60"
              >
                {socialLoading === "google" ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-espresso/20 border-t-espresso" />
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </motion.button>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin("apple")}
                disabled={socialLoading !== null || isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-medium text-espresso/80 transition-all hover:bg-latte/50 hover:border-border/80 hover:shadow-sm disabled:opacity-60"
              >
                {socialLoading === "apple" ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-espresso/20 border-t-espresso" />
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                )}
                Continue with Apple
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 font-serif italic text-espresso/40">or continue with email</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-espresso/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="maya@example.com"
                  required
                  className="rounded-xl border-border/60 bg-background h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-espresso/70">Password</Label>
                  <Link href="#" className="font-serif text-xs italic text-matcha-dark hover:underline" onClick={() => haptic("light")}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="rounded-xl border-border/60 bg-background h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => { setShowPassword(!showPassword); haptic("selection") }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <ScaleOnTap className="w-full mt-1" hapticPattern="medium">
                <Button
                  type="submit"
                  disabled={isLoading || socialLoading !== null}
                  className="w-full rounded-full bg-matcha font-semibold text-espresso hover:bg-matcha-dark h-11 text-base"
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                  ) : (
                    <>Log In <ArrowRight className="ml-1.5 h-4 w-4" /></>
                  )}
                </Button>
              </ScaleOnTap>
            </form>

            <p className="mt-6 text-center font-serif text-sm italic text-espresso/50">
              {"Don't have an account? "}
              <Link href="/signup" className="font-semibold not-italic text-matcha-dark hover:underline" onClick={() => haptic("light")}>
                Sign up free
              </Link>
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
