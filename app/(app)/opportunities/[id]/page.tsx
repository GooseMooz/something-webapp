"use client"

import { use, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, MapPin, Clock, Calendar, Users, Star, CheckCircle2,
  FileText, Sparkles, ExternalLink, Zap, RefreshCw, DoorOpen,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, FadeIn as SlideUp, ScaleOnTap, ConfettiBurst } from "@/components/motion-wrapper"
import { opportunitiesApi, orgsApi, applicationsApi, difficultyXp, normalizeCategory, normalizeCause, formatDate, type ApiOpportunity } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { haptic } from "@/lib/haptics"
import { toast } from "sonner"

const categoryColorMap: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  Environment:    { bg: "bg-matcha/12",  text: "text-matcha-dark",  accent: "bg-matcha",  border: "border-l-2 border-matcha/40" },
  Education:      { bg: "bg-sky/12",     text: "text-sky-dark",     accent: "bg-sky",     border: "border-l-2 border-sky/40" },
  Community:      { bg: "bg-caramel/12", text: "text-espresso/80",  accent: "bg-caramel", border: "border-l-2 border-caramel/40" },
  "Arts & Culture":{ bg: "bg-honey/12", text: "text-espresso/80",  accent: "bg-honey",   border: "border-l-2 border-honey/40" },
  Health:         { bg: "bg-rose/12",    text: "text-rose",         accent: "bg-rose",    border: "border-l-2 border-rose/40" },
  Technology:     { bg: "bg-sky/12",     text: "text-sky-dark",     accent: "bg-sky",     border: "border-l-2 border-sky/40" },
  Sports:         { bg: "bg-caramel/12", text: "text-espresso/80",  accent: "bg-caramel", border: "border-l-2 border-caramel/40" },
}
const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

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
  const { token, user, isLoading: authLoading } = useAuth()
  const [opportunity, setOpportunity] = useState<ApiOpportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const cleanId = id.includes(":") ? id.split(":").slice(1).join(":") : id
    const fullId = `opportunities:${cleanId}`

    Promise.all([
      opportunitiesApi.get(cleanId),
      token && !authLoading ? applicationsApi.list(token).catch(() => []) : Promise.resolve([]),
    ])
      .then(async ([opp, apps]) => {
        // Check if user already applied (match on full or clean opportunity id)
        const alreadyApplied = apps.some(
          (a) => a.opportunity_id === fullId || a.opportunity_id === cleanId
        )
        if (alreadyApplied) setApplied(true)

        // Fetch org separately if the backend didn't populate it
        if (!opp.org && opp.org_id) {
          const orgId = opp.org_id.includes(":") ? opp.org_id.split(":").slice(1).join(":") : opp.org_id
          try {
            const org = await orgsApi.get(orgId)
            setOpportunity({ ...opp, org })
          } catch {
            setOpportunity(opp)
          }
        } else {
          setOpportunity(opp)
        }
      })
      .catch(() => setOpportunity(null))
      .finally(() => setLoading(false))
  }, [id, token, authLoading])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-espresso/20 border-t-espresso animate-spin" />
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-sm text-espresso/40">Opportunity not found</p>
        <Link href="/opportunities" className="mt-3">
          <Button variant="outline" className="rounded-full text-xs font-semibold">
            <ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Browse
          </Button>
        </Link>
      </div>
    )
  }

  const category = normalizeCategory(opportunity.category)
  const colors = categoryColorMap[category] ?? categoryColorMap.Community
  const maxSpots = Number(opportunity.max_spots) || 0
  const spotsLeft = opportunity.spots_left !== undefined
    ? Number(opportunity.spots_left)
    : Math.max(0, maxSpots - (Number(opportunity.spots_taken) || 0))
  const spotsTaken = maxSpots - spotsLeft
  const spotsPercent = maxSpots > 0 ? (spotsTaken / maxSpots) * 100 : 0
  const isAlmostFull = spotsLeft <= 5
  const xp = difficultyXp(opportunity.difficulty)

  async function handleApply() {
    if (!token) {
      toast.error("You must be logged in to apply")
      return
    }
    haptic("success")
    setApplying(true)
    try {
      await opportunitiesApi.apply(id.includes(":") ? id.split(":").slice(1).join(":") : id, token)
      setApplied(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1500)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not apply"
      if (msg.toLowerCase().includes("already")) {
        setApplied(true)
        toast.info("You've already applied to this opportunity")
      } else {
        toast.error(msg)
      }
    } finally {
      setApplying(false)
    }
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
                    {opportunity.org?.s3_pfp ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={opportunity.org.s3_pfp} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    ) : (
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold", colors.bg, colors.text)}>
                        {(opportunity.org?.name ?? "?").charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-espresso/55">{opportunity.org?.name ?? "Organization"}</p>
                      <Badge className={cn("rounded-full border-none text-[10px] font-semibold mt-1", colors.bg, colors.text)}>
                        {category}
                      </Badge>
                    </div>
                  </div>
                  {isAlmostFull && (
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
                      <Asterisk size={18} color={`var(--${category === "Environment" ? "matcha" : category === "Education" || category === "Technology" ? "sky" : category === "Health" ? "rose" : "honey"})`} />
                    </motion.div>
                  </motion.div>
                </div>
                <p className="text-sm text-espresso/50 leading-relaxed mb-5">{opportunity.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: Calendar, label: "Date",     value: formatDate(opportunity.date),              bg: "bg-sky/12",     icon_color: "text-sky-dark",    border: "border-l-2 border-sky/35" },
                    { icon: Clock,    label: "Duration", value: `${opportunity.duration} hour${opportunity.duration !== 1 ? "s" : ""}`, bg: "bg-honey/12",   icon_color: "text-espresso/60", border: "border-l-2 border-honey/35" },
                    { icon: MapPin,   label: "Location", value: opportunity.location.split(",")[0],        bg: "bg-matcha/12",  icon_color: "text-matcha-dark", border: "border-l-2 border-matcha/35" },
                    { icon: Star,     label: "XP Reward",value: `${xp} XP`,                               bg: "bg-caramel/12", icon_color: "text-espresso/65", border: "border-l-2 border-caramel/35" },
                  ].map((item) => (
                    <div key={item.label} className={cn("flex flex-col gap-1 rounded-xl p-3", item.bg, item.border)}>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-espresso/45">
                        <item.icon className={cn("h-3 w-3", item.icon_color)} /> {item.label}
                      </div>
                      <span className="text-xs font-bold text-espresso">{item.value}</span>
                    </div>
                  ))}
                </div>

                {(opportunity.drop_in || opportunity.recurring) && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {opportunity.drop_in && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-sky/10 px-3 py-1.5 text-xs font-semibold text-sky-dark">
                        <DoorOpen className="h-3.5 w-3.5" /> Drop-in welcome
                      </div>
                    )}
                    {opportunity.recurring && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-matcha/10 px-3 py-1.5 text-xs font-semibold text-matcha-dark capitalize">
                        <RefreshCw className="h-3.5 w-3.5" /> Recurring · {opportunity.recurring}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-espresso/40">
                      <Users className="inline h-3 w-3 mr-1" />{spotsTaken} / {maxSpots} spots filled
                    </span>
                    <span className={cn("text-xs font-bold", isAlmostFull ? "text-destructive" : "text-matcha-dark")}>{spotsLeft} left</span>
                  </div>
                  <Progress value={spotsPercent} className={cn("h-2 bg-muted [&>div]:rounded-full", isAlmostFull ? "[&>div]:bg-destructive/60" : "[&>div]:bg-matcha")} />
                </div>

                {(opportunity.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(opportunity.tags ?? []).map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full text-xs font-medium text-espresso/45 border-border/50">{tag}</Badge>
                    ))}
                  </div>
                )}

                {opportunity.event_link && (
                  <a href={opportunity.event_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-dark hover:underline mb-5">
                    <ExternalLink className="h-3 w-3" /> Event sign-up page
                  </a>
                )}

                {/* Apply button */}
                <div className="relative flex gap-2">
                  <AnimatePresence mode="wait">
                    {!applied ? (
                      <motion.div key="apply" className="flex-1" exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <ScaleOnTap className="w-full" hapticPattern="medium">
                          <Button onClick={handleApply} disabled={applying} className="w-full rounded-full bg-espresso text-card hover:bg-espresso/90 h-12 text-sm font-bold">
                            {applying ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-card/20 border-t-card" />
                            ) : (
                              <><CheckCircle2 className="mr-2 h-4 w-4" /> Apply Now</>
                            )}
                          </Button>
                        </ScaleOnTap>
                      </motion.div>
                    ) : (
                      <motion.div key="applied" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex-1">
                        <ConfettiBurst active={showConfetti} />
                        <Button disabled className="w-full rounded-full bg-matcha text-espresso h-12 text-sm font-bold opacity-100">
                          <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.4, type: "spring" }}>
                            <CheckCircle2 className="mr-2 h-4 w-4 inline" />
                          </motion.span>
                          Application Sent!
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* About the Organization */}
          <SlideUp delay={0.1}>
            <Card className={cardClass}>
              <CardContent className="p-6">
                <h2 className="text-sm font-bold text-espresso mb-3">About {opportunity.org?.name ?? "Organization"}</h2>
                <p className="text-xs text-espresso/45 leading-relaxed">
                  {opportunity.org?.description
                    ? opportunity.org.description
                    : `${opportunity.org?.name ?? "This organization"} is a Metro Vancouver-based nonprofit dedicated to creating positive change in the community.`}
                </p>
                {opportunity.org?.website && (
                  <a href={opportunity.org.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-sky-dark hover:underline">
                    <ExternalLink className="h-3 w-3" /> Visit website
                  </a>
                )}
                <div className="mt-4 flex items-center gap-4 text-[10px] text-espresso/35 flex-wrap">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-matcha-dark" /> Verified Organization</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {opportunity.max_spots}+ spots available</span>
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>

        {/* Sidebar: Application Preview */}
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
                  <div className="flex items-center gap-3 mb-3">
                    {user?.s3_pfp ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.s3_pfp} alt="" className="h-10 w-10 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="flex h-10 w-10 rounded-xl bg-matcha/10 items-center justify-center text-sm font-bold text-espresso/50 shrink-0">
                        {user?.name?.split(" ").map(n => n[0]).join("") ?? "?"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-espresso truncate">{user?.name ?? "You"}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-espresso/40">
                        <span className="flex items-center gap-0.5 font-bold text-matcha-dark">
                          <Sparkles className="h-2.5 w-2.5" /> Volunteer
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {(user?.skills ?? []).length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-espresso/30 mb-1.5">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {(user?.skills ?? []).map((skill) => (
                          <Badge key={skill} className="rounded-full border-none bg-matcha/10 text-matcha-dark text-[10px] font-medium">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {(user?.categories ?? []).length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-espresso/30 mb-1.5">Causes</p>
                      <div className="flex flex-wrap gap-1">
                        {(user?.categories ?? []).map((cause) => (
                          <Badge key={cause} className="rounded-full border-none bg-sky/10 text-sky-dark text-[10px] font-medium">{normalizeCause(cause)}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resume link */}
                  {user?.s3_pdf ? (
                    <a href={user.s3_pdf} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center gap-2 rounded-lg bg-card border border-border/40 p-2.5 text-xs font-semibold text-espresso/50 hover:text-espresso hover:border-border transition-all group">
                      <FileText className="h-3.5 w-3.5 text-sky-dark" />
                      Resume
                      <ExternalLink className="ml-auto h-3 w-3 text-espresso/20 group-hover:text-espresso/50 transition-colors" />
                    </a>
                  ) : (
                    <div className="w-full flex items-center gap-2 rounded-lg bg-card border border-dashed border-border/40 p-2.5 text-xs font-semibold text-espresso/30">
                      <FileText className="h-3.5 w-3.5" />
                      No resume uploaded
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </div>
    </div>
  )
}
