"use client"

import { use, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, MapPin, Clock, Calendar, Users, Star, Zap, Share2, Heart, CheckCircle2, FileText, Sparkles, Award, Shield, ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, SlideUp, ScaleOnTap, ConfettiBurst } from "@/components/motion-wrapper"
import { mockOpportunities, mockUser } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  Environment: { bg: "bg-matcha/12", text: "text-matcha-dark" },
  Education: { bg: "bg-sky/12", text: "text-sky-dark" },
  Community: { bg: "bg-caramel/12", text: "text-espresso/80" },
  "Arts & Culture": { bg: "bg-honey/12", text: "text-espresso/80" },
  Health: { bg: "bg-rose/12", text: "text-rose" },
  Technology: { bg: "bg-sky/12", text: "text-sky-dark" },
  Sports: { bg: "bg-caramel/12", text: "text-espresso/80" },
}
const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

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

                <h1 className="text-2xl font-extrabold text-espresso mb-3 text-balance md:text-3xl">{opportunity.title}</h1>
                <p className="text-sm text-espresso/50 leading-relaxed mb-5">{opportunity.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: Calendar, label: "Date", value: opportunity.date, accent: "text-sky-dark" },
                    { icon: Clock, label: "Duration", value: opportunity.timeCommitment, accent: "text-honey" },
                    { icon: MapPin, label: "Location", value: opportunity.location.split(",")[0], accent: "text-matcha-dark" },
                    { icon: Star, label: "XP Reward", value: `${opportunity.xpReward} XP`, accent: "text-caramel" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1 rounded-xl bg-latte/40 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-espresso/35">
                        <item.icon className={cn("h-3 w-3", item.accent)} /> {item.label}
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
                        <ScaleOnTap className="w-full">
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
                  <ScaleOnTap>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/60">
                      <Heart className="h-4 w-4 text-espresso/40" /><span className="sr-only">Save</span>
                    </Button>
                  </ScaleOnTap>
                  <ScaleOnTap>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/60">
                      <Share2 className="h-4 w-4 text-espresso/40" /><span className="sr-only">Share</span>
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
                    {Array.from({ length: Math.min(mockUser.badgesEarned, 5) }).map((_, i) => (
                      <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-matcha/10 text-matcha-dark">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                    ))}
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
