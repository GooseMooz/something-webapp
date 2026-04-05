"use client"

import { useState, useEffect } from "react"
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
import { authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

type Role = "youth" | "organization"

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
  const { loginAsUser, loginAsOrg, type, isLoading } = useAuth()

  // Already logged in — redirect immediately
  useEffect(() => {
    if (isLoading) return
    if (type === "user") router.replace("/opportunities")
    else if (type === "org") router.replace("/org/opportunities")
  }, [isLoading, type, router])

  const [role, setRole] = useState<Role>("youth")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const roleColors: Record<Role, { bg: string; ring: string; text: string }> = {
    youth:        { bg: "bg-matcha/15",  ring: "ring-matcha/30",  text: "text-matcha-dark" },
    organization: { bg: "bg-sky/15",     ring: "ring-sky/30",     text: "text-sky-dark" },
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    haptic("medium")
    setSubmitting(true)
    try {
      if (role === "youth") {
        const { token } = await authApi.login({ email, password })
        await loginAsUser(token)
        haptic("success")
        router.push("/opportunities")
      } else {
        const { token } = await authApi.orgLogin({ email, password })
        await loginAsOrg(token)
        haptic("success")
        router.push("/org/opportunities")
      }
    } catch (err) {
      haptic("error" as never)
      const msg = err instanceof Error ? err.message : ""
      const isCredentialError = /401|unauthorized|invalid|incorrect|password|credentials/i.test(msg)
      toast.error(isCredentialError ? "Incorrect email or password" : "Something went wrong — please try again")
    } finally {
      setSubmitting(false)
    }
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

            {/* Role Tabs */}
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

            {/* Email form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-espresso/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="maya@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-border/60 bg-background h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-espresso/70">Password</Label>
                  {role === "youth" && (
                    <Link href="/forgot-password" className="font-serif text-xs italic text-espresso/40 hover:text-espresso/70 transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  disabled={submitting}
                  className="w-full rounded-full bg-matcha font-semibold text-espresso hover:bg-matcha-dark h-11 text-base"
                >
                  {submitting ? (
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
