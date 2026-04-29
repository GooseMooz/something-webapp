"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, FileText, Sparkles, ChevronDown, Mail, Phone, ExternalLink, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerChildren, StaggerItem, ScaleOnTap, ConfettiBurst } from "@/components/motion-wrapper"
import { orgsApi, applicationsApi, opportunitiesApi, formatDate, type ApiApplication, type ApiOpportunity } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

type StatusFilter = "all" | ApiApplication["status"]

const statusConfig: Record<ApiApplication["status"], { label: string; color: string; bg: string }> = {
  pending:  { label: "Pending",  color: "text-espresso/70", bg: "bg-honey/12" },
  accepted: { label: "Accepted", color: "text-matcha-dark", bg: "bg-matcha/12" },
  rejected: { label: "Rejected", color: "text-espresso/40", bg: "bg-espresso/6" },
}

const sortOptions = [
  { value: "recent",     label: "Most Recent" },
  { value: "name-asc",   label: "Name A→Z" },
]

export default function OrgApplicationsPage() {
  const { token, userId } = useAuth()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [oppFilter, setOppFilter] = useState("all")
  const [sort, setSort] = useState("recent")
  const [applications, setApplications] = useState<ApiApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !userId) return
    orgsApi.getApplications(userId, token)
      .then(async (apps) => {
        // Don't re-fetch users — the backend already returns enriched applicant
        // data (including private fields like s3_pdf, email, phone) in this endpoint.
        // Re-fetching via usersApi.get() would overwrite them with the public profile.

        const needsOppEnrich = apps.some(a => !a.opportunity)
        if (needsOppEnrich) {
          const uniqueOppIds = [...new Set(apps.map(a => a.opportunity_id).filter(Boolean))]
          const opps = await Promise.all(
            uniqueOppIds.map(oid => {
              const clean = oid.includes(":") ? oid.split(":").slice(1).join(":") : oid
              return opportunitiesApi.get(clean).catch(() => null as ApiOpportunity | null)
            })
          )
          const oppMap: Record<string, ApiOpportunity> = {}
          opps.forEach((o, i) => {
            if (!o) return
            oppMap[uniqueOppIds[i]] = o
            oppMap[o.id] = o
            const clean = o.id.includes(":") ? o.id.split(":").slice(1).join(":") : o.id
            oppMap[clean] = o
          })
          setApplications(apps.map(a => ({ ...a, opportunity: oppMap[a.opportunity_id] ?? a.opportunity })))
        } else {
          setApplications(apps)
        }
      })
      .catch(() => {/* silent */})
      .finally(() => setLoading(false))
  }, [token, userId])

  const handleUpdateStatus = useCallback(async (id: string, status: "accepted" | "rejected") => {
    if (!token) return
    try {
      const cleanId = id.includes(":") ? id.split(":").slice(1).join(":") : id
      const updated = await applicationsApi.update(cleanId, status, token)
      setApplications(prev => prev.map(a => {
        if (a.id !== id) return a
        return {
          ...updated,
          id,
          user: updated.user ?? a.user,
          opportunity: updated.opportunity ?? a.opportunity,
        }
      }))
      toast.success(status === "accepted" ? "Application accepted!" : "Application rejected")
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (/409|no spots|conflict/i.test(msg)) {
        toast.error("This opportunity has no spots left.")
      } else {
        toast.error("Could not update application")
      }
    }
  }, [token])

  const uniqueOpps = [...new Set(applications.map(a => a.opportunity?.title ?? ""))]
    .filter(Boolean)

  let filtered = statusFilter === "all" ? [...applications] : applications.filter(a => a.status === statusFilter)
  if (oppFilter !== "all") filtered = filtered.filter(a => a.opportunity?.title === oppFilter)

  filtered.sort((a, b) => {
    if (sort === "name-asc") return (a.user?.name ?? "").localeCompare(b.user?.name ?? "")
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-espresso/40">
            {loading ? "Loading..." : `${applications.length} total applications across all opportunities`}
          </p>
        </div>
      </FadeIn>

      {/* Filters Row */}
      <FadeIn delay={0.05}>
        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", "pending", "accepted", "rejected"] as const).map(s => {
            const count = s === "all" ? applications.length : applications.filter(a => a.status === s).length
            return (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setStatusFilter(s)}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  statusFilter === s ? "border-espresso/20 bg-espresso text-card" : "border-border/60 text-espresso/40 hover:text-espresso")}>
                {s === "all" ? "All" : statusConfig[s].label}{" "}
                <span className="ml-1 text-[10px] opacity-60">{count}</span>
              </motion.button>
            )
          })}

          <div className="relative ml-auto">
            <select value={oppFilter} onChange={e => setOppFilter(e.target.value)}
              className="appearance-none rounded-full border border-border/60 bg-card px-3 py-1.5 pr-7 text-xs font-semibold text-espresso/50 focus:outline-none focus:ring-1 focus:ring-matcha">
              <option value="all">All Opportunities</option>
              {uniqueOpps.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-espresso/30 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none rounded-full border border-border/60 bg-card px-3 py-1.5 pr-7 text-xs font-semibold text-espresso/50 focus:outline-none focus:ring-1 focus:ring-matcha">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-espresso/30 pointer-events-none" />
          </div>
        </div>
      </FadeIn>

      <p className="mb-4 text-xs font-semibold text-espresso/25 uppercase tracking-wider">
        {filtered.length} application{filtered.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-latte/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map(app => (
              <StaggerItem key={app.id}>
                <ApplicantCard application={app} onUpdateStatus={handleUpdateStatus} />
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerChildren>
      )}

      {!loading && filtered.length === 0 && (
        <FadeIn>
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-latte">
              <FileText className="h-7 w-7 text-espresso/20" />
            </div>
            <p className="text-sm font-semibold text-espresso/40">No applications match your filters</p>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

function ApplicantCard({ application, onUpdateStatus }: {
  application: ApiApplication
  onUpdateStatus: (id: string, status: "accepted" | "rejected") => Promise<void>
}) {
  const [showContact, setShowContact] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [updating, setUpdating] = useState(false)
  const config = statusConfig[application.status]
  const user = application.user
  const opp = application.opportunity

  async function handleAccept() {
    setUpdating(true)
    await onUpdateStatus(application.id, "accepted")
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)
    setUpdating(false)
  }

  async function handleReject() {
    setUpdating(true)
    await onUpdateStatus(application.id, "rejected")
    setUpdating(false)
  }

  return (
    <motion.div layout whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Card className={cn(cardClass, "overflow-hidden h-full transition-all relative",
        application.status === "accepted" ? "ring-1 ring-matcha/25 shadow-md shadow-matcha/6" : "hover:shadow-md hover:shadow-espresso/6")}>
        <ConfettiBurst active={showConfetti} />
        <div className={cn("h-1.5 w-full", application.status === "accepted" ? "bg-matcha/40" : config.bg)} />
        <CardContent className="p-5 flex flex-col gap-3">
          {/* Applicant header */}
          <div className="flex items-center gap-3">
            {user?.s3_pfp ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.s3_pfp} alt="" className="h-11 w-11 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="flex h-11 w-11 rounded-xl bg-matcha/10 items-center justify-center text-sm font-bold text-espresso/50 shrink-0">
                {(user?.name ?? "?").split(" ").map(n => n[0]).join("")}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-espresso truncate">{user?.name ?? "Applicant"}</p>
              <div className="flex items-center gap-2 text-[10px] text-espresso/40">
                <span className="flex items-center gap-0.5 font-bold text-matcha-dark">
                  <Sparkles className="h-2.5 w-2.5" /> Volunteer
                </span>
              </div>
            </div>
            <Badge className={cn("rounded-full border-none text-[10px] font-bold", config.bg, config.color)}>
              {config.label}
            </Badge>
          </div>

          {/* Contact toggle */}
          <button onClick={() => setShowContact(!showContact)}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-dark hover:text-sky-dark/80 transition-colors">
            <Mail className="h-3 w-3" />
            {showContact ? "Hide contact info" : "Show contact info"}
          </button>

          <AnimatePresence>
            {showContact && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="rounded-lg bg-sky/5 border border-sky/15 p-2.5 flex flex-col gap-1.5">
                  {user?.email && (
                    <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                      <Mail className="h-3 w-3 text-sky-dark shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                      <Phone className="h-3 w-3 text-sky-dark shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.instagram && (
                    <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                      <span className="text-[10px] text-rose shrink-0 font-bold">IG</span>
                      <span>{user.instagram}</span>
                    </div>
                  )}
                  {user?.linkedin && (
                    <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                      <span className="text-[10px] text-sky-dark shrink-0 font-bold">in</span>
                      <span className="truncate">{user.linkedin}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skills */}
          {(user?.skills ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {(user!.skills!).map(s => (
                <Badge key={s} className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-medium">{s}</Badge>
              ))}
            </div>
          )}

          {/* Opportunity */}
          <div className="text-[10px] text-espresso/35">
            Applied for: <span className="font-semibold text-espresso/50">{opp?.title ?? "—"}</span>
          </div>
          <div className="text-[10px] text-espresso/25">
            {formatDate(application.created_at)}
          </div>

          {/* Resume + actions */}
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
            {user?.s3_pdf ? (
              <a href={user.s3_pdf} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-latte/50 px-2.5 py-1.5 text-[11px] font-semibold text-espresso/50 hover:text-espresso transition-all flex-1 group">
                <FileText className="h-3 w-3 text-sky-dark" /> Resume
                <ExternalLink className="ml-auto h-2.5 w-2.5 text-espresso/20 group-hover:text-espresso/50 transition-colors" />
              </a>
            ) : (
              <div className="flex items-center gap-1.5 rounded-lg bg-latte/30 px-2.5 py-1.5 text-[11px] font-semibold text-espresso/25 flex-1">
                <FileText className="h-3 w-3" /> No resume
              </div>
            )}

            <AnimatePresence mode="wait">
              {application.status === "pending" ? (
                <motion.div key="actions" className="flex gap-1" exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <ScaleOnTap>
                    <Button onClick={handleAccept} disabled={updating} size="sm"
                      className="rounded-full bg-matcha text-espresso hover:bg-matcha-dark text-[11px] font-bold h-7 px-3">
                      {updating ? <div className="h-3 w-3 rounded-full border border-espresso/20 border-t-espresso animate-spin" /> : "Accept"}
                    </Button>
                  </ScaleOnTap>
                  <Button onClick={handleReject} disabled={updating} size="sm" variant="outline"
                    className="rounded-full border-border/50 text-espresso/40 hover:text-destructive hover:border-destructive/30 text-[11px] font-bold h-7 px-2">
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              ) : application.status === "accepted" ? (
                <motion.div key="accepted" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                  <Button disabled size="sm" className="rounded-full bg-matcha/20 text-matcha-dark text-[11px] font-bold h-7 px-3 opacity-100">
                    <CheckCircle2 className="mr-1 h-3 w-3 inline" />Accepted
                  </Button>
                </motion.div>
              ) : (
                <Badge className="rounded-full border-none bg-espresso/6 text-espresso/40 text-[10px] font-bold">Rejected</Badge>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
