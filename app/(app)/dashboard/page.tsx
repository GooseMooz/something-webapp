"use client"

import {
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  TrendingUp,
  Shield,
  Trophy,
  ChevronRight,
  Heart,
  Code,
  Sunrise,
  Users,
  UsersRound,
  Timer,
  Sprout,
  Crown,
  Footprints,
  Flame,
  Target,
  ArrowUpRight,
  Calendar,
  FileText,
  CircleDot,
  Hourglass,
  ClipboardCheck,
  Waves,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,

} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { XpRing } from "@/components/xp-ring"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
  PulseGlow,
  ConfettiBurst,
} from "@/components/motion-wrapper"
import {
  mockUser,
  mockActivity,
  mockLeaderboard,
  mockBadges,
  mockApplications,
  weeklyXpData,
  monthlyImpactData,
  skillBreakdownData,
  streakData,
  type ActivityItem,
  type BadgeData,
  type Application,
} from "@/lib/mock-data"
import Link from "next/link"
import { cn } from "@/lib/utils"
import React from "react"

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

const badgeIconMap: Record<string, React.ElementType> = {
  Footprints, Waves, HandHeart: Heart, Users, Code, Sunrise, UsersRound, Timer, Sprout, Crown,
}
const activityIconMap: Record<string, React.ElementType> = {
  Sparkles, Award, CheckCircle: CheckCircle2, TrendingUp,
}

const statusConfig: Record<Application["status"], { label: string; color: string; icon: React.ElementType }> = {
  accepted: { label: "Accepted", color: "bg-matcha/15 text-matcha-dark", icon: CheckCircle2 },
  upcoming: { label: "Upcoming", color: "bg-sky/15 text-sky-dark", icon: Calendar },
  pending: { label: "Pending", color: "bg-honey/15 text-espresso/70", icon: Hourglass },
  waitlisted: { label: "Waitlisted", color: "bg-caramel/15 text-espresso/60", icon: CircleDot },
  completed: { label: "Completed", color: "bg-espresso/8 text-espresso/50", icon: ClipboardCheck },
}

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function DashboardPage() {
  const user = mockUser
  const [showConfetti, setShowConfetti] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 1500)
    return () => clearTimeout(timer)
  }, [])

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
                {"Hey, "}{user.name.split(" ")[0]}{"!"}
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
              {"You're on a "}<span className="font-bold text-matcha-dark">{streakData.current}-day streak</span>{" -- keep it going!"}
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

      {/* Row 1: XP Hero + Weekly Chart + Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        {/* XP & Level Hero */}
        <SlideUp className="sm:col-span-2 lg:col-span-1">
          <Card className={cn(cardClass, "relative overflow-hidden h-full")}>
            <div className="absolute inset-0 bg-gradient-to-br from-matcha/18 via-honey/6 to-rose/10" />
            <ConfettiBurst active={showConfetti} />
            <CardContent className="relative flex flex-col items-center gap-4 p-5">
              <PulseGlow>
                <XpRing xp={user.xp} xpToNextLevel={user.xpToNextLevel} level={user.level} size={120} />
              </PulseGlow>
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-espresso">{user.levelTitle}</h2>
                  <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-xs font-bold">
                    {"Lv."}{user.level}
                  </Badge>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between text-[10px] font-medium text-espresso/30 mb-1">
                    <span>{"Level "}{user.level}</span>
                    <span>{"Level "}{user.level + 1}</span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(user.xp / user.xpToNextLevel) * 100}
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
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <div className="flex items-center gap-1.5 rounded-full bg-sky/10 px-2.5 py-1">
                    <Shield className="h-3 w-3 text-sky-dark" />
                    <span className="text-[10px] font-bold text-sky-dark">{"Trust "}{user.trustScore}{"%"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-honey/10 px-2.5 py-1">
                    <Flame className="h-3 w-3 text-honey" />
                    <span className="text-[10px] font-bold text-espresso/60">{streakData.current}{" day streak"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Weekly XP Chart */}
        <SlideUp delay={0.06}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-espresso">This Week</h3>
                  <p className="text-[10px] text-espresso/35 mt-0.5">595 XP earned</p>
                </div>
                <Badge className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-bold">
                  <ArrowUpRight className="mr-0.5 h-2.5 w-2.5" />
                  +23%
                </Badge>
              </div>
              <ChartContainer
                config={{ xp: { label: "XP Earned", color: "#7EC8A0" } }}
                className="h-[160px] w-full"
              >
                <AreaChart data={weeklyXpData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7EC8A0" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#7EC8A0" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD2C3" strokeOpacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8B7B6B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#8B7B6B" }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="xp" stroke="#7EC8A0" strokeWidth={2} fill="url(#xpGrad)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Quick Stats (vertical on desktop, horizontal on mobile) */}
        <SlideUp delay={0.1}>
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-3 h-full">
            <MiniStat icon={Clock} label="Hours" value={user.hoursLogged} color="matcha" />
            <MiniStat icon={CheckCircle2} label="Tasks" value={user.tasksCompleted} color="sky" />
            <MiniStat icon={Award} label="Badges" value={user.badgesEarned} color="honey" />
          </div>
        </SlideUp>
      </div>

      {/* Row 2: Applications + Streak/Skills */}
      <div className="grid gap-4 lg:grid-cols-5 mb-4">
        {/* Applications Tracker */}
        <SlideUp delay={0.12} className="lg:col-span-3">
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
              <div className="flex flex-wrap gap-2 mb-4">
                {(["accepted", "upcoming", "pending", "waitlisted", "completed"] as const).map((status) => {
                  const count = mockApplications.filter(a => a.status === status).length
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

              {/* Application list */}
              <div className="flex flex-col gap-2">
                {mockApplications.slice(0, 4).map((app, i) => (
                  <ApplicationRow key={app.id} application={app} index={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Streak + Skill Pie */}
        <SlideUp delay={0.15} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            {/* Streak */}
            <Card className={cardClass}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-espresso flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-honey" />
                    Streak
                  </h3>
                  <span className="text-[10px] text-espresso/30">{"Best: "}{streakData.best}{"d"}</span>
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
                        streakData.thisWeek[i] ? streakColors[i] : "bg-muted/50"
                      )}>
                        {streakData.thisWeek[i] ? (
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

            {/* Skill Breakdown */}
            <Card className={cn(cardClass, "flex-1")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-3 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-sky-dark" />
                  Focus Areas
                </h3>
                <div className="flex items-center gap-4">
                  <ChartContainer
                    config={{
                      environment: { label: "Environment", color: "#7EC8A0" },
                      education: { label: "Education", color: "#8BB8E0" },
                      community: { label: "Community", color: "#C9A882" },
                      arts: { label: "Arts", color: "#E8B86D" },
                      tech: { label: "Tech", color: "#3D2C23" },
                    }}
                    className="h-[110px] w-[110px] shrink-0"
                  >
                    <PieChart>
                      <Pie data={skillBreakdownData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {skillBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    {skillBreakdownData.map((skill) => (
                      <div key={skill.name} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
                        <span className="text-[10px] font-semibold text-espresso/60 truncate">{skill.name}</span>
                        <span className="ml-auto text-[10px] font-bold text-espresso/30">{skill.value}{"%"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SlideUp>
      </div>

      {/* Row 3: Mini Calendar */}
      <SlideUp delay={0.16} className="mb-4">
        <Card className={cn(cardClass)}>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-espresso flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-sky-dark" />
                Upcoming Schedule
              </h3>
              <span className="text-[10px] text-espresso/30">March 2026</span>
            </div>
            {/* Mini calendar grid */}
            <MiniCalendar />
          </CardContent>
        </Card>
      </SlideUp>

      {/* Row 4: Monthly Impact + Activity */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        {/* Monthly Impact */}
        <SlideUp delay={0.18}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-espresso">Monthly Impact</h3>
                  <p className="text-[10px] text-espresso/35 mt-0.5">Hours & tasks over 6 months</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-espresso/40">
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#7EC8A0]" /> Hours</span>
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#8BB8E0]" /> Tasks</span>
                </div>
              </div>
              <ChartContainer
                config={{ hours: { label: "Hours", color: "#7EC8A0" }, tasks: { label: "Tasks", color: "#8BB8E0" } }}
                className="h-[170px] w-full"
              >
                <BarChart data={monthlyImpactData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD2C3" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8B7B6B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#8B7B6B" }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hours" fill="#7EC8A0" radius={[6, 6, 0, 0]} barSize={16} />
                  <Bar dataKey="tasks" fill="#8BB8E0" radius={[6, 6, 0, 0]} barSize={16} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Activity Feed */}
        <SlideUp delay={0.2}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-bold text-espresso flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-honey" />
                Recent Activity
              </h3>
              <div className="relative flex flex-col">
                <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border/60" />
                {mockActivity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <ActivityRow item={item} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Row 4: Badges + Leaderboard */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Badges */}
        <SlideUp delay={0.22} className="lg:col-span-3">
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
                <span className="text-[10px] text-espresso/30">
                  {mockBadges.filter(b => b.earned).length}{"/"}{mockBadges.length}
                </span>
              </div>
              <StaggerChildren className="grid grid-cols-5 gap-3 sm:grid-cols-5 md:grid-cols-5">
                {mockBadges.map((badge, i) => (
                  <StaggerItem key={badge.id}>
                    <BadgeIcon badge={badge} index={i} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Leaderboard */}
        <SlideUp delay={0.25} className="lg:col-span-2">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-espresso flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-honey" />
                  Leaderboard
                </h3>
                <Badge className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-semibold">
                  Top 5
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                {mockLeaderboard.map((entry, i) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl p-2 transition-colors",
                      entry.userId === user.id
                        ? "bg-matcha/8 ring-1 ring-matcha/20"
                        : "hover:bg-latte/60"
                    )}
                  >
                    <RankBadge rank={entry.rank} />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-latte text-[10px] font-bold text-espresso/40 shrink-0">
                      {entry.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-espresso">
                        {entry.name}
                        {entry.userId === user.id && (
                          <span className="ml-1 text-[10px] text-matcha-dark">(You)</span>
                        )}
                      </p>
                      <p className="text-[10px] text-espresso/30">{"Lv."}{entry.level}</p>
                    </div>
                    <span className="text-xs font-bold text-espresso/50 tabular-nums">
                      {entry.xp.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </div>
  )
}

/* -- Application Row -- */
function ApplicationRow({ application, index }: { application: Application; index: number }) {
  const config = statusConfig[application.status]
  const StatusIcon = config.icon

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
        <p className="truncate text-sm font-semibold text-espresso">{application.opportunityTitle}</p>
        <p className="text-[10px] text-espresso/35">{application.organization}{" \u00B7 "}{application.eventDate}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge className={cn("rounded-full border-none text-[9px] font-bold px-2 py-0.5", config.color)}>
          {config.label}
        </Badge>
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-matcha-dark">
          <Star className="h-2.5 w-2.5 fill-matcha text-matcha" />
          {"+"}{application.xpReward}{" XP"}
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

/* -- Rank Badge -- */
function RankBadge({ rank }: { rank: number }) {
  const medals: Record<number, string> = { 1: "\uD83E\uDD47", 2: "\uD83E\uDD48", 3: "\uD83E\uDD49" }
  return (
    <span className={cn(
      "flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-extrabold shrink-0",
      rank <= 3 ? "bg-honey/15 text-espresso" : "bg-muted text-espresso/30"
    )}>
      {medals[rank] ?? rank}
    </span>
  )
}

/* -- Activity Row -- */
function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = activityIconMap[item.icon] ?? Sparkles
  const typeColors: Record<string, string> = {
    xp_earned: "bg-matcha/12 text-matcha-dark",
    task_completed: "bg-sky/12 text-sky-dark",
    badge_earned: "bg-honey/12 text-espresso/70",
    level_up: "bg-caramel/12 text-espresso/70",
    signup: "bg-matcha/12 text-matcha-dark",
  }

  return (
    <div className="flex items-center gap-3 py-2 relative">
      <div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-lg shrink-0", typeColors[item.type] ?? "bg-muted text-espresso/30")}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-espresso">{item.title}</p>
        <p className="truncate text-[10px] text-espresso/35">{item.description}</p>
      </div>
      <span className="shrink-0 text-[10px] text-espresso/25">{item.timestamp}</span>
    </div>
  )
}

/* -- Badge Icon -- */
const badgeColorCycle = [
  "bg-matcha/18 text-matcha-dark",
  "bg-honey/20 text-espresso/70",
  "bg-sky/18 text-sky-dark",
  "bg-rose/15 text-rose",
  "bg-caramel/20 text-espresso/60",
]

function BadgeIcon({ badge, index = 0 }: { badge: BadgeData; index?: number }) {
  const Icon = badgeIconMap[badge.icon] ?? Award
  return (
    <div className="flex flex-col items-center gap-1.5 group" title={badge.description}>
      <motion.div
        whileHover={{ rotate: badge.earned ? 8 : 0, scale: 1.08 }}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all",
          badge.earned ? badgeColorCycle[index % badgeColorCycle.length] : "bg-muted/50 text-espresso/12"
        )}
      >
        {badge.earned ? (
          <>
            <Icon className="h-5 w-5" />
            <div className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-matcha flex items-center justify-center">
              <CheckCircle2 className="h-2 w-2 text-card" />
            </div>
          </>
        ) : (
          <span className="text-sm font-bold">?</span>
        )}
      </motion.div>
      <span className={cn(
        "text-[9px] font-semibold text-center leading-tight max-w-[60px]",
        badge.earned ? "text-espresso/60" : "text-espresso/15"
      )}>
        {badge.earned ? badge.name : "Locked"}
      </span>
    </div>
  )
}

/* -- Mini Calendar -- */
function MiniCalendar() {
  // March 2026: starts on Sunday (day 0)
  const daysInMonth = 31
  const startDay = 0 // Sunday
  const today = 3 // March 3

  // Events from applications (accepted/upcoming)
  const eventDays: Record<number, { title: string; color: string }> = {
    15: { title: "Beach Cleanup", color: "bg-matcha" },
    20: { title: "Coding Workshop", color: "bg-sky" },
    25: { title: "Welcome Event", color: "bg-caramel" },
  }

  const cells = []
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
          const event = eventDays[day]
          const isToday = day === today
          const isPast = day < today

          return (
            <motion.div
              key={day}
              whileHover={event ? { scale: 1.15 } : undefined}
              className={cn(
                "relative flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                isToday ? "bg-espresso text-card" : isPast ? "text-espresso/15" : "text-espresso/50 hover:bg-latte/60",
                event && !isToday && "ring-1 ring-matcha/30"
              )}
              title={event?.title}
            >
              {day}
              {event && (
                <span className={cn("absolute bottom-0.5 h-1.5 w-1.5 rounded-full", event.color)} />
              )}
            </motion.div>
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border/40">
        {Object.entries(eventDays).map(([day, event]) => (
          <div key={day} className="flex items-center gap-1.5 text-[10px] text-espresso/40">
            <span className={cn("h-2 w-2 rounded-full", event.color)} />
            <span className="font-semibold">Mar {day}</span>
            <span className="text-espresso/25">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
