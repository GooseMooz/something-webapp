"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Calendar, CheckCircle2, Zap, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { orgsApi, usersApi, formatDate, type ApiOpportunity, type ApiApplication, type ApiUser } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function OrgDashboardPage() {
  const { org, userId, token } = useAuth()
  const [opportunities, setOpportunities] = useState<ApiOpportunity[]>([])
  const [applications, setApplications] = useState<ApiApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !token) return
    Promise.all([
      orgsApi.getOpportunities(userId),
      orgsApi.getApplications(userId, token),
    ])
      .then(async ([ops, apps]) => {
        setOpportunities(ops)

        const uniqueUserIds = [...new Set(apps.map(a => a.user_id).filter(Boolean))]
        const users = await Promise.all(
          uniqueUserIds.map(uid => {
            const clean = uid.includes(":") ? uid.split(":").slice(1).join(":") : uid
            return usersApi.get(clean, token).catch(() => null as ApiUser | null)
          })
        )
        const userMap: Record<string, ApiUser> = {}
        users.forEach((u, i) => {
          if (!u) return
          userMap[uniqueUserIds[i]] = u
          userMap[u.id] = u
          const clean = u.id.includes(":") ? u.id.split(":").slice(1).join(":") : u.id
          userMap[clean] = u
        })
        setApplications(apps.map(a => ({ ...a, user: userMap[a.user_id] ?? a.user })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId, token])

  const activeOpps = opportunities.filter(o => (Number(o.max_spots) || 0) - (Number(o.spots_taken) || 0) > 0)
  const acceptedApps = applications.filter(a => a.status === "accepted")
  const uniqueVolunteers = new Set(acceptedApps.map(a => a.user_id)).size

  const upcoming = [...opportunities]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(o => new Date(o.date) >= new Date())
    .slice(0, 5)

  const recentAccepted = acceptedApps
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-espresso/40">{org?.name ?? "Your organization"} overview</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.04}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Posted",    value: opportunities.length,      icon: Calendar,     color: "bg-matcha/10 text-matcha-dark" },
            { label: "Active / Hiring", value: activeOpps.length,         icon: Zap,          color: "bg-sky/10 text-sky-dark" },
            { label: "Total Applicants",value: applications.length,        icon: FileText,     color: "bg-honey/10 text-espresso/70" },
            { label: "Accepted",        value: acceptedApps.length,        icon: CheckCircle2, color: "bg-caramel/10 text-espresso/60" },
            { label: "Unique Volunteers",value: uniqueVolunteers,          icon: Users,        color: "bg-rose/10 text-rose" },
          ].map(stat => (
            <Card key={stat.label} className={cn(cardClass, "h-full")}>
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold text-espresso">{loading ? "—" : stat.value}</span>
                <span className="text-[10px] font-semibold text-espresso/35 text-center">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <FadeIn delay={0.08}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-espresso">{"What's Coming Up"}</h3>
                <ScaleOnTap hapticPattern="light">
                  <Link href="/org/opportunities">
                    <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-espresso/40 hover:text-espresso h-7">
                      Manage
                    </Button>
                  </Link>
                </ScaleOnTap>
              </div>
              {loading ? (
                <div className="flex flex-col gap-2">
                  {[0,1,2].map(i => <div key={i} className="h-14 rounded-xl bg-latte/40 animate-pulse" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <p className="text-xs text-espresso/35">No upcoming opportunities</p>
                  <Link href="/org/opportunities">
                    <Button variant="ghost" size="sm" className="rounded-full text-xs">Create one</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {upcoming.map(op => {
                    const spotsLeft = (Number(op.max_spots) || 0) - (Number(op.spots_taken) || 0)
                    return (
                      <motion.div key={op.id} whileHover={{ x: 3 }} className="flex items-center gap-3 rounded-xl bg-latte/40 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha/10 text-matcha-dark shrink-0">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-espresso truncate">{op.title}</p>
                          <p className="text-[10px] text-espresso/35">{formatDate(op.date)} · {spotsLeft} spots left</p>
                        </div>
                        <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-[10px] font-bold shrink-0">
                          {spotsLeft > 0 ? "Hiring" : "Full"}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.12}>
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-espresso">Recently Accepted Volunteers</h3>
                <ScaleOnTap hapticPattern="light">
                  <Link href="/org/applications">
                    <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-espresso/40 hover:text-espresso h-7">
                      View All
                    </Button>
                  </Link>
                </ScaleOnTap>
              </div>
              {loading ? (
                <div className="flex flex-col gap-2">
                  {[0,1,2].map(i => <div key={i} className="h-12 rounded-xl bg-latte/40 animate-pulse" />)}
                </div>
              ) : recentAccepted.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <p className="text-xs text-espresso/35">No accepted volunteers yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentAccepted.map(app => (
                    <div key={app.id} className="flex items-center gap-3 rounded-xl bg-latte/40 p-3">
                      {app.user?.s3_pfp ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={app.user.s3_pfp} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-matcha/15 text-xs font-bold text-espresso/50 shrink-0">
                          {(app.user?.name ?? "?").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-espresso truncate">{app.user?.name ?? "Volunteer"}</p>
                        <p className="text-[10px] text-espresso/35 truncate">{app.opportunity?.title ?? "Opportunity"}</p>
                      </div>
                      {app.user?.email && (
                        <a href={`mailto:${app.user.email}`}>
                          <Button size="sm" variant="outline" className="rounded-full border-sky/30 text-sky-dark hover:bg-sky/10 text-[11px] font-bold h-7 px-3 shrink-0">
                            Contact
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {!loading && applications.length > 0 && (
        <FadeIn delay={0.16}>
          <Card className={cardClass}>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-espresso mb-4">Application Status Breakdown</h3>
              <div className="flex flex-wrap gap-2">
                {(["pending", "accepted", "rejected"] as const).map(status => {
                  const count = applications.filter(a => a.status === status).length
                  if (count === 0) return null
                  const colors: Record<string, string> = {
                    pending:  "bg-honey/12 text-espresso/70",
                    accepted: "bg-matcha/12 text-matcha-dark",
                    rejected: "bg-espresso/6 text-espresso/40",
                  }
                  return (
                    <div key={status} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold", colors[status])}>
                      <span className="text-base font-extrabold">{count}</span>
                      <span className="capitalize">{status}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  )
}
