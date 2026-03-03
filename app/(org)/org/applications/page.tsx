"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { CheckCircle2, Eye, Clock, Star, FileText, Sparkles, Award, X, ChevronDown, Mail, Phone, ExternalLink, Instagram, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem, ScaleOnTap, ConfettiBurst } from "@/components/motion-wrapper"
import { mockOrgApplications, mockOpportunities, type OrgApplication } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

type StatusFilter = "all" | OrgApplication["status"]

const statusConfig: Record<OrgApplication["status"], { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-sky-dark", bg: "bg-sky/12" },
  reviewed: { label: "Reviewed", color: "text-espresso/70", bg: "bg-honey/12" },
  accepted: { label: "Accepted", color: "text-matcha-dark", bg: "bg-matcha/12" },
  rejected: { label: "Rejected", color: "text-espresso/40", bg: "bg-espresso/6" },
}

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "xp-high", label: "Highest XP" },
  { value: "hours-high", label: "Most Hours" },
]

export default function OrgApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [oppFilter, setOppFilter] = useState("all")
  const [sort, setSort] = useState("recent")
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())

  const opportunities = [...new Set(mockOrgApplications.map(a => a.opportunityTitle))]

  let filtered = statusFilter === "all" ? [...mockOrgApplications] : mockOrgApplications.filter(a => a.status === statusFilter)
  if (oppFilter !== "all") filtered = filtered.filter(a => a.opportunityTitle === oppFilter)

  filtered.sort((a, b) => {
    if (sort === "xp-high") return b.applicantXp - a.applicantXp
    if (sort === "hours-high") return b.applicantHours - a.applicantHours
    return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  })

  const handleAccept = useCallback((id: string) => {
    setAcceptedIds(prev => new Set(prev).add(id))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-espresso/40">{mockOrgApplications.length} total applications across all opportunities</p>
        </div>
      </FadeIn>

      {/* Filters Row */}
      <FadeIn delay={0.05}>
        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", "new", "reviewed", "accepted", "rejected"] as const).map(s => {
            const count = s === "all" ? mockOrgApplications.length : mockOrgApplications.filter(a => a.status === s).length
            return (
              <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setStatusFilter(s)} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition-all", statusFilter === s ? "border-espresso/20 bg-espresso text-card" : "border-border/60 text-espresso/40 hover:text-espresso")}>
                {s === "all" ? "All" : statusConfig[s].label} <span className="ml-1 text-[10px] opacity-60">{count}</span>
              </motion.button>
            )
          })}

          <div className="relative ml-auto">
            <select value={oppFilter} onChange={e => setOppFilter(e.target.value)} className="appearance-none rounded-full border border-border/60 bg-card px-3 py-1.5 pr-7 text-xs font-semibold text-espresso/50 focus:outline-none focus:ring-1 focus:ring-matcha">
              <option value="all">All Opportunities</option>
              {opportunities.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-espresso/30 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)} className="appearance-none rounded-full border border-border/60 bg-card px-3 py-1.5 pr-7 text-xs font-semibold text-espresso/50 focus:outline-none focus:ring-1 focus:ring-matcha">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-espresso/30 pointer-events-none" />
          </div>
        </div>
      </FadeIn>

      <p className="mb-4 text-xs font-semibold text-espresso/25 uppercase tracking-wider">{filtered.length} application{filtered.length !== 1 ? "s" : ""}</p>

      {/* Application Cards */}
      <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map(app => (
            <StaggerItem key={app.id}>
              <ApplicantCard application={app} isAccepted={acceptedIds.has(app.id)} onAccept={handleAccept} />
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerChildren>

      {filtered.length === 0 && (
        <FadeIn>
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-latte"><FileText className="h-7 w-7 text-espresso/20" /></div>
            <p className="text-sm font-semibold text-espresso/40">No applications match your filters</p>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

function ApplicantCard({ application, isAccepted, onAccept }: { application: OrgApplication; isAccepted: boolean; onAccept: (id: string) => void }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const wasAccepted = application.status === "accepted" || isAccepted
  const config = wasAccepted
    ? statusConfig.accepted
    : statusConfig[application.status]

  function handleAccept() {
    onAccept(application.id)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1500)
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className={cn(
        cardClass,
        "overflow-hidden h-full transition-all relative",
        wasAccepted ? "ring-1 ring-matcha/25 shadow-md shadow-matcha/[0.06]" : "hover:shadow-md hover:shadow-espresso/[0.06]"
      )}>
        <ConfettiBurst active={showConfetti} />
        <motion.div
          className="h-1.5 w-full"
          animate={{ backgroundColor: wasAccepted ? "rgba(126,200,160,0.4)" : undefined }}
          transition={{ duration: 0.5 }}
        >
          <div className={cn("h-full w-full", wasAccepted ? "bg-matcha/40" : config.bg)} />
        </motion.div>
        <CardContent className="p-5 flex flex-col gap-3">
          {/* Applicant header */}
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-matcha/10 shrink-0">
              {application.applicantAvatar ? (
                <Image src={application.applicantAvatar} alt={application.applicantName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-espresso/50">
                  {application.applicantName.split(" ").map(n => n[0]).join("")}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-espresso truncate">{application.applicantName}</p>
              <div className="flex items-center gap-2 text-[10px] text-espresso/40">
                <span className="flex items-center gap-0.5 font-bold text-matcha-dark"><Sparkles className="h-2.5 w-2.5" /> {application.applicantXp} XP</span>
                <span>Lv.{application.applicantLevel}</span>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {wasAccepted ? (
                <motion.div
                  key="accepted-badge"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Badge className="rounded-full border-none text-[10px] font-bold bg-matcha/12 text-matcha-dark">
                    <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.3 }}>
                      <CheckCircle2 className="mr-0.5 h-3 w-3 inline" />
                    </motion.span>
                    Accepted
                  </Badge>
                </motion.div>
              ) : (
                <motion.div key="status-badge" exit={{ scale: 0.5, opacity: 0 }}>
                  <Badge className={cn("rounded-full border-none text-[10px] font-bold", config.bg, config.color)}>{config.label}</Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Info Toggle */}
          <button
            onClick={() => setShowContact(!showContact)}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-dark hover:text-sky-dark/80 transition-colors"
          >
            <Mail className="h-3 w-3" />
            {showContact ? "Hide contact info" : "Show contact info"}
          </button>

          <AnimatePresence>
            {showContact && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-sky/5 border border-sky/15 p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                    <Mail className="h-3 w-3 text-sky-dark shrink-0" />
                    <span className="truncate">{application.applicantContact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                    <Phone className="h-3 w-3 text-sky-dark shrink-0" />
                    <span>{application.applicantContact.phone}</span>
                  </div>
                  {application.applicantContact.instagram && (
                    <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                      <Instagram className="h-3 w-3 text-rose shrink-0" />
                      <span>{application.applicantContact.instagram}</span>
                    </div>
                  )}
                  {application.applicantContact.linkedin && (
                    <div className="flex items-center gap-2 text-[11px] text-espresso/60">
                      <Linkedin className="h-3 w-3 text-sky-dark shrink-0" />
                      <span className="truncate">{application.applicantContact.linkedin}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
              <span className="text-xs font-extrabold text-espresso">{application.applicantHours}</span>
              <span className="text-[9px] text-espresso/30">Hours</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
              <span className="text-xs font-extrabold text-espresso">{application.applicantXp}</span>
              <span className="text-[9px] text-espresso/30">Total XP</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {application.applicantSkills.map(s => (
              <Badge key={s} className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-medium">{s}</Badge>
            ))}
            {application.applicantTags.map(t => (
              <Badge key={t} className="rounded-full border-none bg-sky/10 text-sky-dark text-[10px] font-medium">{t}</Badge>
            ))}
          </div>

          {/* Opportunity */}
          <div className="text-[10px] text-espresso/35">
            Applied for: <span className="font-semibold text-espresso/50">{application.opportunityTitle}</span>
          </div>

          {/* Resume + actions */}
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-latte/50 px-2.5 py-1.5 text-[11px] font-semibold text-espresso/50 hover:text-espresso transition-all flex-1 group">
              <FileText className="h-3 w-3 text-sky-dark" /> Resume
              <ExternalLink className="ml-auto h-2.5 w-2.5 text-espresso/20 group-hover:text-espresso/50 transition-colors" />
            </a>
            <AnimatePresence mode="wait">
              {!wasAccepted ? (
                <motion.div key="accept-btn" exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <ScaleOnTap>
                    <Button onClick={handleAccept} size="sm" className="rounded-full bg-matcha text-espresso hover:bg-matcha-dark text-[11px] font-bold h-7 px-3">
                      Accept
                    </Button>
                  </ScaleOnTap>
                </motion.div>
              ) : (
                <motion.div
                  key="accepted-btn"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Button disabled size="sm" className="rounded-full bg-matcha/20 text-matcha-dark text-[11px] font-bold h-7 px-3 opacity-100">
                    <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 0.4, type: "spring" }}>
                      <CheckCircle2 className="mr-1 h-3 w-3 inline" />
                    </motion.span>
                    Accepted
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
