"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  Star,
  Zap,
  Share2,
  Heart,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, SlideUp, ScaleOnTap } from "@/components/motion-wrapper"
import { mockOpportunities } from "@/lib/mock-data"
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

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const opportunity = mockOpportunities.find((op) => op.id === id)

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-sm text-espresso/40">Opportunity not found</p>
        <Link href="/opportunities" className="mt-3">
          <Button variant="outline" className="rounded-full text-xs font-semibold">
            <ArrowLeft className="mr-1.5 h-3 w-3" />
            Back to Browse
          </Button>
        </Link>
      </div>
    )
  }

  const colors = categoryColorMap[opportunity.category] ?? categoryColorMap.Community
  const spotsPercent = ((opportunity.totalSpots - opportunity.spotsLeft) / opportunity.totalSpots) * 100
  const isAlmostFull = opportunity.spotsLeft <= 5

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      {/* Back nav */}
      <FadeIn>
        <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso/35 hover:text-espresso transition-colors mb-5">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Opportunities
        </Link>
      </FadeIn>

      {/* Header Card */}
      <SlideUp>
        <Card className={cn(cardClass, "overflow-hidden mb-6")}>
          {/* Accent banner */}
          <div className={cn("h-2 w-full", colors.bg.replace("/12", ""))} style={{ opacity: 0.4 }} />

          <CardContent className="p-6">
            {/* Org + badges */}
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
              <div className="flex gap-1.5">
                {opportunity.urgent && (
                  <Badge className="rounded-full border-none bg-destructive/10 text-destructive font-bold text-xs">
                    <Zap className="mr-0.5 h-3 w-3" />
                    Urgent
                  </Badge>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold text-espresso mb-3 text-balance md:text-3xl">
              {opportunity.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-espresso/50 leading-relaxed mb-5">
              {opportunity.description}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { icon: Calendar, label: "Date", value: opportunity.date },
                { icon: Clock, label: "Duration", value: opportunity.timeCommitment },
                { icon: MapPin, label: "Location", value: opportunity.location.split(",")[0] },
                { icon: Star, label: "XP Reward", value: `${opportunity.xpReward} XP` },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 rounded-xl bg-latte/40 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-espresso/35">
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </div>
                  <span className="text-xs font-bold text-espresso">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Spots progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-espresso/40">
                  <Users className="inline h-3 w-3 mr-1" />
                  {opportunity.totalSpots - opportunity.spotsLeft} / {opportunity.totalSpots} spots filled
                </span>
                <span className={cn("text-xs font-bold", isAlmostFull ? "text-destructive" : "text-matcha-dark")}>
                  {opportunity.spotsLeft} left
                </span>
              </div>
              <Progress
                value={spotsPercent}
                className={cn(
                  "h-2 bg-muted [&>div]:rounded-full",
                  isAlmostFull ? "[&>div]:bg-destructive/60" : "[&>div]:bg-matcha"
                )}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {opportunity.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full text-xs font-medium text-espresso/45 border-border/50">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <ScaleOnTap className="flex-1">
                <Button className="w-full rounded-full bg-espresso text-card hover:bg-espresso/90 h-12 text-sm font-bold">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              </ScaleOnTap>
              <ScaleOnTap>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/60">
                  <Heart className="h-4 w-4 text-espresso/40" />
                  <span className="sr-only">Save</span>
                </Button>
              </ScaleOnTap>
              <ScaleOnTap>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/60">
                  <Share2 className="h-4 w-4 text-espresso/40" />
                  <span className="sr-only">Share</span>
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
            <div className="mt-4 flex items-center gap-4 text-[10px] text-espresso/35">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-matcha-dark" />
                Verified Organization
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-honey" />
                4.8 avg rating
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                120+ past volunteers
              </span>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
