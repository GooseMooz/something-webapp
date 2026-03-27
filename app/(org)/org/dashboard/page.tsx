"use client"

import { motion } from "framer-motion"
import { Users, Calendar, CheckCircle2, TrendingUp, Zap, ArrowUpRight, Mail } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FadeIn, SlideUp, ScaleOnTap } from "@/components/motion-wrapper"
import { mockOrg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

const monthlyData = [
  { month: "Oct", volunteers: 18, events: 3 },
  { month: "Nov", volunteers: 24, events: 4 },
  { month: "Dec", volunteers: 12, events: 2 },
  { month: "Jan", volunteers: 32, events: 5 },
  { month: "Feb", volunteers: 28, events: 4 },
  { month: "Mar", volunteers: 15, events: 3 },
]

export default function OrgDashboardPage() {
  const org = mockOrg

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-espresso/40">{org.name} overview</p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total Events", value: org.totalEvents, icon: Calendar, color: "bg-matcha/10 text-matcha-dark" },
          { label: "Completed", value: org.completedEvents, icon: CheckCircle2, color: "bg-sky/10 text-sky-dark" },
          { label: "Active/Hiring", value: org.activeEvents, icon: Zap, color: "bg-honey/10 text-espresso/70" },
          { label: "Total Hired", value: org.totalHired, icon: Users, color: "bg-caramel/10 text-espresso/60" },
          { label: "Total Volunteers", value: org.totalVolunteers, icon: TrendingUp, color: "bg-rose/10 text-rose" },
        ].map(stat => (
          <SlideUp key={stat.label}>
            <Card className={cn(cardClass, "h-full")}>
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold text-espresso">{stat.value}</span>
                <span className="text-[10px] font-semibold text-espresso/35 text-center">{stat.label}</span>
              </CardContent>
            </Card>
          </SlideUp>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <SlideUp delay={0.1}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-espresso">Monthly Activity</h3>
                  <p className="text-[10px] text-espresso/35 mt-0.5">Volunteers & events over 6 months</p>
                </div>
                <Badge className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-bold">
                  <ArrowUpRight className="mr-0.5 h-2.5 w-2.5" /> +15%
                </Badge>
              </div>
              <ChartContainer config={{ volunteers: { label: "Volunteers", color: "#7EC8A0" }, events: { label: "Events", color: "#8BB8E0" } }} className="h-[200px] w-full">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD2C3" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8B7B6B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#8B7B6B" }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="volunteers" fill="#7EC8A0" radius={[6, 6, 0, 0]} barSize={18} />
                  <Bar dataKey="events" fill="#8BB8E0" radius={[6, 6, 0, 0]} barSize={18} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp delay={0.15}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-espresso mb-4">What{"'"}s Coming Up</h3>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Shoreline Planting at New Brighton", date: "Mar 15", spots: "8/25 spots left", status: "Hiring" },
                  { title: "Wetland Restoration Day", date: "Mar 22", spots: "12/30 spots left", status: "Hiring" },
                  { title: "Invasive Species Removal", date: "Apr 5", spots: "10/15 spots left", status: "Hiring" },
                ].map(event => (
                  <motion.div key={event.title} whileHover={{ x: 3 }} className="flex items-center gap-3 rounded-xl bg-latte/40 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha/10 text-matcha-dark shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-espresso truncate">{event.title}</p>
                      <p className="text-[10px] text-espresso/35">{event.date} -- {event.spots}</p>
                    </div>
                    <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-[10px] font-bold shrink-0">
                      {event.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Recent Hires */}
      <SlideUp delay={0.2}>
        <Card className={cardClass}>
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-espresso mb-3">Recently Accepted Volunteers</h3>
            <div className="flex flex-col gap-2">
              {[
                { name: "Alex Rivera", xp: 3400, event: "Beach Cleanup", date: "Feb 25", email: "alex.rivera@email.com" },
                { name: "Sophia Park", xp: 1100, event: "Community Garden", date: "Feb 27", email: "sophia.park@email.com" },
              ].map(v => (
                <div key={v.name} className="flex items-center gap-3 rounded-xl bg-latte/40 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha/15 text-xs font-bold text-espresso/50">
                    {v.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-espresso">{v.name}</p>
                    <p className="text-[10px] text-espresso/35">{v.event} -- Accepted {v.date}</p>
                  </div>
                  <span className="text-xs font-bold text-matcha-dark mr-2">{v.xp} XP</span>
                  <ScaleOnTap>
                    <a href={`mailto:${v.email}`}>
                      <Button size="sm" variant="outline" className="rounded-full border-sky/30 text-sky-dark hover:bg-sky/10 text-[11px] font-bold h-7 px-3">
                        <Mail className="mr-1 h-3 w-3" /> Contact
                      </Button>
                    </a>
                  </ScaleOnTap>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  )
}
