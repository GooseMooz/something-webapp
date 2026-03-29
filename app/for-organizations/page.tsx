"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import {
  Sparkles, CheckCircle2, ArrowLeft, Mail, Trash2,
  FileText, Tag, Building2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"
import { SlideUp } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

const cardClass = "border-border/70 bg-card shadow-sm shadow-espresso/[0.04]"

function Asterisk({ size = 24, color, className = "" }: { size?: number; color: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 2V22M2 12H22M4.9 4.9L19.1 19.1M19.1 4.9L4.9 19.1" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function WavyDivider({ color = "var(--matcha)", opacity = 0.15 }: { color?: string; opacity?: number }) {
  return (
    <div className="relative h-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1200 40" fill="none" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path d="M0 20 C200 5 400 35 600 20 C800 5 1000 35 1200 20" stroke={color} strokeWidth="2" strokeOpacity={opacity} fill="none" />
      </svg>
    </div>
  )
}

/* ── Benefit Bubble ── */
// Rainbow arc: 180° (left) → 270° (top/peak) → 360° (right), all in upper hemisphere
const RAINBOW_PARTICLES = [
  { angle: 180, dist: 52 },
  { angle: 210, dist: 66 },
  { angle: 240, dist: 80 },
  { angle: 270, dist: 90 },  // peak
  { angle: 300, dist: 80 },
  { angle: 330, dist: 66 },
  { angle: 360, dist: 52 },
]

function BenefitBubble({ title, body, emoji, color: bg, border, shape, dur, floatDelay }: {
  title: string; body: string; emoji: string; color: string; bg: string; border: string
  shape: string; dur: number; floatDelay: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: "visible" }}
    >
      {/* Particles — BEFORE bubble in DOM so bubble paints on top */}
      {RAINBOW_PARTICLES.map(({ angle, dist }, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <motion.span
            key={angle}
            className="absolute text-xl select-none pointer-events-none leading-none"
            style={{ top: "50%", left: "50%", marginLeft: "-0.55em", marginTop: "-0.55em" }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={hovered
              ? { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0.9, scale: 1 }
              : { x: 0, y: 0, opacity: 0, scale: 0 }}
            transition={hovered
              ? { type: "spring", stiffness: 155, damping: 13, delay: i * 0.04 }
              : { type: "spring", stiffness: 400, damping: 34, delay: (6 - i) * 0.012 }}
          >
            {emoji}
          </motion.span>
        )
      })}

      {/* Bubble — AFTER particles in DOM, paints on top */}
      <motion.div
        className={cn("w-full p-5 border-2 shadow-sm cursor-default flex flex-col items-center text-center gap-2", bg, border)}
        style={{ borderRadius: shape, position: "relative" }}
        initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <span className="text-3xl leading-none">{emoji}</span>
        <p className="text-xs font-semibold text-espresso leading-snug">{title}</p>
        <p className="font-serif text-[11px] italic text-espresso/50 leading-snug">{body}</p>
      </motion.div>
    </motion.div>
  )
}

/* ── Step Cards with measured path ── */
const STEPS = [
  { num: "01", title: "Tell us what you need",      body: "Share the opportunity — a one-time shift, a recurring role, or a special event. We'll help shape the description if needed.", emoji: "📋", border: "border-honey/25",  stagger: 0  },
  { num: "02", title: "We match and prepare youth", body: "We promote to youth who match your cause, screen applicants, and make sure they know exactly what to expect before they arrive.", emoji: "✦",  border: "border-matcha/25", stagger: 80 },
  { num: "03", title: "They show up ready",         body: "Volunteers arrive briefed and motivated. We track attendance and send a simple report for your grant records.",                  emoji: "🌱", border: "border-sky/25",    stagger: 0  },
]

function StepCards() {
  const card1Ref = React.useRef<HTMLDivElement>(null)
  const card2Ref = React.useRef<HTMLDivElement>(null)
  const card3Ref = React.useRef<HTMLDivElement>(null)
  const wrapRef  = React.useRef<HTMLDivElement>(null)
  const [paths, setPaths] = React.useState<{ p1: string; p2: string } | null>(null)

  React.useLayoutEffect(() => {
    function measure() {
      const wrap = wrapRef.current
      const c1   = card1Ref.current
      const c2   = card2Ref.current
      const c3   = card3Ref.current
      if (!wrap || !c1 || !c2 || !c3) return

      const wb = wrap.getBoundingClientRect()
      const b1 = c1.getBoundingClientRect()
      const b2 = c2.getBoundingClientRect()
      const b3 = c3.getBoundingClientRect()

      // All coords relative to wrapper top-left
      const x1 = b1.left - wb.left + b1.width / 2
      const y1b = b1.bottom - wb.top          // bottom of card 1
      const x2 = b2.left - wb.left + b2.width / 2
      const y2t = b2.top - wb.top             // top of card 2
      const y2b = b2.bottom - wb.top          // bottom of card 2
      const x3 = b3.left - wb.left + b3.width / 2
      const y3t = b3.top - wb.top             // top of card 3

      const slack = 80  // curve depth below each card bottom
      const p1 = `M ${x1} ${y1b} C ${x1} ${y1b + slack} ${x2} ${y1b + slack} ${x2} ${y2t}`
      const p2 = `M ${x2} ${y2b} C ${x2} ${y2b + slack} ${x3} ${y2b + slack} ${x3} ${y3t}`
      setPaths({ p1, p2 })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const refs = [card1Ref, card2Ref, card3Ref]

  return (
    <div ref={wrapRef} className="relative" style={{ paddingBottom: "8rem" }}>
      {/* Measured SVG paths — desktop only */}
      {paths && (
        <svg
          className="absolute inset-0 w-full h-full hidden md:block pointer-events-none"
          style={{ overflow: "visible", zIndex: 0 }}
          fill="none"
          aria-hidden
        >
          <motion.path d={paths.p1} stroke="var(--honey)"  strokeWidth="2.5" strokeDasharray="10 6" strokeLinecap="round" strokeOpacity="0.55"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeInOut", delay: 0.4 }} />
          <motion.path d={paths.p2} stroke="var(--matcha)" strokeWidth="2.5" strokeDasharray="10 6" strokeLinecap="round" strokeOpacity="0.48"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeInOut", delay: 0.9 }} />
        </svg>
      )}

      <div className="grid gap-8 md:grid-cols-3 md:items-start" style={{ position: "relative", zIndex: 1 }}>
        {STEPS.map((step, i) => (
          <motion.div key={step.num} ref={refs[i]}
            style={{ marginTop: step.stagger }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.45 }}
            whileHover={{ y: -5 }}>
            <Card className={cn(cardClass, "h-full border-2", step.border)}>
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl text-espresso/10 tracking-wider leading-none select-none">{step.num}</span>
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-wide text-espresso mb-2">{step.title}</h3>
                  <p className="font-serif text-sm text-espresso/55 leading-relaxed">{step.body}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const REQUIRED_FIELDS = ["orgName", "contactName", "email", "address", "title", "description", "date", "duration", "location"] as const
const FORM_DRAFT_KEY = "task-form-draft"
const INITIAL_FORM = {
  orgName: "", contactName: "", email: "", phone: "", address: "", website: "",
  title: "", category: "Environment", description: "",
  date: "", duration: "", location: "", totalSpots: "", xpReward: "",
  tags: "", resourceLink: "",
}

/* ── Submit Task Modal ── */
function SubmitTaskModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [form, setForm] = useState<typeof INITIAL_FORM>(() => {
    if (typeof window === "undefined") return INITIAL_FORM
    try {
      const saved = localStorage.getItem(FORM_DRAFT_KEY)
      return saved ? { ...INITIAL_FORM, ...JSON.parse(saved) } : INITIAL_FORM
    } catch {
      return INITIAL_FORM
    }
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => {
      const next = { ...f, [k]: e.target.value }
      try { localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(next)) } catch {}
      return next
    })

  const missing = (k: typeof REQUIRED_FIELDS[number]) => attempted && !form[k].trim()

  const errClass = (k: typeof REQUIRED_FIELDS[number]) =>
    missing(k) ? "border-rose/60 focus:ring-rose/40" : ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAttempted(true)
    if (REQUIRED_FIELDS.some(k => !form[k].trim())) return

    setLoading(true)
    try {
      await fetch("/api/task-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: {
            name:        form.orgName,
            contactName: form.contactName,
            email:       form.email,
            phone:       form.phone || undefined,
            address:     form.address,
            website:     form.website || undefined,
          },
          task: {
            title:          form.title,
            category:       form.category,
            description:    form.description,
            date:           form.date,
            timeCommitment: form.duration,
            location:       form.location,
            totalSpots:     form.totalSpots ? Number(form.totalSpots) : undefined,
            xpReward:       form.xpReward  ? Number(form.xpReward)   : undefined,
            tags:           form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            links: {
              additionalResources: form.resourceLink || undefined,
            },
          },
        }),
      })
      try { localStorage.removeItem(FORM_DRAFT_KEY) } catch {}
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl"
      >
        <div className="h-1.5 bg-gradient-to-r from-honey/50 via-matcha/35 to-sky/30 rounded-t-2xl" />

        {submitted ? (
          /* ── Success state ── */
          <div className="p-10 flex flex-col items-center text-center gap-5">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-matcha/15"
            >
              <CheckCircle2 className="h-7 w-7 text-matcha-dark" />
            </motion.div>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-espresso mb-2">Task submitted!</h2>
              <p className="font-serif text-sm italic text-espresso/50 max-w-sm">
                We&apos;ve received your task and will review it within a couple of days. We&apos;ll reach out to{" "}
                <span className="text-espresso/70">{form.email}</span> with next steps.
              </p>
            </div>
            <Button onClick={onClose} className="rounded-full bg-espresso text-cream font-semibold px-8 h-10 text-sm mt-2">
              Done
            </Button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl tracking-wide text-espresso">Submit a task</h2>
                <p className="font-serif text-xs italic text-espresso/40 mt-0.5">
                  We&apos;ll review it and get back to you within a couple of days.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { try { localStorage.removeItem(FORM_DRAFT_KEY) } catch {}; onClose() }}
                title="Discard draft"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose/10 transition-colors text-espresso/30 hover:text-rose/70"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-7">

              {/* ── Section: Your Organization ── */}
              <div>
                <h3 className="text-[10px] font-bold text-espresso/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Building2 className="h-3 w-3" /> Your Organization
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Organization name *</label>
                      <Input value={form.orgName} onChange={set("orgName")} placeholder="e.g. Nature Vancouver" className={cn("rounded-xl h-10 text-sm", errClass("orgName"))} />
                      {missing("orgName") && <p className="text-xs text-rose mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Contact name *</label>
                      <Input value={form.contactName} onChange={set("contactName")} placeholder="e.g. Jamie Chen" className={cn("rounded-xl h-10 text-sm", errClass("contactName"))} />
                      {missing("contactName") && <p className="text-xs text-rose mt-1">Required</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Email *</label>
                      <Input type="email" value={form.email} onChange={set("email")} placeholder="hello@yourorg.ca" className={cn("rounded-xl h-10 text-sm", errClass("email"))} />
                      {missing("email") && <p className="text-xs text-rose mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Phone</label>
                      <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="(604) 555-0100" className="rounded-xl h-10 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-espresso/40 mb-1 block">Address *</label>
                    <Input value={form.address} onChange={set("address")} placeholder="123 Main St, Vancouver, BC" className={cn("rounded-xl h-10 text-sm", errClass("address"))} />
                    {missing("address") && <p className="text-xs text-rose mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-espresso/40 mb-1 block">Website</label>
                    <Input type="url" value={form.website} onChange={set("website")} placeholder="https://yourorg.ca" className="rounded-xl h-10 text-sm" />
                  </div>
                </div>
              </div>

              {/* ── Section: Task Details ── */}
              <div>
                <h3 className="text-[10px] font-bold text-espresso/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <FileText className="h-3 w-3" /> Task Details
                </h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-espresso/40 mb-1 block">Title *</label>
                    <Input value={form.title} onChange={set("title")} placeholder="e.g. Habitat Restoration Day at New Brighton Park" className={cn("rounded-xl h-10 text-sm", errClass("title"))} />
                    {missing("title") && <p className="text-xs text-rose mt-1">Required</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Category *</label>
                      <select
                        value={form.category} onChange={set("category")}
                        className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso focus:outline-none focus:ring-1 focus:ring-matcha"
                      >
                        <option>Environment</option>
                        <option>Education</option>
                        <option>Community</option>
                        <option>Food</option>
                        <option>Arts &amp; Culture</option>
                        <option>Health</option>
                        <option>Civic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">XP reward</label>
                      <Input type="number" min={0} value={form.xpReward} onChange={set("xpReward")} placeholder="e.g. 150" className="rounded-xl h-10 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-espresso/40 mb-1 block">Description *</label>
                    <textarea
                      rows={4} value={form.description} onChange={set("description")}
                      placeholder="What will volunteers do? What should they bring? What will they get out of it?"
                      className={cn("w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:ring-1 focus:ring-matcha resize-none", missing("description") && "border-rose/60")}
                    />
                    {missing("description") && <p className="text-xs text-rose mt-1">Required</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Date *</label>
                      <Input type="date" value={form.date} onChange={set("date")} className={cn("rounded-xl h-10 text-sm", errClass("date"))} />
                      {missing("date") && <p className="text-xs text-rose mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Duration *</label>
                      <Input value={form.duration} onChange={set("duration")} placeholder="e.g. 3 hours" className={cn("rounded-xl h-10 text-sm", errClass("duration"))} />
                      {missing("duration") && <p className="text-xs text-rose mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Location *</label>
                      <Input value={form.location} onChange={set("location")} placeholder="e.g. New Brighton Park, Vancouver" className={cn("rounded-xl h-10 text-sm", errClass("location"))} />
                      {missing("location") && <p className="text-xs text-rose mt-1">Required</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-espresso/40 mb-1 block">Total spots</label>
                      <Input type="number" min={1} value={form.totalSpots} onChange={set("totalSpots")} placeholder="e.g. 20" className="rounded-xl h-10 text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Tags & Links ── */}
              <div>
                <h3 className="text-[10px] font-bold text-espresso/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Tag className="h-3 w-3" /> Tags &amp; Links
                </h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-espresso/40 mb-1 block">Tags</label>
                    <Input value={form.tags} onChange={set("tags")} placeholder="Outdoors, Beginner-Friendly, Group Activity  (comma separated)" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-espresso/40 mb-1 block">Additional resources</label>
                    <Input type="url" value={form.resourceLink} onChange={set("resourceLink")} placeholder="https://..." className="rounded-xl h-10 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-7 pt-5 border-t border-border/40">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-espresso text-cream hover:bg-espresso/90 font-semibold text-sm h-11 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit task"}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="rounded-full bg-transparent border border-border/60 text-espresso/50 hover:bg-latte/40 hover:text-espresso text-sm font-semibold h-11 px-6 shadow-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function ForOrganizationsPage() {
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FORM_DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const hasData = Object.values(parsed).some(
          (v) => typeof v === "string" && v.trim() !== "" && v !== "Environment"
        )
        if (hasData) setShowForm(true)
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/85 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-espresso text-cream">
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </div>
            <span className="font-serif font-semibold text-lg text-espresso">Something</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="rounded-full text-sm font-medium text-espresso/55 hover:text-espresso hover:bg-latte/60">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
            </Button>
          </Link>
        </nav>
      </motion.header>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pb-24 pt-16 md:px-6 md:pb-36 md:pt-24">
        <div className="pointer-events-none absolute right-[-5%] top-[-5%] h-[420px] w-[420px] rounded-full bg-honey/10 blur-[100px]" />
        <div className="pointer-events-none absolute left-[8%] bottom-[5%] h-[320px] w-[320px] rounded-full bg-matcha/8 blur-[90px]" />
        <div className="pointer-events-none absolute right-[25%] bottom-[15%] h-[200px] w-[200px] rounded-full bg-sky/8 blur-[80px]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
            <motion.path d="M 120 80 C 80 140 70 220 140 300 C 200 370 250 380 230 450"
              stroke="var(--honey)" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ delay: 0.5, duration: 2, ease: "easeOut" }} />
            <motion.path d="M 750 60 C 780 40 810 80 840 60 C 870 40 900 80 930 60 C 960 40 990 80 1020 60"
              stroke="var(--matcha)" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 0.9, duration: 1.4, ease: "easeOut" }} />
            <motion.path d="M 1000 300 C 1040 260 1090 255 1095 295 C 1100 335 1060 360 1025 348 C 990 336 985 300 1022 288"
              stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 1.2, duration: 1.6, ease: "easeOut" }} />
            <motion.path d="M 300 380 C 330 358 360 402 390 380 C 420 358 450 402 480 380"
              stroke="var(--caramel)" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.45 }}
              transition={{ delay: 1.5, duration: 1.1, ease: "easeOut" }} />
          </svg>
        </div>

        <motion.div className="pointer-events-none absolute left-[5%] top-[22%] opacity-40"
          animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
          <Asterisk size={22} color="var(--honey)" />
        </motion.div>
        <motion.div className="pointer-events-none absolute right-[8%] top-[32%] opacity-35"
          animate={{ rotate: -360, y: [0, -8, 0] }}
          transition={{ rotate: { duration: 14, repeat: Infinity, ease: "linear" }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}>
          <Asterisk size={16} color="var(--matcha)" />
        </motion.div>
        <motion.div className="pointer-events-none absolute right-[20%] bottom-[18%] opacity-25"
          animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
          <Asterisk size={13} color="var(--caramel)" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-6 rounded-full border-honey/40 bg-honey/20 px-4 py-1.5 text-xs font-semibold text-espresso/70">
              ✦ For Organizations
            </Badge>
          </motion.div>
          <SlideUp>
            <h1 className="font-display text-4xl tracking-wide text-espresso md:text-6xl text-balance leading-tight mb-6">
              Youth who actually show up.
            </h1>
            <p className="font-serif text-lg text-espresso/55 leading-relaxed max-w-2xl mx-auto mb-8">
              Something connects Metro Vancouver community organizations with young volunteers who genuinely care about your cause. Less admin for your team, better outcomes for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="mailto:hi@somethingmatters.ca">
                <Button className="rounded-full bg-espresso text-cream font-semibold px-7 h-11 text-sm hover:bg-espresso/90 shadow-md">
                  <Mail className="mr-2 h-3.5 w-3.5" /> Get in touch
                </Button>
              </a>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center rounded-full border border-espresso/20 bg-transparent px-7 h-11 text-sm font-semibold hover:bg-espresso/6 transition-colors text-espresso/60 hover:text-espresso"
              >
                <FileText className="mr-2 h-3.5 w-3.5" /> Submit a task
              </button>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PARTNER LOGOS
      ══════════════════════════════════════════ */}
      <section className="border-y border-border/40 bg-latte/30 px-4 py-10 md:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-center font-serif text-xs italic text-espresso/38 mb-8">
            Organizations already working with us
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { src: "/images/nature_vancouver.png", alt: "Nature Vancouver"      },
              { src: "/images/DIVERSECity.png",      alt: "DIVERSECity"           },
              { src: "/images/AisB.jpg",             alt: "Apathy is Boring"      },
              { src: "/images/CityHive.png",         alt: "CityHive"              },
              { src: "/images/VNFN-2025Logo.png",    alt: "VNFN"                  },
            ].map((logo, i) => (
              <motion.div key={logo.alt}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}
                className="grayscale opacity-45 hover:grayscale-0 hover:opacity-75 transition-all duration-300">
                <Image src={logo.src} alt={logo.alt} width={88} height={44} className="h-10 w-auto object-contain" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider color="var(--honey)" opacity={0.2} />

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24">
        <div className="pointer-events-none absolute left-[4%] top-[28%] opacity-22">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
            <Asterisk size={20} color="var(--sky)" />
          </motion.div>
        </div>
        <div className="pointer-events-none absolute right-[5%] bottom-[25%] opacity-22">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Asterisk size={17} color="var(--rose)" />
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl tracking-wide text-espresso md:text-4xl mb-3">Simple from day one.</h2>
              <p className="font-serif text-sm italic text-espresso/50">Three steps is all it takes to get your first volunteer.</p>
            </div>
          </SlideUp>
          {/* Staggered steps — card 2 pushed down so paths flow bottom→top */}
          <StepCards />
        </div>
      </section>

      <WavyDivider color="var(--matcha)" opacity={0.15} />

      {/* ══════════════════════════════════════════
          WHAT YOU GET
      ══════════════════════════════════════════ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24 bg-gradient-to-br from-cream/90 via-latte/60 to-honey/20 overflow-hidden">
        <div className="pointer-events-none absolute left-[5%] top-[20%] h-40 w-40 rounded-full bg-honey/18 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] bottom-[15%] h-32 w-32 rounded-full bg-matcha/12 blur-3xl" />
        <div className="pointer-events-none absolute left-[40%] bottom-[10%] h-24 w-24 rounded-full bg-sky/10 blur-2xl" />
        <motion.div className="pointer-events-none absolute right-[5%] top-[18%] opacity-28"
          animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <Asterisk size={24} color="var(--caramel)" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <SlideUp>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl tracking-wide text-espresso md:text-4xl mb-3">What you get out of it.</h2>
              <p className="font-serif text-sm italic text-espresso/50 max-w-md mx-auto">We handle the overhead so your team can focus on actual impact.</p>
            </div>
          </SlideUp>
          <div className="grid gap-10 grid-cols-2 md:grid-cols-3">
            {[
              { title: "Zero admin",    body: "We screen, remind, and check in.",      emoji: "📭", color: "var(--matcha)",   bg: "bg-matcha/12",   border: "border-matcha/25",   shape: "68% 32% 55% 45% / 45% 55% 45% 55%", dur: 3.4, floatDelay: 0    },
              { title: "Auto reports",  body: "Hours logged, grant-ready.",             emoji: "📊", color: "var(--honey)",    bg: "bg-honey/15",    border: "border-honey/30",    shape: "45% 55% 65% 35% / 60% 40% 60% 40%", dur: 3.8, floatDelay: 0.5  },
              { title: "Right match",   body: "Matched by values, not availability.",   emoji: "💚", color: "var(--sky)",      bg: "bg-sky/12",      border: "border-sky/25",      shape: "55% 45% 40% 60% / 50% 60% 40% 50%", dur: 4.1, floatDelay: 0.25 },
              { title: "One contact",   body: "Post once, coordinate through us.",      emoji: "📬", color: "var(--caramel)",  bg: "bg-caramel/15",  border: "border-caramel/30",  shape: "40% 60% 55% 45% / 55% 45% 55% 45%", dur: 3.6, floatDelay: 0.75 },
              { title: "Plug & play",   body: "Pre-built onboarding and forms.",        emoji: "🏗️", color: "var(--rose)",    bg: "bg-rose/12",     border: "border-rose/25",     shape: "60% 40% 48% 52% / 48% 52% 60% 40%", dur: 4.3, floatDelay: 0.15 },
              { title: "Free to start", body: "No cost to orgs during our pilot.",      emoji: "🎁", color: "var(--espresso)", bg: "bg-espresso/8",  border: "border-espresso/20", shape: "50% 50% 62% 38% / 62% 38% 50% 50%", dur: 3.9, floatDelay: 0.6  },
            ].map((b) => (
              <BenefitBubble key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      <WavyDivider color="var(--sky)" opacity={0.18} />

      {/* ══════════════════════════════════════════
          WHAT WE ASK + EXAMPLES
      ══════════════════════════════════════════ */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <SlideUp>
              <div>
                <Badge className="mb-5 rounded-full border-matcha/30 bg-matcha/10 px-4 py-1.5 text-xs font-semibold text-espresso/65">
                  Partnership details
                </Badge>
                <h2 className="font-display text-3xl tracking-wide text-espresso md:text-4xl mb-5">We keep it lightweight.</h2>
                <p className="font-serif text-sm text-espresso/55 leading-relaxed mb-7">
                  The ask is small. Our goal is to reduce your workload, not add to it.
                </p>
                <div className="flex flex-col gap-3.5">
                  {[
                    "Post opportunities — one-time shifts or recurring roles",
                    "Write a clear task description with timing and logistics",
                    "Have someone available to welcome volunteers on the day",
                    "Let us know afterward if something needs improving",
                    "Keep it a safe, welcoming space for youth volunteers",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 font-serif text-sm text-espresso/60">
                      <CheckCircle2 className="h-4 w-4 text-matcha-dark shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.1}>
              <div className="flex flex-col gap-3">
                <p className="font-serif text-xs italic text-espresso/40 mb-1">Real opportunities from our partners</p>
                {[
                  { title: "New Brighton Park habitat restoration",  org: "Nature Vancouver",                       time: "4 hrs, monthly",   emoji: "🌿" },
                  { title: "Britannia Bulk Buy Food Club",           org: "Vancouver Neighbourhood Food Networks",  time: "3 hrs, recurring", emoji: "🥕" },
                  { title: "Data Wall Workshop Mentor",              org: "Tau Ceti Volunteer",                     time: "2 hrs/week",       emoji: "💻" },
                  { title: "RISE youth civic workshop",              org: "Apathy is Boring",                      time: "3 hrs, one-time",  emoji: "🗳️" },
                  { title: "Youth Civic Action event support",       org: "CityHive",                              time: "4 hrs, seasonal",  emoji: "🏙️" },
                ].map((task) => (
                  <motion.div key={task.title}
                    whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}
                    className="flex items-center gap-3 rounded-xl bg-latte/50 border border-border/40 p-3.5">
                    <span className="text-xl leading-none shrink-0">{task.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-espresso leading-snug">{task.title}</p>
                      <p className="font-serif text-[11px] italic text-espresso/40 mt-0.5">{task.org} · {task.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="relative border-t border-border/40 px-4 py-20 md:px-6 md:py-28 overflow-hidden bg-gradient-to-br from-espresso via-espresso/96 to-espresso/90">
        <div className="pointer-events-none absolute right-[-5%] top-[-10%] h-[360px] w-[360px] rounded-full bg-honey/8 blur-[100px]" />
        <div className="pointer-events-none absolute left-[-5%] bottom-[-10%] h-[280px] w-[280px] rounded-full bg-matcha/8 blur-[90px]" />
        <motion.div className="pointer-events-none absolute left-[6%] top-[20%] opacity-18"
          animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}>
          <Asterisk size={20} color="var(--cream)" />
        </motion.div>
        <motion.div className="pointer-events-none absolute right-[7%] bottom-[22%] opacity-14"
          animate={{ rotate: -360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>
          <Asterisk size={16} color="var(--honey)" />
        </motion.div>
        <motion.div className="pointer-events-none absolute right-[20%] top-[15%] opacity-12"
          animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <Asterisk size={13} color="var(--matcha)" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <SlideUp>
            <Badge className="mb-6 rounded-full border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-semibold text-cream/60">
              Get started
            </Badge>
            <h2 className="font-display text-3xl tracking-wide text-cream md:text-4xl mb-5">
              Let&apos;s work together.
            </h2>
            <p className="font-serif text-sm italic text-cream/48 leading-relaxed mb-10 max-w-sm mx-auto">
              Whether you&apos;re ready to post your first opportunity or just want to see if this is a fit — we&apos;re easy to reach.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="mailto:hi@somethingmatters.ca">
                <Button className="rounded-full bg-honey text-espresso font-semibold px-8 h-11 text-sm hover:bg-honey/90 shadow-lg">
                  <Mail className="mr-2 h-3.5 w-3.5" /> hi@somethingmatters.ca
                </Button>
              </a>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center rounded-full border border-cream/25 bg-transparent px-8 h-11 text-sm font-semibold hover:bg-cream/10 transition-colors"
                style={{ color: "var(--cream)" }}
              >
                <FileText className="mr-2 h-3.5 w-3.5" /> Submit a task
              </button>
            </div>

            <p className="font-serif text-xs italic text-cream/28 mt-8">
              Free for organizations during our pilot. No commitments.
            </p>
          </SlideUp>
        </div>
      </section>

      <Footer />

      {/* ── Modal ── */}
      <AnimatePresence>
        {showForm && <SubmitTaskModal onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
