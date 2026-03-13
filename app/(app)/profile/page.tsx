"use client"

import { motion } from "framer-motion"
import {
  MapPin,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  Shield,
  Flame,
  Edit3,
  Share2,
  Heart,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XpRing } from "@/components/xp-ring"
import {
  FadeIn,
  SlideUp,
  StaggerChildren,
  StaggerItem,
  ScaleOnTap,
} from "@/components/motion-wrapper"
import { mockUser, mockBadges, streakData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

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

export default function ProfilePage() {
  const user = mockUser
  const earnedBadges = mockBadges.filter((b) => b.earned)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      {/* Profile Header Card */}
      <FadeIn>
        <Card className={cn(cardClass, "overflow-hidden mb-5")}>
          {/* Colorful banner with animated decorative elements */}
          <div className="relative h-24 overflow-hidden bg-gradient-to-r from-matcha/25 via-honey/15 to-rose/20">
            {/* Animated dots pattern */}
            {[
              { x: "8%", y: "30%", color: "var(--matcha)", size: 8, delay: 0 },
              { x: "20%", y: "60%", color: "var(--honey)", size: 12, delay: 0.3 },
              { x: "35%", y: "25%", color: "var(--rose)", size: 6, delay: 0.6 },
              { x: "50%", y: "65%", color: "var(--caramel)", size: 10, delay: 0.2 },
              { x: "65%", y: "20%", color: "var(--sky)", size: 8, delay: 0.8 },
              { x: "78%", y: "55%", color: "var(--matcha)", size: 6, delay: 0.4 },
              { x: "88%", y: "30%", color: "var(--honey)", size: 10, delay: 1.0 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-50"
                style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, backgroundColor: dot.color }}
                animate={{ y: [0, -6, 0], opacity: [0.5, 0.75, 0.5] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
              />
            ))}
            {/* Asterisk decorations */}
            <motion.div className="absolute" style={{ left: "42%", top: "15%" }}
              animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={16} color="var(--espresso)" className="opacity-20" />
            </motion.div>
            <motion.div className="absolute" style={{ left: "72%", top: "40%" }}
              animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={20} color="var(--espresso)" className="opacity-15" />
            </motion.div>
            <motion.div className="absolute" style={{ left: "15%", top: "20%" }}
              animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={12} color="var(--espresso)" className="opacity-20" />
            </motion.div>
          </div>
          <CardContent className="relative px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-col items-center -mt-10 sm:flex-row sm:items-end sm:gap-5">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-matcha/20 border-4 border-card text-2xl font-extrabold text-espresso shadow-lg"
              >
                {user.name.split(" ").map(n => n[0]).join("")}
              </motion.div>

              <div className="mt-2 flex flex-1 flex-col items-center sm:items-start sm:mt-1 min-w-0">
                <h1 className="text-lg font-extrabold text-espresso">{user.name}</h1>
                <p className="text-xs text-espresso/40 flex items-center gap-1.5 mt-0.5 flex-wrap justify-center sm:justify-start">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Vancouver, BC</span>
                  <span className="text-espresso/15">|</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {"Joined "}{new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </p>
              </div>

              <div className="mt-3 flex gap-2 sm:mt-0">
                <ScaleOnTap>
                  <Button variant="outline" size="sm" className="rounded-full border-border/60 text-xs font-semibold text-espresso/50 h-8">
                    <Share2 className="mr-1.5 h-3 w-3" />
                    Share
                  </Button>
                </ScaleOnTap>
                <ScaleOnTap>
                  <Button size="sm" className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-xs font-bold h-8">
                    <Edit3 className="mr-1.5 h-3 w-3" />
                    Edit Profile
                  </Button>
                </ScaleOnTap>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-3 text-sm text-espresso/50 leading-relaxed max-w-xl mx-auto sm:mx-0">
              {user.bio}
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Two-column layout: Stats + Level on left, Skills/Causes on right */}
      <div className="grid gap-4 lg:grid-cols-5 mb-4">
        {/* Level + Stats */}
        <SlideUp delay={0.06} className="lg:col-span-3">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5 flex flex-col sm:flex-row gap-5 items-center">
              <XpRing xp={user.xp} xpToNextLevel={user.xpToNextLevel} level={user.level} size={100} />
              <div className="flex flex-col gap-3 flex-1 w-full">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-base font-extrabold text-espresso">{user.levelTitle}</h3>
                  <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-xs font-bold">
                    {"Lv."}{user.level}
                  </Badge>
                </div>
                <div>
                  <Progress
                    value={(user.xp / user.xpToNextLevel) * 100}
                    className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-matcha [&>div]:to-matcha-dark [&>div]:rounded-full"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="flex items-center gap-1 rounded-full bg-honey/10 px-2.5 py-1 text-[10px] font-bold text-espresso/60">
                    <Flame className="h-3 w-3 text-honey" />
                    {streakData.current}{" day streak"}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-[10px] font-bold text-sky-dark">
                    <Shield className="h-3 w-3" />
                    {"Trust "}{user.trustScore}{"%"}
                  </span>
                </div>
                {/* Inline stats row */}
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[
                    { label: "Hours", value: user.hoursLogged, icon: Clock },
                    { label: "Tasks", value: user.tasksCompleted, icon: CheckCircle2 },
                    { label: "Badges", value: user.badgesEarned, icon: Award },
                    { label: "Trust", value: `${user.trustScore}%`, icon: Shield },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-0.5 rounded-xl bg-latte/50 p-2.5">
                      <stat.icon className="h-3.5 w-3.5 text-espresso/25" />
                      <span className="text-base font-extrabold text-espresso">{stat.value}</span>
                      <span className="text-[9px] font-semibold text-espresso/30">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Skills + Causes (stacked on right) */}
        <SlideUp delay={0.1} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            <Card className={cn(cardClass, "flex-1")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-matcha-dark" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((skill, i) => {
                    const colors = [
                      "bg-matcha/15 text-matcha-dark",
                      "bg-honey/15 text-espresso/70",
                      "bg-sky/15 text-sky-dark",
                      "bg-caramel/15 text-espresso/60",
                      "bg-rose/12 text-rose",
                    ]
                    return (
                      <motion.div key={skill} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Badge className={cn("rounded-full border-none text-xs font-semibold", colors[i % colors.length])}>
                          {skill}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className={cn(cardClass, "flex-1")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-3 flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose" />
                  Causes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.causes.map((cause, i) => {
                    const colors = [
                      "bg-rose/12 text-rose",
                      "bg-matcha/15 text-matcha-dark",
                      "bg-caramel/15 text-espresso/60",
                      "bg-honey/15 text-espresso/70",
                      "bg-sky/15 text-sky-dark",
                    ]
                    return (
                      <motion.div key={cause} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Badge className={cn("rounded-full border-none text-xs font-semibold", colors[i % colors.length])}>
                          {cause}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </SlideUp>
      </div>

      {/* Badges -- full width grid */}
      <SlideUp delay={0.15}>
        <Card className={cardClass}>
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-espresso mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-honey" />
              {"Earned Badges ("}{earnedBadges.length}{")"}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <Asterisk size={13} color="var(--honey)" />
              </motion.div>
            </h3>
            <StaggerChildren className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {earnedBadges.map((badge, idx) => {
                const badgeColors = [
                  { bg: "bg-matcha/20", text: "text-matcha-dark", ring: "ring-matcha/30" },
                  { bg: "bg-honey/20", text: "text-espresso/70", ring: "ring-honey/30" },
                  { bg: "bg-sky/20", text: "text-sky-dark", ring: "ring-sky/30" },
                  { bg: "bg-rose/15", text: "text-rose", ring: "ring-rose/25" },
                  { bg: "bg-caramel/20", text: "text-espresso/60", ring: "ring-caramel/30" },
                ]
                const color = badgeColors[idx % badgeColors.length]
                return (
                <StaggerItem key={badge.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.12 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={cn("flex h-12 w-12 items-center justify-center rounded-xl ring-1", color.bg, color.text, color.ring)}
                    >
                      <Award className="h-5 w-5" />
                    </motion.div>
                    <span className={cn("text-[9px] font-semibold text-center leading-tight", color.text, "opacity-80")}>
                      {badge.name}
                    </span>
                  </div>
                </StaggerItem>
                )
              })}
            </StaggerChildren>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
