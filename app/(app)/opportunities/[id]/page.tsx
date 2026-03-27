"use client"

import { use, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, MapPin, Clock, Calendar, Users, Star, Zap, Share2, Heart, CheckCircle2, FileText, Sparkles, Award, ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, SlideUp, ScaleOnTap, ConfettiBurst } from "@/components/motion-wrapper"
import { mockOpportunities, mockUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { haptic } from "@/lib/haptics"

const categoryColorMap: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  Environment:    { bg: "bg-matcha/12",  text: "text-matcha-dark",   accent: "bg-matcha",  border: "border-l-2 border-matcha/40" },
  Education:      { bg: "bg-sky/12",     text: "text-sky-dark",      accent: "bg-sky",     border: "border-l-2 border-sky/40" },
  Community:      { bg: "bg-caramel/12", text: "text-espresso/80",   accent: "bg-caramel", border: "border-l-2 border-caramel/40" },
  "Arts & Culture":{ bg: "bg-honey/12",  text: "text-espresso/80",   accent: "bg-honey",   border: "border-l-2 border-honey/40" },
  Health:         { bg: "bg-rose/12",    text: "text-rose",          accent: "bg-rose",    border: "border-l-2 border-rose/40" },
  Technology:     { bg: "bg-sky/12",     text: "text-sky-dark",      accent: "bg-sky",     border: "border-l-2 border-sky/40" },
  Sports:         { bg: "bg-caramel/12", text: "text-espresso/80",   accent: "bg-caramel", border: "border-l-2 border-caramel/40" },
}
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

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const opportunity = mockOpportunities.find((op) => op.id === id)
  const [applied, setApplied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-sm text-espresso/40">Opportunity not found</p>
        <Link href="/opportunities" className="mt-3">
          <Button variant="outline" className="rounded-full text-xs font-semibold"><ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Browse</Button>
        </Link>
      </div>
    )
  }

  const colors = categoryColorMap[opportunity.category] ?? categoryColorMap.Community
  const spotsPercent = ((opportunity.totalSpots - opportunity.spotsLeft) / opportunity.totalSpots) * 100
  const isAlmostFull = opportunity.spotsLeft <= 5

  function handleApply() {
    haptic("success")
    setApplied(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso/35 hover:text-espresso transition-colors mb-5">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
        </Link>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Main content */}
        <div className="lg:col-span-3">
          <SlideUp>
            <Card className={cn(cardClass, "overflow-hidden mb-5")}>
              <div className={cn("h-2 w-full", colors.bg.replace("/12", ""))} style={{ opacity: 0.35 }} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold", colors.bg, colors.text)}>
                      {opportunity.organization.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-espresso/55">{opportunity.organization}</p>
                      <Badge className={cn("rounded-full border-none text-[10px] font-semibold mt-1", colors.bg, colors.text)}>
                        {opportunity.category}
                      </Badge>
                    </div>
                  </div>
                  {opportunity.urgent && (
                    <Badge className="rounded-full border-none bg-destructive/10 text-destructive font-bold text-xs">
                      <Zap className="mr-0.5 h-3 w-3" /> Urgent
                    </Badge>
                  )}
                </div>

                <div className="relative">
                  <h1 className="text-2xl font-extrabold text-espresso mb-3 text-balance md:text-3xl">{opportunity.title}</h1>
                  <motion.div className="absolute -top-2 -right-1 hidden sm:block"
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 280 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 11, repeat: Infinity, ease: "linear" }}>
                      <Asterisk size={18} color={`var(--${opportunity.category === "Environment" ? "matcha" : opportunity.category === "Education" || opportunity.category === "Technology" ? "sky" : opportunity.category === "Health" ? "rose" : "honey"})`} />
                    </motion.div>
                  </motion.div>
                </div>
                <p className="text-sm text-espresso/50 leading-relaxed mb-5">{opportunity.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: Calendar, label: "Date",     value: opportunity.date,                      bg: "bg-sky/12",     icon_color: "text-sky-dark",    border: "border-l-2 border-sky/35" },
                    { icon: Clock,    label: "Duration", value: opportunity.timeCommitment,             bg: "bg-honey/12",   icon_color: "text-espresso/60", border: "border-l-2 border-honey/35" },
                    { icon: MapPin,   label: "Location", value: opportunity.location.split(",")[0],     bg: "bg-matcha/12",  icon_color: "text-matcha-dark", border: "border-l-2 border-matcha/35" },
                    { icon: Star,     label: "XP Reward",value: `${opportunity.xpReward} XP`,          bg: "bg-caramel/12", icon_color: "text-espresso/65", border: "border-l-2 border-caramel/35" },
                  ].map((item) => (
                    <div key={item.label} className={cn("flex flex-col gap-1 rounded-xl p-3", item.bg, item.border)}>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-espresso/45">
                        <item.icon className={cn("h-3 w-3", item.icon_color)} /> {item.label}
                      </div>
                      <span className="text-xs font-bold text-espresso">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-espresso/40">
                      <Users className="inline h-3 w-3 mr-1" />{opportunity.totalSpots - opportunity.spotsLeft} / {opportunity.totalSpots} spots filled
                    </span>
                    <span className={cn("text-xs font-bold", isAlmostFull ? "text-destructive" : "text-matcha-dark")}>{opportunity.spotsLeft} left</span>
                  </div>
                  <Progress value={spotsPercent} className={cn("h-2 bg-muted [&>div]:rounded-full", isAlmostFull ? "[&>div]:bg-destructive/60" : "[&>div]:bg-matcha")} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full text-xs font-medium text-espresso/45 border-border/50">{tag}</Badge>
                  ))}
                </div>

                {/* Apply button with animation */}
                <div className="relative flex gap-2">
                  <AnimatePresence mode="wait">
                    {!applied ? (
                      <motion.div key="apply" className="flex-1" exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <ScaleOnTap className="w-full" hapticPattern="medium">
                          <Button onClick={handleApply} className="w-full rounded-full bg-espresso text-card hover:bg-espresso/90 h-12 text-sm font-bold">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Apply Now
                          </Button>
                        </ScaleOnTap>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="applied"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative flex-1"
                      >
                        <ConfettiBurst active={showConfetti} />
                        <Button disabled className="w-full rounded-full bg-matcha text-espresso h-12 text-sm font-bold opacity-100">
                          <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.4, type: "spring" }}>
                            <CheckCircle2 className="mr-2 h-4 w-4 inline" />
                          </motion.span>
                          {"Application Sent!"}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <ScaleOnTap hapticPattern="light">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-rose/30 hover:bg-rose/10 hover:border-rose/50 transition-colors">
                      <Heart className="h-4 w-4 text-rose" /><span className="sr-only">Save</span>
                    </Button>
                  </ScaleOnTap>
                  <ScaleOnTap hapticPattern="light">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-sky/30 hover:bg-sky/10 hover:border-sky/50 transition-colors">
                      <Share2 className="h-4 w-4 text-sky-dark" /><span className="sr-only">Share</span>
                    </Button>
                  </ScaleOnTap>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* About the Organization */}
          <SlideUp delay={0.1}>
            <Card className={cardClass}>
              <CardContent className="p-6">
                <h2 className="text-sm font-bold text-espresso mb-3">About {opportunity.organization}</h2>
                <p className="text-xs text-espresso/45 leading-relaxed">
                  {opportunity.organization} is a Metro Vancouver-based nonprofit organization dedicated to creating positive change in the community. They regularly host volunteer events and are known for providing great experiences to young volunteers.
                </p>
                <div className="mt-4 flex items-center gap-4 text-[10px] text-espresso/35 flex-wrap">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-matcha-dark" /> Verified Organization</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-honey" /> 4.8 avg rating</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 120+ past volunteers</span>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>

        {/* Sidebar: Application Preview Card */}
        <div className="lg:col-span-2">
          <SlideUp delay={0.15}>
            <Card className={cn(cardClass, "sticky top-24")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-1 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-sky-dark" />
                  Your application preview
                </h3>
                <p className="text-[10px] text-espresso/35 mb-4">{"This is how the organization will see you."}</p>

                <div className="rounded-xl border border-border/60 bg-latte/30 p-4">
                  {/* Applicant header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-matcha/10 shrink-0">
                      {mockUser.avatar ? (
                        <Image src={mockUser.avatar} alt={mockUser.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-espresso/50">
                          {mockUser.name.split(" ").map(n => n[0]).join("")}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-espresso truncate">{mockUser.name}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-espresso/40">
                        <span className="flex items-center gap-0.5 font-bold text-matcha-dark">
                          <Sparkles className="h-2.5 w-2.5" /> {mockUser.xp} XP
                        </span>
                        <span>Lv.{mockUser.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-card p-2">
                      <span className="text-xs font-extrabold text-espresso">{mockUser.hoursLogged}</span>
                      <span className="text-[9px] text-espresso/30">Hours</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-card p-2">
                      <span className="text-xs font-extrabold text-espresso">{mockUser.tasksCompleted}</span>
                      <span className="text-[9px] text-espresso/30">Tasks</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-card p-2">
                      <span className="text-xs font-extrabold text-espresso">{mockUser.trustScore}%</span>
                      <span className="text-[9px] text-espresso/30">Trust</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-espresso/30 mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {mockUser.skills.map((skill) => (
                        <Badge key={skill} className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-medium">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Causes */}
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-espresso/30 mb-1.5">Causes</p>
                    <div className="flex flex-wrap gap-1">
                      {mockUser.causes.map((cause) => (
                        <Badge key={cause} className="rounded-full border-none bg-sky/10 text-sky-dark text-[10px] font-medium">{cause}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Resume link */}
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 rounded-lg bg-card border border-border/40 p-2.5 text-xs font-semibold text-espresso/50 hover:text-espresso hover:border-border transition-all group">
                    <FileText className="h-3.5 w-3.5 text-sky-dark" />
                    Resume
                    <ExternalLink className="ml-auto h-3 w-3 text-espresso/20 group-hover:text-espresso/50 transition-colors" />
                  </a>
                </div>

                {/* Badges preview */}
                <div className="mt-4">
                  <p className="text-[10px] font-semibold text-espresso/30 mb-2">Earned Badges</p>
                  <div className="flex gap-1.5">
                    {Array.from({ length: Math.min(mockUser.badgesEarned, 5) }).map((_, i) => {
                      const badgeColors = ["bg-matcha/18 text-matcha-dark","bg-honey/18 text-espresso/70","bg-sky/18 text-sky-dark","bg-rose/15 text-rose","bg-caramel/18 text-espresso/60"]
                      return (
                      <motion.div key={i} whileHover={{ scale: 1.1, rotate: 8 }} transition={{ type: "spring", stiffness: 400 }}
                        className={cn("flex h-8 w-8 items-center justify-center rounded-lg", badgeColors[i])}>
                        <Award className="h-3.5 w-3.5" />
                      </motion.div>
                    )})}
                    {mockUser.badgesEarned > 5 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-[10px] font-bold text-espresso/30">
                        +{mockUser.badgesEarned - 5}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </div>
    </div>
  )
}
