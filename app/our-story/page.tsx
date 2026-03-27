"use client"

import Link from "next/link"
import { Sparkles, Heart, Users, Globe, ArrowLeft, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
} from "@/components/motion-wrapper"
import { Footer } from "@/components/footer"
import { haptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

const cardClass = "border-border/70 bg-card shadow-sm shadow-espresso/[0.04]"

const values = [
  {
    title: "Made for how you live",
    description: "Fast, mobile-first, and designed around real schedules — not volunteer orientations that take two hours.",
    icon: Users,
    color: "bg-matcha/12 text-matcha-dark",
  },
  {
    title: "Trust and safety",
    description: "Verified organizations, transparent reviews, and a trust score that protects everyone in the community.",
    icon: Heart,
    color: "bg-caramel/20 text-espresso/70",
  },
  {
    title: "Rooted locally",
    description: "Starting in Metro Vancouver and growing intentionally. Every hour logged makes a real difference here.",
    icon: Globe,
    color: "bg-honey/12 text-espresso/70",
  },
]

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso text-cream">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif font-semibold text-lg text-espresso">Something</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-xs font-medium text-espresso/50 hover:text-espresso">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h1 className="font-display text-4xl tracking-wide text-espresso md:text-6xl text-balance leading-[1.05]">
              Why we built{" "}
              <span className="text-matcha-dark">Something</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="font-serif mt-7 text-lg text-espresso/50 leading-relaxed max-w-xl mx-auto text-pretty italic">
              We believe every young person has the power to make a difference. We just wanted to make it easier to start.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-latte/45 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SlideUp>
            <h2 className="text-2xl font-bold text-espresso mb-7 md:text-3xl">The problem</h2>
            <div className="flex flex-col gap-5 font-serif text-sm text-espresso/60 leading-relaxed">
              <p>
                Volunteering in Metro Vancouver was broken in a quiet, frustrating way. Youth wanted to help but couldn&apos;t find opportunities that fit their schedule, matched their interests, or felt like they&apos;d actually matter.
              </p>
              <p>
                Organizations needed volunteers but were drowning in outdated sign-up sheets and email chains. The matching was manual, the experience was forgettable, and nobody was tracking the incredible work being done.
              </p>
              <p>
                We asked ourselves: <span className="font-semibold not-italic text-espresso">what if volunteering felt as easy as booking a restaurant?</span> What if every hour you gave back actually meant something you could point to?
              </p>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SlideUp>
            <h2 className="text-2xl font-bold text-espresso mb-12 text-center md:text-3xl">What we stand for</h2>
          </SlideUp>
          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className={cn(cardClass, "h-full")}>
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${value.color}`}>
                        <value.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-semibold text-espresso">{value.title}</h3>
                      <p className="font-serif text-xs text-espresso/50 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="bg-latte/40 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <SlideUp>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-matcha/15"
            >
              <Heart className="h-6 w-6 text-matcha-dark" />
            </motion.div>
            <h2 className="text-2xl font-bold text-espresso mb-3 md:text-3xl">Come be part of it</h2>
            <p className="font-serif text-sm italic text-espresso/55 leading-relaxed mb-7">
              We&apos;re still in pilot mode — early access is limited. Drop your email and we&apos;ll reach out when we&apos;re ready for you.
            </p>
            <OurStoryWaitlistForm />
          </SlideUp>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function OurStoryWaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    haptic("medium")
    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) { haptic("success"); setStatus("success"); setEmail("") }
      else { haptic("error"); setStatus("error") }
    } catch { haptic("error"); setStatus("error") }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 font-serif italic text-sm text-matcha-dark"
      >
        <CheckCircle2 className="h-4 w-4" />
        You&apos;re on the list! We&apos;ll be in touch soon.
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-full border-border/60 bg-card/80 text-sm h-11"
        disabled={status === "loading"}
        required
      />
      <ScaleOnTap>
        <Button
          type="submit"
          disabled={status === "loading" || !email}
          className="rounded-full bg-espresso text-cream hover:bg-espresso/85 font-semibold text-sm px-6 h-11"
        >
          {status === "loading" ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-cream/20 border-t-cream" />
          ) : "Join waitlist"}
        </Button>
      </ScaleOnTap>
    </form>
  )
}
