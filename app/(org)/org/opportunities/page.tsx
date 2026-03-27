"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Users, Clock, Star, MapPin, Zap, Eye, ChevronRight, X, FileText,
  Calendar, CheckCircle2, Edit3, LinkIcon, AlignLeft, Tag, ArrowLeft,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FadeIn, SlideUp, StaggerChildren, StaggerItem, ScaleOnTap } from "@/components/motion-wrapper"
import { mockOpportunities, mockOrgApplications, mockOrg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Image from "next/image"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

const orgOpportunities = mockOpportunities.filter(op => ["op1", "op3", "op7"].includes(op.id))

export default function OrgOpportunitiesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [selectedOp, setSelectedOp] = useState<string | null>(null)

  const selectedOpportunity = selectedOp ? mockOpportunities.find(op => op.id === selectedOp) : null

  if (selectedOpportunity) {
    const applicants = mockOrgApplications.filter(a => a.opportunityId === selectedOpportunity.id)
    const accepted = applicants.filter(a => a.status === "accepted").length
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
        <FadeIn>
          <button
            onClick={() => setSelectedOp(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso/35 hover:text-espresso transition-colors mb-5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
          </button>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Opportunity Preview */}
          <div className="lg:col-span-3">
            <SlideUp>
              <Card className={cn(cardClass, "overflow-hidden mb-5")}>
                <div className="h-2 bg-matcha/30" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h1 className="text-xl font-extrabold text-espresso mb-2 text-balance md:text-2xl">{selectedOpportunity.title}</h1>
                      <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-xs font-semibold">
                        {selectedOpportunity.category}
                      </Badge>
                    </div>
                    <ScaleOnTap>
                      <Button size="sm" variant="outline" className="rounded-full border-border/60 text-xs font-semibold text-espresso/50 h-8 shrink-0">
                        <Edit3 className="mr-1.5 h-3 w-3" /> Edit
                      </Button>
                    </ScaleOnTap>
                  </div>

                  <p className="text-sm text-espresso/50 leading-relaxed mb-5">{selectedOpportunity.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { icon: Calendar, label: "Date", value: selectedOpportunity.date, accent: "text-sky-dark" },
                      { icon: Clock, label: "Duration", value: selectedOpportunity.timeCommitment, accent: "text-honey" },
                      { icon: MapPin, label: "Location", value: selectedOpportunity.location.split(",")[0], accent: "text-matcha-dark" },
                      { icon: Star, label: "XP Reward", value: `${selectedOpportunity.xpReward} XP`, accent: "text-caramel" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1 rounded-xl bg-latte/40 p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-espresso/35">
                          <item.icon className={cn("h-3 w-3", item.accent)} /> {item.label}
                        </div>
                        <span className="text-xs font-bold text-espresso">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpportunity.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full text-xs font-medium text-espresso/45 border-border/50">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SlideUp>

            {/* Quick Stats */}
            <SlideUp delay={0.05}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Card className={cardClass}>
                  <CardContent className="p-4 flex flex-col items-center gap-1">
                    <span className="text-2xl font-extrabold text-espresso">{applicants.length}</span>
                    <span className="text-[10px] font-semibold text-espresso/35">Applicants</span>
                  </CardContent>
                </Card>
                <Card className={cardClass}>
                  <CardContent className="p-4 flex flex-col items-center gap-1">
                    <span className="text-2xl font-extrabold text-matcha-dark">{accepted}</span>
                    <span className="text-[10px] font-semibold text-espresso/35">Accepted</span>
                  </CardContent>
                </Card>
                <Card className={cardClass}>
                  <CardContent className="p-4 flex flex-col items-center gap-1">
                    <span className={cn("text-2xl font-extrabold", selectedOpportunity.spotsLeft <= 3 ? "text-destructive" : "text-espresso")}>{selectedOpportunity.spotsLeft}</span>
                    <span className="text-[10px] font-semibold text-espresso/35">Spots Left</span>
                  </CardContent>
                </Card>
              </div>
            </SlideUp>
          </div>

          {/* Applicants Sidebar */}
          <div className="lg:col-span-2">
            <SlideUp delay={0.1}>
              <Card className={cn(cardClass, "sticky top-24")}>
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-espresso mb-4 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-dark" />
                    Applicants ({applicants.length})
                  </h3>
                  <div className="flex flex-col gap-3">
                    {applicants.length === 0 ? (
                      <p className="text-xs text-espresso/35 text-center py-6">No applicants yet</p>
                    ) : (
                      applicants.map((app) => {
                        const statusColors: Record<string, string> = {
                          new: "bg-sky/12 text-sky-dark",
                          reviewed: "bg-honey/12 text-espresso/70",
                          accepted: "bg-matcha/12 text-matcha-dark",
                          rejected: "bg-espresso/6 text-espresso/40",
                        }
                        return (
                          <div key={app.id} className="flex items-center gap-3 rounded-xl bg-latte/40 p-3">
                            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-matcha/10 shrink-0">
                              {app.applicantAvatar ? (
                                <Image src={app.applicantAvatar} alt={app.applicantName} fill className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-espresso/50">
                                  {app.applicantName.split(" ").map(n => n[0]).join("")}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-espresso truncate">{app.applicantName}</p>
                              <p className="text-[10px] text-espresso/35">Lv.{app.applicantLevel} -- {app.applicantXp} XP</p>
                            </div>
                            <Badge className={cn("rounded-full border-none text-[9px] font-bold", statusColors[app.status])}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                        )
                      })
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <FadeIn>
        <div className="flex flex-col gap-1 mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-espresso md:text-3xl">My Opportunities</h1>
            <p className="mt-1 text-sm text-espresso/40">{orgOpportunities.length} opportunities created by {mockOrg.name}</p>
          </div>
          <ScaleOnTap>
            <Button onClick={() => setShowCreate(true)} className="rounded-full bg-espresso text-card hover:bg-espresso/90 font-bold h-10 px-5">
              <Plus className="mr-2 h-4 w-4" /> Create Opportunity
            </Button>
          </ScaleOnTap>
        </div>
      </FadeIn>

      {/* Quick Stats */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Posted", value: orgOpportunities.length, color: "bg-matcha/10 text-matcha-dark" },
            { label: "Active", value: orgOpportunities.filter(o => o.spotsLeft > 0).length, color: "bg-sky/10 text-sky-dark" },
            { label: "Total Applicants", value: mockOrgApplications.length, color: "bg-honey/10 text-espresso/70" },
            { label: "Accepted", value: mockOrgApplications.filter(a => a.status === "accepted").length, color: "bg-caramel/10 text-espresso/60" },
          ].map(stat => (
            <Card key={stat.label} className={cardClass}>
              <CardContent className="p-4 flex flex-col items-center gap-1">
                <span className="text-2xl font-extrabold text-espresso">{stat.value}</span>
                <span className="text-[10px] font-semibold text-espresso/35">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      {/* Create Opportunity Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false) }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl"
            >
              <div className="h-1.5 bg-gradient-to-r from-matcha/40 via-sky/30 to-honey/30 rounded-t-2xl" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-espresso">Create New Opportunity</h2>
                    <p className="text-xs text-espresso/40 mt-0.5">Fill in the details to publish your volunteer opportunity</p>
                  </div>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-latte transition-colors text-espresso/40 hover:text-espresso"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form Sections */}
                <div className="flex flex-col gap-5">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" /> Basic Information
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Title</label>
                        <Input placeholder="e.g. Beach Cleanup Day at English Bay" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-espresso/40 mb-1 block">Category</label>
                          <select className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso focus:outline-none focus:ring-1 focus:ring-matcha">
                            <option>Environment</option>
                            <option>Education</option>
                            <option>Community</option>
                            <option>{"Arts & Culture"}</option>
                            <option>Health</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-espresso/40 mb-1 block">XP Reward</label>
                          <Input placeholder="e.g. 150" className="rounded-xl h-10 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlignLeft className="h-3 w-3" /> Description
                    </h3>
                    <textarea
                      rows={4}
                      placeholder="Describe what volunteers will do, what to bring, and what they'll gain from this experience..."
                      className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:ring-1 focus:ring-matcha resize-none"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Event Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Date</label>
                        <Input type="date" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Duration</label>
                        <Input placeholder="e.g. 3 hours" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Location</label>
                        <Input placeholder="e.g. English Bay, Vancouver" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Total Spots</label>
                        <Input placeholder="e.g. 25" className="rounded-xl h-10 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <LinkIcon className="h-3 w-3" /> Links (optional)
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Event page or sign-up link</label>
                        <Input placeholder="https://..." className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Additional resources</label>
                        <Input placeholder="https://..." className="rounded-xl h-10 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Tag className="h-3 w-3" /> Tags
                    </h3>
                    <Input placeholder="e.g. Outdoors, Beginner-Friendly, Group Activity (comma separated)" className="rounded-xl h-10 text-sm" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6 pt-5 border-t border-border/40">
                  <ScaleOnTap className="flex-1">
                    <Button className="w-full rounded-full bg-espresso text-card hover:bg-espresso/90 font-bold text-sm h-11">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Publish Opportunity
                    </Button>
                  </ScaleOnTap>
                  <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-full border-border/60 text-sm font-semibold text-espresso/50 h-11 px-6">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opportunity Cards */}
      <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orgOpportunities.map((op) => {
          const applicants = mockOrgApplications.filter(a => a.opportunityId === op.id)
          const accepted = applicants.filter(a => a.status === "accepted").length

          return (
            <StaggerItem key={op.id}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <button onClick={() => setSelectedOp(op.id)} className="w-full text-left">
                  <Card className={cn(cardClass, "overflow-hidden h-full hover:shadow-md hover:shadow-espresso/[0.06] transition-all")}>
                    <div className="h-1.5 bg-matcha/30" />
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-espresso leading-snug">{op.title}</h3>
                        {op.urgent && (
                          <Badge className="rounded-full border-none bg-destructive/10 text-destructive text-[10px] font-bold px-2 shrink-0">
                            <Zap className="mr-0.5 h-2.5 w-2.5" /> Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-espresso/40">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {op.location.split(",")[0]}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {op.date}</span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
                          <span className="text-sm font-extrabold text-espresso">{applicants.length}</span>
                          <span className="text-[9px] text-espresso/30">Applicants</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
                          <span className="text-sm font-extrabold text-matcha-dark">{accepted}</span>
                          <span className="text-[9px] text-espresso/30">Accepted</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
                          <span className={cn("text-sm font-extrabold", op.spotsLeft <= 3 ? "text-destructive" : "text-espresso")}>{op.spotsLeft}</span>
                          <span className="text-[9px] text-espresso/30">Spots Left</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-espresso/40 pt-2 border-t border-border/40">
                        <Eye className="h-3 w-3" /> View Details
                        <ChevronRight className="ml-auto h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            </StaggerItem>
          )
        })}
      </StaggerChildren>
    </div>
  )
}
