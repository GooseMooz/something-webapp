"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  Calendar,
  Hourglass,
  CircleDot,
  ClipboardCheck,
  MessageSquare,
  Star,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion-wrapper"
import { mockApplications, type Application } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { haptic } from "@/lib/haptics"

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

type StatusFilter = "all" | Application["status"]

const statusConfig: Record<Application["status"], { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  accepted: { label: "Accepted", color: "text-matcha-dark", bg: "bg-matcha/12", border: "border-matcha/30", icon: CheckCircle2 },
  upcoming: { label: "Upcoming", color: "text-sky-dark", bg: "bg-sky/12", border: "border-sky/30", icon: Calendar },
  pending: { label: "Pending", color: "text-espresso/70", bg: "bg-honey/12", border: "border-honey/30", icon: Hourglass },
  waitlisted: { label: "Waitlisted", color: "text-espresso/60", bg: "bg-caramel/12", border: "border-caramel/30", icon: CircleDot },
  completed: { label: "Completed", color: "text-espresso/45", bg: "bg-espresso/6", border: "border-espresso/15", icon: ClipboardCheck },
}

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "accepted", label: "Accepted" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending", label: "Pending" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "completed", label: "Completed" },
]

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all")

  const filtered = filter === "all"
    ? mockApplications
    : mockApplications.filter((a) => a.status === filter)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="mb-6 relative">
          <motion.div className="absolute -top-1 right-2 hidden sm:block"
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={22} color="var(--caramel)" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-3 right-12 hidden sm:block"
            initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -4, 0] }}
            transition={{ delay: 0.75, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}>
            <Asterisk size={13} color="var(--matcha)" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">My Applications</h1>
          <p className="mt-1 text-sm text-espresso/40">
            Track all your volunteer applications in one place.
          </p>
        </div>
      </FadeIn>

      {/* Summary Cards */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(["accepted", "upcoming", "pending", "waitlisted", "completed"] as const).map((status) => {
            const count = mockApplications.filter((a) => a.status === status).length
            const config = statusConfig[status]
            return (
              <motion.button
                key={status}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setFilter(filter === status ? "all" : status); haptic("selection") }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
                  filter === status
                    ? cn(config.bg, config.border, "ring-2", config.border, "shadow-sm")
                    : cn(cardClass, "hover:border-border", config.bg.replace("/12", "/6").replace("/6", "/4"))
                )}
              >
                <config.icon className={cn("h-4 w-4", config.color)} />
                <span className={cn("text-xl font-extrabold", filter === status ? config.color : "text-espresso")}>{count}</span>
                <span className={cn("text-[10px] font-semibold", filter === status ? config.color : "text-espresso/35")}>
                  {config.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </FadeIn>

      {/* Filter pills */}
      <FadeIn delay={0.1}>
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setFilter(f.value); haptic("selection") }}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                filter === f.value
                  ? "border-espresso/20 bg-espresso text-card"
                  : "border-border/60 text-espresso/40 hover:text-espresso"
              )}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1 text-[10px] opacity-60">
                  {mockApplications.filter((a) => f.value === "all" || a.status === f.value).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* Results count */}
      <p className="mb-4 text-xs font-semibold text-espresso/25 uppercase tracking-wider">
        {filtered.length} application{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Application Cards -- responsive grid like browse */}
      <AnimatePresence mode="wait">
        <StaggerChildren key={filter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <StaggerItem key={app.id}>
              <ApplicationCard application={app} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </AnimatePresence>

      {filtered.length === 0 && (
        <FadeIn>
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-latte">
              <ClipboardCheck className="h-7 w-7 text-espresso/20" />
            </div>
            <p className="text-sm font-semibold text-espresso/40">No applications with this status</p>
            <Link href="/opportunities">
              <Button className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-sm font-bold">
                Browse Opportunities
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const config = statusConfig[application.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className={cn(cardClass, "overflow-hidden transition-all hover:shadow-md hover:shadow-espresso/[0.06] hover:border-border h-full border-l-2", config.border)}>
        <CardContent className="p-0">
          {/* Top accent strip */}
          <div className={cn("h-1 w-full", config.bg)} />

          <div className="flex flex-col gap-3 p-5">
            {/* Status + badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0", config.bg)}>
                  <StatusIcon className={cn("h-4 w-4", config.color)} />
                </div>
                <div>
                  <Badge className={cn("rounded-full border-none text-[10px] font-bold px-2.5 py-0.5", config.bg, config.color)}>
                    {config.label}
                  </Badge>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-matcha-dark shrink-0">
                <Star className="h-3 w-3 fill-matcha text-matcha" />
                +{application.xpReward} XP
              </span>
            </div>

            {/* Title + org */}
            <div>
              <h3 className="text-sm font-bold text-espresso leading-snug mb-0.5">{application.opportunityTitle}</h3>
              <p className="text-[11px] text-espresso/35">{application.organization}</p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 text-[11px] text-espresso/35">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {application.eventDate}
              </span>
              <span className="text-espresso/15">{"Applied "}{application.appliedDate}</span>
            </div>

            {/* Note */}
            {application.note && (
              <p className="text-[11px] text-espresso/45 flex items-start gap-1.5 bg-latte/50 rounded-xl px-3 py-2 leading-relaxed">
                <MessageSquare className="h-3 w-3 shrink-0 mt-0.5 text-espresso/25" />
                {application.note}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
