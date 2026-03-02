"use client"

import { MapPin, Clock, Sparkles, Users, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScaleOnTap } from "@/components/motion-wrapper"
import type { Opportunity } from "@/lib/mock-data"

const categoryColors: Record<string, string> = {
  Environment: "bg-matcha/20 text-accent-foreground border-matcha/30",
  Education: "bg-sky/20 text-sky-dark border-sky/30",
  Community: "bg-caramel/20 text-espresso border-caramel/30",
  "Arts & Culture": "bg-chart-4/20 text-espresso border-chart-4/30",
  Health: "bg-matcha/20 text-accent-foreground border-matcha/30",
  Technology: "bg-sky/20 text-sky-dark border-sky/30",
  Sports: "bg-caramel/20 text-espresso border-caramel/30",
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const spotsPercent =
    ((opportunity.totalSpots - opportunity.spotsLeft) / opportunity.totalSpots) *
    100

  return (
    <ScaleOnTap className="w-full">
      <Card className="group relative overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-lg hover:shadow-espresso/5 h-full">
        {opportunity.urgent && (
          <div className="absolute right-3 top-3 z-10">
            <Badge className="rounded-full border-none bg-destructive/10 text-destructive font-bold text-xs px-2.5 py-1 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Urgent
            </Badge>
          </div>
        )}
        <CardContent className="flex h-full flex-col gap-3 p-5">
          {/* Org + Category */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-latte text-sm font-bold text-espresso shrink-0">
                {opportunity.organization.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-espresso/60">
                  {opportunity.organization}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold leading-snug text-espresso text-balance">
            {opportunity.title}
          </h3>

          {/* Category Badge */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              className={`rounded-full border text-xs font-semibold ${
                categoryColors[opportunity.category] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {opportunity.category}
            </Badge>
            {opportunity.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full text-xs font-medium text-espresso/60 border-border"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Meta */}
          <div className="mt-auto flex flex-col gap-1.5 text-xs text-espresso/60">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{opportunity.timeCommitment}</span>
            </div>
          </div>

          {/* XP + Spots + Apply */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-bold text-matcha-dark">
                <Sparkles className="h-3.5 w-3.5" />
                {opportunity.xpReward} XP
              </div>
              <div className="flex items-center gap-1 text-xs text-espresso/50">
                <Users className="h-3 w-3" />
                {opportunity.spotsLeft} spots
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-full bg-matcha font-bold text-espresso hover:bg-matcha-dark h-8 px-4 text-xs"
            >
              Apply
            </Button>
          </div>

          {/* Spots Fill Bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-matcha transition-all"
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </ScaleOnTap>
  )
}
