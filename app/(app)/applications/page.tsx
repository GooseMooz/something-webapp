"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, Calendar, Hourglass, CircleDot, ClipboardCheck,
  Star, ArrowRight, Trash2, MapPin, Clock, Users, ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer"
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion-wrapper"
import { applicationsApi, opportunitiesApi, orgsApi, difficultyXp, formatDate, normalizeCause, type ApiApplication, type ApiOrg } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { haptic } from "@/lib/haptics"
import { toast } from "sonner"

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

type StatusFilter = "all" | ApiApplication["status"]

const statusConfig: Record<ApiApplication["status"], { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  accepted: { label: "Accepted", color: "text-matcha-dark", bg: "bg-matcha/12", border: "border-matcha/30", icon: CheckCircle2 },
  pending:  { label: "Pending",  color: "text-espresso/70", bg: "bg-honey/12",  border: "border-honey/30",  icon: Hourglass },
  rejected: { label: "Rejected", color: "text-espresso/45", bg: "bg-espresso/6",border: "border-espresso/15",icon: CircleDot },
}

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all",      label: "All" },
  { value: "accepted", label: "Accepted" },
  { value: "pending",  label: "Pending" },
  { value: "rejected", label: "Rejected" },
]

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function ApplicationsPage() {
  const { token, isLoading: authLoading } = useAuth()
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [applications, setApplications] = useState<ApiApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<ApiApplication | null>(null)

  useEffect(() => {
    if (authLoading || !token) return
    applicationsApi.list(token)
      .then(async (data) => {
        // Fetch opportunity details + orgs in parallel for all applications
        const [orgs, ...opps] = await Promise.all([
          orgsApi.list().catch(() => [] as ApiOrg[]),
          ...data.map((app) => {
            const rawId = app.opportunity_id ?? ""
            const cleanId = rawId.includes(":") ? rawId.split(":").slice(1).join(":") : rawId
            return cleanId
              ? opportunitiesApi.get(cleanId).catch(() => null)
              : Promise.resolve(null)
          }),
        ])

        // Build org lookup map
        const orgMap: Record<string, ApiOrg> = {}
        orgs.forEach((o) => {
          orgMap[o.id] = o
          const clean = o.id.includes(":") ? o.id.split(":").slice(1).join(":") : o.id
          orgMap[clean] = o
        })

        // Attach opportunity (with org) to each application
        const enriched = data.map((app, i) => {
          const opp = opps[i]
          if (!opp) return app
          const orgData = opp.org ?? orgMap[opp.org_id] ?? orgMap[opp.org_id?.includes(":") ? opp.org_id.split(":").slice(1).join(":") : opp.org_id]
          return { ...app, opportunity: { ...opp, org: orgData } }
        })

        setApplications(enriched)
      })
      .catch(() => {/* silent */})
      .finally(() => setLoading(false))
  }, [token, authLoading])

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter)

  const handleWithdraw = useCallback(async (id: string) => {
    if (!token) return
    haptic("medium")
    // Strip SurrealDB table prefix (e.g. "applications:xyz" → "xyz")
    const cleanId = id.includes(":") ? id.split(":").slice(1).join(":") : id
    console.log("[Applications] withdrawing id:", id, "→ cleanId:", cleanId)
    try {
      await applicationsApi.delete(cleanId, token)
      setApplications((prev) => prev.filter((a) => a.id !== id))
      setSelectedApp(null)
      toast.success("Application withdrawn")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not withdraw application")
    }
  }, [token])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="mb-6 relative">
          <motion.div className="absolute -top-1 right-2 hidden sm:block"
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={22} color="var(--caramel)" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-3 right-12 hidden sm:block"
            initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -4, 0] }}
            transition={{ delay: 0.75, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}>
            <Asterisk size={13} color="var(--matcha)" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">My Applications</h1>
          <p className="mt-1 text-sm text-espresso/40">Track all your volunteer applications in one place.</p>
        </div>
      </FadeIn>

      {/* Summary Cards */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["accepted", "pending", "rejected"] as const).map((status) => {
            const count = applications.filter((a) => a.status === status).length
            const config = statusConfig[status]
            return (
              <motion.button key={status} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setFilter(filter === status ? "all" : status); haptic("selection") }}
                className={cn("flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
                  filter === status
                    ? cn(config.bg, config.border, "ring-2", config.border, "shadow-sm")
                    : cn(cardClass, "hover:border-border"))}>
                <config.icon className={cn("h-4 w-4", config.color)} />
                <span className={cn("text-xl font-extrabold", filter === status ? config.color : "text-espresso")}>{count}</span>
                <span className={cn("text-[10px] font-semibold", filter === status ? config.color : "text-espresso/35")}>{config.label}</span>
              </motion.button>
            )
          })}
        </div>
      </FadeIn>

      {/* Filter pills */}
      <FadeIn delay={0.1}>
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <motion.button key={f.value} whileTap={{ scale: 0.95 }}
              onClick={() => { setFilter(f.value); haptic("selection") }}
              className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                filter === f.value ? "border-espresso/20 bg-espresso text-card" : "border-border/60 text-espresso/40 hover:text-espresso")}>
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1 text-[10px] opacity-60">
                  {applications.filter((a) => a.status === f.value).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </FadeIn>

      <p className="mb-4 text-xs font-semibold text-espresso/25 uppercase tracking-wider">
        {loading ? "Loading..." : `${filtered.length} application${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-latte/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <StaggerChildren key={filter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((app) => (
              <StaggerItem key={app.id}>
                <ApplicationCard application={app} onWithdraw={handleWithdraw} onSelect={setSelectedApp} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </AnimatePresence>
      )}

      {!loading && filtered.length === 0 && (
        <FadeIn>
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-latte">
              <ClipboardCheck className="h-7 w-7 text-espresso/20" />
            </div>
            <p className="text-sm font-semibold text-espresso/40">No applications with this status</p>
            <Link href="/opportunities">
              <Button className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-sm font-bold">
                Browse Opportunities <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      )}

      {/* Application detail drawer */}
      <Drawer open={!!selectedApp} onOpenChange={(open) => { if (!open) setSelectedApp(null) }}>
        <DrawerContent>
          {selectedApp && <ApplicationDetail app={selectedApp} onWithdraw={handleWithdraw} />}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function ApplicationCard({ application, onWithdraw, onSelect }: {
  application: ApiApplication
  onWithdraw: (id: string) => void
  onSelect: (app: ApiApplication) => void
}) {
  const config = statusConfig[application.status]
  const StatusIcon = config.icon
  const opp = application.opportunity
  const [withdrawing, setWithdrawing] = useState(false)

  async function handleWithdraw(e: React.MouseEvent) {
    e.stopPropagation()
    setWithdrawing(true)
    await onWithdraw(application.id)
    setWithdrawing(false)
  }

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onSelect(application)} className="cursor-pointer h-full">
      <Card className={cn(cardClass, "overflow-hidden transition-all hover:shadow-md hover:shadow-espresso/[0.06] hover:border-border h-full border-l-2", config.border)}>
        <CardContent className="p-0">
          <div className={cn("h-1 w-full", config.bg)} />
          <div className="flex flex-col gap-3 p-5">
            {/* Status + XP */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0", config.bg)}>
                  <StatusIcon className={cn("h-4 w-4", config.color)} />
                </div>
                <Badge className={cn("rounded-full border-none text-[10px] font-bold px-2.5 py-0.5", config.bg, config.color)}>
                  {config.label}
                </Badge>
              </div>
              {opp?.difficulty !== undefined && (
                <span className="flex items-center gap-1 text-xs font-bold text-matcha-dark shrink-0">
                  <Star className="h-3 w-3 fill-matcha text-matcha" />
                  {difficultyXp(opp.difficulty)} XP
                </span>
              )}
            </div>

            {/* Title + org */}
            <div>
              <h3 className="text-sm font-bold text-espresso leading-snug mb-0.5">
                {opp?.title ?? "Volunteer Opportunity"}
              </h3>
              <p className="text-[11px] text-espresso/35">{opp?.org?.name ?? "Organization"}</p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 text-[11px] text-espresso/35">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {opp ? formatDate(opp.date) : "TBD"}
              </span>
              <span className="text-espresso/15">Applied {formatDate(application.created_at)}</span>
            </div>

            {/* Withdraw button (only for pending) */}
            {application.status === "pending" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="mt-auto self-end rounded-full text-[11px] font-semibold text-espresso/30 hover:text-destructive hover:bg-destructive/5 h-7 px-3"
              >
                {withdrawing ? (
                  <div className="h-3 w-3 rounded-full border border-espresso/20 border-t-espresso animate-spin" />
                ) : (
                  <><Trash2 className="mr-1 h-3 w-3" />Withdraw</>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ApplicationDetail({ app, onWithdraw }: { app: ApiApplication; onWithdraw: (id: string) => void }) {
  const config = statusConfig[app.status]
  const StatusIcon = config.icon
  const opp = app.opportunity
  const [withdrawing, setWithdrawing] = useState(false)
  const xp = opp?.difficulty !== undefined ? difficultyXp(opp.difficulty) : null
  const oppId = opp?.id ? (opp.id.includes(":") ? opp.id.split(":").slice(1).join(":") : opp.id) : null
  const maxSpots = Number(opp?.max_spots) || 0
  const spotsTaken = Number(opp?.spots_taken) || 0

  async function handleWithdraw() {
    setWithdrawing(true)
    await onWithdraw(app.id)
    setWithdrawing(false)
  }

  return (
    <>
      <DrawerHeader className="pb-2">
        <div className="flex items-center gap-3 mb-1">
          {opp?.org?.s3_pfp ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={opp.org.s3_pfp} alt="" className="h-11 w-11 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-latte text-espresso font-bold text-lg shrink-0">
              {(opp?.org?.name ?? opp?.title ?? "?").charAt(0)}
            </div>
          )}
          <div className="min-w-0 text-left">
            <DrawerTitle className="text-base font-extrabold text-espresso leading-snug">
              {opp?.title ?? "Volunteer Opportunity"}
            </DrawerTitle>
            <p className="text-xs text-espresso/45">{opp?.org?.name ?? "Organization"}</p>
          </div>
        </div>
      </DrawerHeader>

      <div className="px-4 pb-2 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
        {/* Status + XP */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", config.bg, config.color)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
          </div>
          {xp !== null && (
            <span className="flex items-center gap-1 text-xs font-bold text-matcha-dark">
              <Star className="h-3.5 w-3.5 fill-matcha text-matcha" />{xp} XP
            </span>
          )}
          <span className="text-xs text-espresso/35 ml-auto">Applied {formatDate(app.created_at)}</span>
        </div>

        {/* Description */}
        {opp?.description && (
          <p className="text-sm text-espresso/65 leading-relaxed">{opp.description}</p>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2">
          {opp?.date && (
            <div className="flex items-center gap-2 rounded-xl bg-latte/60 px-3 py-2.5 text-xs text-espresso/60">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-espresso/30" />
              <span className="font-medium">{formatDate(opp.date)}</span>
            </div>
          )}
          {opp?.location && (
            <div className="flex items-center gap-2 rounded-xl bg-latte/60 px-3 py-2.5 text-xs text-espresso/60">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-espresso/30" />
              <span className="font-medium truncate">{opp.location}</span>
            </div>
          )}
          {opp?.duration != null && (
            <div className="flex items-center gap-2 rounded-xl bg-latte/60 px-3 py-2.5 text-xs text-espresso/60">
              <Clock className="h-3.5 w-3.5 shrink-0 text-espresso/30" />
              <span className="font-medium">{opp.duration} hour{opp.duration !== 1 ? "s" : ""}</span>
            </div>
          )}
          {maxSpots > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-latte/60 px-3 py-2.5 text-xs text-espresso/60">
              <Users className="h-3.5 w-3.5 shrink-0 text-espresso/30" />
              <span className="font-medium">{maxSpots - spotsTaken} spots left</span>
            </div>
          )}
        </div>

        {/* Categories */}
        {opp?.categories && opp.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {opp.categories.map((c) => (
              <Badge key={c} variant="outline" className="rounded-full text-[10px] font-semibold text-espresso/50 border-border/50 px-2 py-0.5">
                {normalizeCause(c)}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags */}
        {opp?.tags && opp.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {opp.tags.map((t) => (
              <Badge key={t} variant="outline" className="rounded-full text-[10px] text-espresso/35 border-border/40 px-2 py-0.5">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <DrawerFooter className="pt-3 flex flex-row gap-2">
        {app.status === "pending" && (
          <Button variant="ghost" onClick={handleWithdraw} disabled={withdrawing}
            className="flex-1 rounded-full text-sm font-semibold text-espresso/40 hover:text-destructive hover:bg-destructive/5 border border-border/50">
            {withdrawing ? (
              <div className="h-4 w-4 rounded-full border border-espresso/20 border-t-espresso animate-spin" />
            ) : (
              <><Trash2 className="mr-1.5 h-4 w-4" />Withdraw</>
            )}
          </Button>
        )}
        {oppId && (
          <DrawerClose asChild>
            <Link href={`/opportunities/${oppId}`} className="flex-1">
              <Button className="w-full rounded-full bg-espresso text-card hover:bg-espresso/90 text-sm font-bold">
                View Full Listing <ExternalLink className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </DrawerClose>
        )}
        {!oppId && <DrawerClose asChild><Button variant="outline" className="flex-1 rounded-full">Close</Button></DrawerClose>}
      </DrawerFooter>
    </>
  )
}
