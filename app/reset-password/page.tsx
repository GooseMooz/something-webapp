"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout } = useAuth()

  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPw, setShowNewPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) router.replace("/forgot-password")
  }, [token, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/proxy/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
        credentials: "include",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Reset failed")
      }
      logout()
      setDone(true)
      setTimeout(() => router.push("/login"), 2500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reset failed — the link may have expired")
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) return null

  return (
    <Card className="border-border/60 bg-card shadow-lg shadow-espresso/[0.06]">
      <CardContent className="p-6 md:p-8">
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-4 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-matcha/15">
              <CheckCircle2 className="h-6 w-6 text-matcha-dark" />
            </div>
            <div>
              <h2 className="font-display text-xl tracking-wide text-espresso">Password reset</h2>
              <p className="font-serif mt-2 text-sm italic text-espresso/50">
                Redirecting you to login…
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="font-display text-2xl tracking-wide text-espresso">Choose a new password</h1>
              <p className="font-serif mt-1.5 text-sm italic text-espresso/50">
                Must be at least 8 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-espresso/70">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPw ? "text" : "password"}
                    placeholder="At least 8 characters"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="rounded-xl border-border/60 bg-background h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60"
                    aria-label={showNewPw ? "Hide password" : "Show password"}
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-espresso/70">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat new password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="rounded-xl border-border/60 bg-background h-11"
                />
              </div>

              <ScaleOnTap className="w-full mt-1" hapticPattern="medium">
                <Button
                  type="submit"
                  disabled={submitting || !newPassword || !confirmPassword}
                  className="w-full rounded-full bg-matcha font-semibold text-espresso hover:bg-matcha-dark h-11"
                >
                  {submitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </ScaleOnTap>
            </form>

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-latte/40 p-3">
              <AlertCircle className="h-4 w-4 text-espresso/30 mt-0.5 shrink-0" />
              <p className="font-serif text-xs italic text-espresso/40">
                After resetting, you&apos;ll be signed out of all devices.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute left-[10%] top-[20%] h-56 w-56 rounded-full bg-matcha/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] bottom-[20%] h-48 w-48 rounded-full bg-honey/10 blur-3xl" />

      <FadeIn className="w-full max-w-md">
        <Link href="/login" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso text-cream">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-serif font-semibold text-xl text-espresso">Something</span>
        </Link>

        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </FadeIn>
    </div>
  )
}
