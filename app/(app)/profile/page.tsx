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

export default function ProfilePage() {
  const user = mockUser
  const earnedBadges = mockBadges.filter((b) => b.earned)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      {/* Profile Header Card */}
      <FadeIn>
        <Card className={cn(cardClass, "overflow-hidden mb-5")}>
          <div className="h-20 bg-gradient-to-r from-matcha/20 via-sky/15 to-honey/15" />
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
                  <p className="text-[10px] text-espresso/35 mt-1">
                    {user.xp}{" / "}{user.xpToNextLevel}{" XP -- "}{user.xpToNextLevel - user.xp}{" to next level"}
                  </p>
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
                  {user.skills.map((skill) => (
                    <Badge key={skill} className="rounded-full border-none bg-matcha/10 text-matcha-dark text-xs font-semibold">
                      {skill}
                    </Badge>
                  ))}
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
                  {user.causes.map((cause) => (
                    <Badge key={cause} className="rounded-full border-none bg-sky/10 text-sky-dark text-xs font-semibold">
                      {cause}
                    </Badge>
                  ))}
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
            <h3 className="text-sm font-bold text-espresso mb-4 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-honey" />
              {"Earned Badges ("}{earnedBadges.length}{")"}
            </h3>
            <StaggerChildren className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {earnedBadges.map((badge) => (
                <StaggerItem key={badge.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-matcha/12 text-matcha-dark"
                    >
                      <Award className="h-5 w-5" />
                    </motion.div>
                    <span className="text-[9px] font-semibold text-espresso/50 text-center leading-tight">
                      {badge.name}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
