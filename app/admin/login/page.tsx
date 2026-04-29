"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const { loginAsAdmin, type, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && type === "admin") router.replace("/admin/users")
  }, [isLoading, type, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const resp = await authApi.adminLogin({ email, password })
      const token = resp.access_token ?? resp.token
      await loginAsAdmin(token, resp.admin)
      router.push("/admin/users")
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      const isCredentialError = /401|unauthorized|invalid|incorrect|password|credentials/i.test(msg)
      toast.error(isCredentialError ? "Incorrect email or password" : "Something went wrong — please try again")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: "var(--espresso)", opacity: 0.03 }} />

      <FadeIn className="w-full max-w-sm relative z-10">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso text-cream">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-serif font-semibold text-xl text-espresso">Something</span>
            <span className="ml-2 text-xs font-medium text-espresso/40 uppercase tracking-widest">Admin</span>
          </div>
        </div>

        <Card className="border-border/60 bg-card shadow-lg shadow-espresso/[0.06]">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h1 className="font-display text-2xl tracking-wide text-espresso">Admin sign in</h1>
              <p className="font-serif mt-1.5 text-sm italic text-espresso/40">
                Restricted access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-espresso/70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-border/60 bg-background h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-espresso/70">Password</Label>
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <ScaleOnTap className="w-full mt-1">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full font-semibold h-11 text-base text-cream"
                  style={{ backgroundColor: "var(--espresso)" }}
                >
                  {submitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 rounded-full border-2 border-cream/20 border-t-cream"
                    />
                  ) : (
                    <>Sign In <ArrowRight className="ml-1.5 h-4 w-4" /></>
                  )}
                </Button>
              </ScaleOnTap>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
