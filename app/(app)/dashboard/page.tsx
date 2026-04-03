"use client"

import {
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  Trophy,
  ChevronRight,
  Flame,
  Target,
  Calendar,
  FileText,
  Hourglass,
  TrendingUp,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XpRing } from "@/components/xp-ring"
import {
  FadeIn,
  ScaleOnTap,
  PulseGlow,
  ConfettiBurst,
} from "@/components/motion-wrapper"
import { applicationsApi, ApiApplication, difficultyXp, formatDate, normalizeCause } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"

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

const statusConfig: Record<"pending" | "accepted" | "rejected", { label: string; color: string; icon: React.ElementType }> = {
  accepted: { label: "Accepted", color: "bg-matcha/15 text-matcha-dark", icon: CheckCircle2 },
  pending:  { label: "Pending",  color: "bg-honey/15 text-espresso/70",  icon: Hourglass },
  rejected: { label: "Rejected", color: "bg-rose/15 text-rose",          icon: X },
}

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function DashboardPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<ApiApplication[]>([])
  const [loadingApps, setLoadingApps] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("sth_auth_token")
    if (!token) { setLoadingApps(false); return }
    applicationsApi.list(token)
      .then(setApplications)
      .catch(() => {})
      .finally(() => setLoadingApps(false))
  }, [])

  const firstName = user?.name?.split(" ")[0] ?? "there"

  // Gamification not yet backed by the API — show neutral starting state
  const level = 1
  const xp = 0
  const xpToNextLevel = 500
  const streak = { current: 0, best: 0, thisWeek: Array(7).fill(false) as boolean[] }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">

      {/* Header */}
      <FadeIn>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between relative">
          {/* Decorative asterisks */}
          <motion.div className="absolute -top-2 right-32 hidden sm:block"
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={22} color="var(--honey)" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-1 right-48 hidden sm:block"
            initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -4, 0] }}
            transition={{ delay: 0.8, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}>
            <Asterisk size={14} color="var(--rose)" />
          </motion.div>
          <motion.div className="absolute -top-3 left-64 hidden md:block"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, rotate: [0, 15, -15, 0] }}
            transition={{ delay: 1.0, rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>
            <Asterisk size={16} color="var(--matcha)" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">
                {"Hey, "}{firstName}{"!"}
              </h1>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-2xl"
                role="img"
                aria-label="wave"
              >
                {"\uD83D\uDC4B"}
              </motion.span>
            </div>
            <p className="mt-1 text-sm text-espresso/40">
              {"Welcome to your dashboard."}
            </p>
          </div>
          <ScaleOnTap hapticPattern="medium">
            <Link href="/opportunities">
              <Button className="rounded-full bg-matcha font-bold text-espresso hover:bg-matcha-dark h-10 px-5">
                <Sparkles className="mr-2 h-4 w-4" />
                Find Opportunities
              </Button>
            </Link>
          </ScaleOnTap>
        </div>
      </FadeIn>

      {/* Row 1: XP Hero + About + Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        {/* XP & Level Hero */}
        <FadeIn className="sm:col-span-2 lg:col-span-1">
          <Card className={cn(cardClass, "relative overflow-hidden h-full")}>
            <div className="absolute inset-0 bg-gradient-to-br from-matcha/18 via-honey/6 to-rose/10" />
            <ConfettiBurst active={showConfetti} />
            <CardContent className="relative flex flex-col items-center gap-4 p-5">
              <PulseGlow>
                <XpRing xp={xp} xpToNextLevel={xpToNextLevel} level={level} size={120} />
              </PulseGlow>
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-espresso">New Volunteer</h2>
                  <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-xs font-bold">
                    {"Lv."}{level}
                  </Badge>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between text-[10px] font-medium text-espresso/30 mb-1">
                    <span>{"Level "}{level}</span>
                    <span>{"Level "}{level + 1}</span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(xp / xpToNextLevel) * 100}
                      className="h-2.5 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-matcha [&>div]:to-matcha-dark [&>div]:rounded-full"
                    />
                    <motion.div
                      className="absolute top-0 h-2.5 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ width: "30%" }}
                      animate={{ left: ["-30%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-honey/10 px-2.5 py-1">
                  <Flame className="h-3 w-3 text-honey" />
                  <span className="text-[10px] font-bold text-espresso/60">{streak.current}{" day streak"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* About / Profile summary */}
        <FadeIn delay={0.06}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5 flex flex-col gap-3 h-full">
              <h3 className="text-sm font-bold text-espresso">About You</h3>
              {user?.bio ? (
                <p className="text-xs text-espresso/60 leading-relaxed flex-1">{user.bio}</p>
              ) : (
                <p className="text-xs text-espresso/35 italic flex-1">{"No bio yet — add one in your profile."}</p>
              )}
              {user?.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.slice(0, 6).map(skill => (
                    <Badge key={skill} className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
              <ScaleOnTap hapticPattern="light">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-espresso/40 hover:text-espresso h-7 w-full">
                    Edit Profile <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </ScaleOnTap>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Quick Stats */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-3 h-full">
            <MiniStat icon={Clock} label="Hours" value={0} color="matcha" />
            <MiniStat icon={CheckCircle2} label="Tasks" value={0} color="sky" />
            <MiniStat icon={Award} label="Badges" value={0} color="honey" />
          </div>
        </FadeIn>
      </div>

      {/* Row 2: Applications + Streak/Causes */}
      <div className="grid gap-4 lg:grid-cols-5 mb-4">
        {/* Applications Tracker */}
        <FadeIn delay={0.12} className="lg:col-span-3">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-espresso flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-sky-dark" />
                  My Applications
                </h3>
                <Link href="/applications">
                  <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-espresso/40 hover:text-espresso h-7">
                    View All <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Status summary pills */}
              {applications.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(["accepted", "pending", "rejected"] as const).map((status) => {
                    const count = applications.filter(a => a.status === status).length
                    if (count === 0) return null
                    const config = statusConfig[status]
                    return (
                      <motion.div
                        key={status}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold", config.color)}
                      >
                        <config.icon className="h-3 w-3" />
                        {count} {config.label}
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Application list */}
              {loadingApps ? (
                <div className="flex flex-col gap-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="h-[60px] rounded-xl bg-muted/50 animate-pulse" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10">
                    <FileText className="h-5 w-5 text-sky-dark" />
                  </div>
                  <p className="text-sm font-semibold text-espresso/50">No applications yet</p>
                  <p className="text-xs text-espresso/30">{"Browse opportunities and apply to get started."}</p>
                  <Link href="/opportunities">
                    <Button variant="ghost" size="sm" className="rounded-full text-xs mt-1">
                      Browse opportunities
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {applications.slice(0, 4).map((app, i) => (
                    <ApplicationRow key={app.id} application={app} index={i} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Streak + Causes */}
        <FadeIn delay={0.15} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            {/* Streak */}
            <Card className={cardClass}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-espresso flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-honey" />
                    Streak
                  </h3>
                  <span className="text-[10px] text-espresso/30">{"Best: "}{streak.best}{"d"}</span>
                </div>
                <div className="flex justify-between gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                    const streakColors = [
                      "bg-matcha/20 text-matcha-dark",
                      "bg-honey/20 text-espresso/70",
                      "bg-sky/20 text-sky-dark",
                      "bg-rose/20 text-rose",
                      "bg-caramel/20 text-espresso/70",
                      "bg-matcha/20 text-matcha-dark",
                      "bg-honey/20 text-espresso/70",
                    ]
                    const flameColors = ["text-matcha-dark", "text-honey", "text-sky-dark", "text-rose", "text-caramel", "text-matcha-dark", "text-honey"]
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 400 }}
                        className="flex flex-col items-center gap-1 flex-1"
                      >
                        <span className="text-[9px] font-semibold text-espresso/30">{day}</span>
                        <div className={cn(
                          "flex h-9 w-full items-center justify-center rounded-lg",
                          streak.thisWeek[i] ? streakColors[i] : "bg-muted/50"
                        )}>
                          {streak.thisWeek[i] ? (
                            <Flame className={cn("h-3.5 w-3.5", flameColors[i])} />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-espresso/8" />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Your Causes */}
            <Card className={cn(cardClass, "flex-1")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-3 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-sky-dark" />
                  Your Causes
                </h3>
                {user?.categories && user.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.categories.map(cat => (
                      <Badge key={cat} className="rounded-full border-none bg-sky/12 text-sky-dark text-xs font-medium px-3 py-1">
                        {normalizeCause(cat)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-espresso/35 italic">{"No causes selected yet. Update your profile to add some."}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>

      {/* Row 3: Mini Calendar */}
      <FadeIn delay={0.16} className="mb-4">
        <Card className={cn(cardClass)}>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-espresso flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-sky-dark" />
                Upcoming Schedule
              </h3>
              <span className="text-[10px] text-espresso/30">
                {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <MiniCalendar />
          </CardContent>
        </Card>
      </FadeIn>

      {/* Row 4: Impact + Activity */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        {/* Monthly Impact — empty state */}
        <FadeIn delay={0.18}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5 flex flex-col items-center justify-center gap-3 min-h-[200px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-matcha/10">
                <TrendingUp className="h-5 w-5 text-matcha-dark" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-espresso">Monthly Impact</p>
                <p className="text-xs text-espresso/40 mt-1 max-w-[220px]">
                  {"Your volunteer history will appear here as you complete opportunities."}
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Activity Feed — empty state */}
        <FadeIn delay={0.2}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-bold text-espresso flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-honey" />
                Recent Activity
              </h3>
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey/10">
                  <Sparkles className="h-5 w-5 text-honey" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-espresso/50">No activity yet</p>
                  <p className="text-xs text-espresso/30">{"Your actions will show up here."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Row 5: Badges + Leaderboard */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Badges */}
        <FadeIn delay={0.22} className="lg:col-span-3">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-espresso flex items-center gap-2">
                  <Award className="h-4 w-4 text-honey" />
                  Badges
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                    <Asterisk size={13} color="var(--honey)" />
                  </motion.div>
                </h3>
                <span className="text-[10px] text-espresso/30">0 earned</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-honey/10">
                  <Award className="h-6 w-6 text-honey" />
                </div>
                <p className="text-xs text-espresso/40 text-center max-w-[220px]">
                  {"No badges yet — complete your first opportunity to earn one."}
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Leaderboard */}
        <FadeIn delay={0.25} className="lg:col-span-2">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-espresso flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-honey" />
                  Leaderboard
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey/10">
                  <Trophy className="h-5 w-5 text-honey" />
                </div>
                <p className="text-xs text-espresso/40 text-center">
                  {"Coming soon."}
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}

/* -- Application Row -- */
function ApplicationRow({ application, index }: { application: ApiApplication; index: number }) {
  const status = application.status
  const config = statusConfig[status]
  const StatusIcon = config.icon
  const title = application.opportunity?.title ?? "Unknown opportunity"
  const org = application.opportunity?.org?.name ?? "—"
  const date = application.opportunity?.date ? formatDate(application.opportunity.date) : "—"
  const xp = application.opportunity ? difficultyXp(application.opportunity.difficulty) : 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.06 }}
      className="flex items-center gap-3 rounded-xl bg-latte/40 p-3 transition-colors hover:bg-latte/70"
    >
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", config.color)}>
        <StatusIcon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-espresso">{title}</p>
        <p className="text-[10px] text-espresso/35">{org}{" \u00B7 "}{date}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge className={cn("rounded-full border-none text-[9px] font-bold px-2 py-0.5", config.color)}>
          {config.label}
        </Badge>
        <span className="text-[10px] font-bold text-matcha-dark">
          {"+"}{xp}{" XP"}
        </span>
      </div>
    </motion.div>
  )
}

/* -- Mini Stat -- */
function MiniStat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: "matcha" | "sky" | "honey" }) {
  const accentMap = {
    matcha: { icon: "bg-matcha/15 text-matcha-dark", border: "border-l-2 border-matcha/50" },
    sky: { icon: "bg-sky/15 text-sky-dark", border: "border-l-2 border-sky/50" },
    honey: { icon: "bg-honey/15 text-espresso/70", border: "border-l-2 border-honey/50" },
  }
  return (
    <Card className={cn(cardClass, "h-full overflow-hidden", accentMap[color].border)}>
      <CardContent className="flex items-center gap-3 p-3.5">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg shrink-0", accentMap[color].icon)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xl font-extrabold leading-none text-espresso tabular-nums">{value}</p>
          <p className="text-[10px] font-medium text-espresso/40 mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/* -- Mini Calendar -- */
function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay = new Date(year, month, 1).getDay()

  const cells: (number | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-center text-[9px] font-bold text-espresso/25 py-1">{d}</span>
        ))}
      </div>
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const isToday = day === today
          const isPast = day < today
          return (
            <div
              key={day}
              className={cn(
                "relative flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                isToday ? "bg-espresso text-card" : isPast ? "text-espresso/15" : "text-espresso/50 hover:bg-latte/60"
              )}
            >
              {day}
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-espresso/30 mt-3 pt-3 border-t border-border/40 text-center">
        {"No scheduled events yet — accepted opportunities will appear here."}
      </p>
    </div>
  )
}
