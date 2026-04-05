"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch("/api/proxy/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      })
    } finally {
      // Always show success — never reveal whether the email exists
      setSubmitting(false)
      setSent(true)
    }
  }

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

        <Card className="border-border/60 bg-card shadow-lg shadow-espresso/[0.06]">
          <CardContent className="p-6 md:p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-4 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-matcha/15">
                  <Mail className="h-6 w-6 text-matcha-dark" />
                </div>
                <div>
                  <h2 className="font-display text-xl tracking-wide text-espresso">Check your inbox</h2>
                  <p className="font-serif mt-2 text-sm italic text-espresso/50 leading-relaxed">
                    If that account exists, we sent a reset link to <span className="font-semibold not-italic text-espresso/70">{email}</span>.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full text-sm font-medium text-espresso/55 hover:text-espresso mt-2">
                    <ArrowLeft className="mr-1.5 h-4 w-4" />Back to login
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="font-display text-2xl tracking-wide text-espresso">Reset your password</h1>
                  <p className="font-serif mt-1.5 text-sm italic text-espresso/50">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm font-medium text-espresso/70">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="maya@example.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="rounded-xl border-border/60 bg-background h-11"
                    />
                  </div>

                  <ScaleOnTap className="w-full mt-1" hapticPattern="medium">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full bg-matcha font-semibold text-espresso hover:bg-matcha-dark h-11"
                    >
                      {submitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                      ) : (
                        "Send reset link"
                      )}
                    </Button>
                  </ScaleOnTap>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login">
                    <Button variant="ghost" className="rounded-full text-sm font-medium text-espresso/55 hover:text-espresso">
                      <ArrowLeft className="mr-1.5 h-4 w-4" />Back to login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
