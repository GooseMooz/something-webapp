"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Users, Clock, Star, MapPin, Eye, ChevronRight, X, FileText,
  Calendar, CheckCircle2, Edit3, LinkIcon, AlignLeft, Tag, ArrowLeft, Trash2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FadeIn, StaggerChildren, StaggerItem, ScaleOnTap } from "@/components/motion-wrapper"
import { opportunitiesApi, orgsApi, usersApi, normalizeCategory, formatDate, difficultyXp, type ApiOpportunity, type ApiApplication, type ApiUser } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function OrgOpportunitiesPage() {
  const { token, org, userId } = useAuth()
  const [showCreate, setShowCreate] = useState(false)
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null)
  const [opportunities, setOpportunities] = useState<ApiOpportunity[]>([])
  const [applications, setApplications] = useState<ApiApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Create form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("environment")
  const [difficulty, setDifficulty] = useState<0 | 1 | 2>(0)
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [duration, setDuration] = useState<number | "">("")
  const [dropIn, setDropIn] = useState(false)
  const [recurring, setRecurring] = useState("")
  const [location, setLocation] = useState("")
  const [maxSpots, setMaxSpots] = useState("")
  const [eventLink, setEventLink] = useState("")
  const [resourcesLink, setResourcesLink] = useState("")
  const [tags, setTags] = useState("")
  const [creating, setCreating] = useState(false)
  const [editingOpId, setEditingOpId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !token) return
    Promise.all([
      orgsApi.getOpportunities(userId),
      orgsApi.getApplications(userId, token),
    ])
      .then(async ([ops, apps]) => {
        setOpportunities(ops)
        // Fetch user info for each applicant
        const uniqueUserIds = [...new Set(apps.map(a => a.user_id).filter(Boolean))]
        const users = await Promise.all(
          uniqueUserIds.map(uid => {
            const cleanId = uid.includes(":") ? uid.split(":").slice(1).join(":") : uid
            return usersApi.get(cleanId, token).catch(() => null as ApiUser | null)
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
      .catch(() => {/* silent */})
      .finally(() => setLoading(false))
  }, [userId, token])

  const handleCreate = useCallback(async () => {
    if (!token) return
    setCreating(true)
    try {
      const created = await opportunitiesApi.create({
        title,
        category,
        difficulty,
        description,
        date: new Date(date).toISOString(),
        duration: Number(duration) || 1,
        location,
        max_spots: parseInt(maxSpots) || 20,
        drop_in: dropIn || undefined,
        recurring: recurring || undefined,
        event_link: eventLink || undefined,
        resources_link: resourcesLink || undefined,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      }, token)
      setOpportunities(prev => [created, ...prev])
      setShowCreate(false)
      resetForm()
      toast.success("Opportunity created!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create opportunity")
    } finally {
      setCreating(false)
    }
  }, [token, title, category, difficulty, description, date, duration, location, maxSpots, eventLink, resourcesLink, tags])

  const handleDelete = useCallback(async (id: string) => {
    if (!token) return
    setDeleting(id)
    try {
      const cleanId = id.includes(":") ? id.split(":").slice(1).join(":") : id
      await opportunitiesApi.delete(cleanId, token)
      setOpportunities(prev => prev.filter(op => op.id !== id))
      if (selectedOpId === id) setSelectedOpId(null)
      toast.success("Opportunity deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete opportunity")
    } finally {
      setDeleting(null)
    }
  }, [token, selectedOpId])

  function resetForm() {
    setTitle(""); setCategory("environment"); setDifficulty(0); setDescription("")
    setDate(""); setDuration(""); setLocation(""); setMaxSpots("")
    setDropIn(false); setRecurring(""); setEventLink(""); setResourcesLink(""); setTags("")
    setEditingOpId(null)
  }

  function openEditModal(op: ApiOpportunity) {
    setSelectedOpId(null) // return to list so the modal is rendered
    setTitle(op.title)
    setCategory(op.category)
    setDifficulty(op.difficulty)
    setDescription(op.description)
    setDate(new Date(op.date).toISOString().slice(0, 16))
    setDuration(op.duration)
    setLocation(op.location)
    setMaxSpots(String(op.max_spots ?? ""))
    setDropIn(op.drop_in ?? false)
    setRecurring(op.recurring ?? "")
    setEventLink(op.event_link ?? "")
    setResourcesLink(op.resources_link ?? "")
    setTags((op.tags ?? []).join(", "))
    setEditingOpId(op.id)
    setShowCreate(true)
  }

  const handleUpdate = useCallback(async () => {
    if (!token || !editingOpId) return
    setCreating(true)
    try {
      const cleanId = editingOpId.includes(":") ? editingOpId.split(":").slice(1).join(":") : editingOpId
      const updated = await opportunitiesApi.update(cleanId, {
        title, category, difficulty, description,
        date: new Date(date).toISOString(),
        duration: Number(duration) || 1,
        location, max_spots: parseInt(maxSpots) || 20,
        drop_in: dropIn || undefined, recurring: recurring || undefined,
        event_link: eventLink || undefined, resources_link: resourcesLink || undefined,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : undefined,
      }, token)
      setOpportunities(prev => prev.map(op => op.id === editingOpId ? updated : op))
      setShowCreate(false)
      resetForm()
      toast.success("Opportunity updated!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update opportunity")
    } finally {
      setCreating(false)
    }
  }, [token, editingOpId, title, category, difficulty, description, date, duration, location, maxSpots, dropIn, recurring, eventLink, resourcesLink, tags])

  const selectedOpportunity = selectedOpId ? opportunities.find(op => op.id === selectedOpId) : null

  if (selectedOpportunity) {
    const opApps = applications.filter(a => a.opportunity_id === selectedOpportunity.id)
    const accepted = opApps.filter(a => a.status === "accepted").length
    const spotsLeft = (Number(selectedOpportunity.max_spots) || 0) - (Number(selectedOpportunity.spots_taken) || 0)

    return (
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
        <FadeIn>
          <button onClick={() => setSelectedOpId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso/35 hover:text-espresso transition-colors mb-5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
          </button>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <FadeIn>
              <Card className={cn(cardClass, "overflow-hidden mb-5")}>
                <div className="h-2 bg-matcha/30" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h1 className="text-xl font-extrabold text-espresso mb-2 text-balance md:text-2xl">{selectedOpportunity.title}</h1>
                      <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-xs font-semibold">
                        {normalizeCategory(selectedOpportunity.category)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ScaleOnTap>
                        <Button size="sm" variant="outline" onClick={() => openEditModal(selectedOpportunity)}
                          className="rounded-full border-border/60 text-xs font-semibold text-espresso/50 h-8">
                          <Edit3 className="mr-1.5 h-3 w-3" /> Edit
                        </Button>
                      </ScaleOnTap>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(selectedOpportunity.id)}
                        disabled={deleting === selectedOpportunity.id}
                        className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-semibold h-8">
                        {deleting === selectedOpportunity.id ? (
                          <div className="h-3 w-3 rounded-full border border-destructive/30 border-t-destructive animate-spin" />
                        ) : (
                          <><Trash2 className="mr-1.5 h-3 w-3" />Delete</>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-espresso/50 leading-relaxed mb-5">{selectedOpportunity.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { icon: Calendar, label: "Date",     value: formatDate(selectedOpportunity.date),              accent: "text-sky-dark" },
                      { icon: Clock,    label: "Duration", value: `${selectedOpportunity.duration} hour${selectedOpportunity.duration !== 1 ? "s" : ""}`, accent: "text-honey" },
                      { icon: MapPin,   label: "Location", value: selectedOpportunity.location.split(",")[0],        accent: "text-matcha-dark" },
                      { icon: Star,     label: "XP Reward",value: `${difficultyXp(selectedOpportunity.difficulty)} XP`, accent: "text-caramel" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1 rounded-xl bg-latte/40 p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-espresso/35">
                          <item.icon className={cn("h-3 w-3", item.accent)} /> {item.label}
                        </div>
                        <span className="text-xs font-bold text-espresso">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {(selectedOpportunity.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedOpportunity.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full text-xs font-medium text-espresso/45 border-border/50">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Card className={cardClass}><CardContent className="p-4 flex flex-col items-center gap-1">
                  <span className="text-2xl font-extrabold text-espresso">{opApps.length}</span>
                  <span className="text-[10px] font-semibold text-espresso/35">Applicants</span>
                </CardContent></Card>
                <Card className={cardClass}><CardContent className="p-4 flex flex-col items-center gap-1">
                  <span className="text-2xl font-extrabold text-matcha-dark">{accepted}</span>
                  <span className="text-[10px] font-semibold text-espresso/35">Accepted</span>
                </CardContent></Card>
                <Card className={cardClass}><CardContent className="p-4 flex flex-col items-center gap-1">
                  <span className={cn("text-2xl font-extrabold", spotsLeft <= 3 ? "text-destructive" : "text-espresso")}>{spotsLeft}</span>
                  <span className="text-[10px] font-semibold text-espresso/35">Spots Left</span>
                </CardContent></Card>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <Card className={cn(cardClass, "sticky top-24")}>
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-espresso mb-4 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-dark" />Applicants ({opApps.length})
                  </h3>
                  <div className="flex flex-col gap-3">
                    {opApps.length === 0 ? (
                      <p className="text-xs text-espresso/35 text-center py-6">No applicants yet</p>
                    ) : opApps.map((app) => {
                      const statusColors: Record<string, string> = {
                        pending:  "bg-honey/12 text-espresso/70",
                        accepted: "bg-matcha/12 text-matcha-dark",
                        rejected: "bg-espresso/6 text-espresso/40",
                      }
                      return (
                        <div key={app.id} className="flex items-center gap-3 rounded-xl bg-latte/40 p-3">
                          {app.user?.s3_pfp ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={app.user.s3_pfp} alt="" className="h-9 w-9 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="flex h-9 w-9 rounded-xl bg-matcha/10 items-center justify-center text-xs font-bold text-espresso/50 shrink-0">
                              {(app.user?.name ?? "?").split(" ").map(n => n[0]).join("")}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-espresso truncate">{app.user?.name ?? "Applicant"}</p>
                            <p className="text-[10px] text-espresso/35">{app.user?.email ?? formatDate(app.created_at)}</p>
                          </div>
                          <Badge className={cn("rounded-full border-none text-[9px] font-bold", statusColors[app.status] ?? "bg-latte text-espresso/50")}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
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
            <p className="mt-1 text-sm text-espresso/40">
              {loading ? "Loading..." : `${opportunities.length} opportunities by ${org?.name ?? "your org"}`}
            </p>
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
            { label: "Total Posted",    value: opportunities.length,                                            color: "bg-matcha/10 text-matcha-dark" },
            { label: "Active",          value: opportunities.filter(o => (Number(o.max_spots) || 0) - (Number(o.spots_taken) || 0) > 0).length, color: "bg-sky/10 text-sky-dark" },
            { label: "Total Applicants",value: applications.length,                                             color: "bg-honey/10 text-espresso/70" },
            { label: "Accepted",        value: applications.filter(a => a.status === "accepted").length,        color: "bg-caramel/10 text-espresso/60" },
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowCreate(false); resetForm() } }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl">
              <div className="h-1.5 bg-gradient-to-r from-matcha/40 via-sky/30 to-honey/30 rounded-t-2xl" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-espresso">{editingOpId ? "Edit Opportunity" : "Create New Opportunity"}</h2>
                    <p className="text-xs text-espresso/40 mt-0.5">{editingOpId ? "Update the details for this opportunity" : "Fill in the details to publish your volunteer opportunity"}</p>
                  </div>
                  <button onClick={() => { setShowCreate(false); resetForm() }}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-latte transition-colors text-espresso/40 hover:text-espresso">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" /> Basic Information
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Title *</label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Beach Cleanup Day at English Bay" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-espresso/40 mb-1 block">Category *</label>
                          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso focus:outline-none focus:ring-1 focus:ring-matcha">
                            <option value="environment">Environment</option>
                            <option value="education">Education</option>
                            <option value="community">Community</option>
                            <option value="arts">Arts & Culture</option>
                            <option value="health">Health</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-espresso/40 mb-1 block">Difficulty</label>
                          <select value={difficulty} onChange={e => setDifficulty(Number(e.target.value) as 0 | 1 | 2)} className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso focus:outline-none focus:ring-1 focus:ring-matcha">
                            <option value={0}>Easy (50 XP)</option>
                            <option value={1}>Medium (100 XP)</option>
                            <option value={2}>Hard (150 XP)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlignLeft className="h-3 w-3" /> Description *
                    </h3>
                    <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Describe what volunteers will do, what to bring, and what they'll gain..."
                      className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso placeholder:text-espresso/30 focus:outline-none focus:ring-1 focus:ring-matcha resize-none" />
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Event Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Date *</label>
                        <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Duration (hours) *</label>
                        <Input value={duration} onChange={e => setDuration(e.target.value === "" ? "" : Number(e.target.value))} type="number" min="0.5" step="0.5" placeholder="e.g. 3" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Location *</label>
                        <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. English Bay, Vancouver" className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Total Spots *</label>
                        <Input value={maxSpots} onChange={e => setMaxSpots(e.target.value)} placeholder="e.g. 25" type="number" min="1" className="rounded-xl h-10 text-sm" />
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
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Event sign-up link</label>
                        <Input value={eventLink} onChange={e => setEventLink(e.target.value)} placeholder="https://..." className="rounded-xl h-10 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Additional resources</label>
                        <Input value={resourcesLink} onChange={e => setResourcesLink(e.target.value)} placeholder="https://..." className="rounded-xl h-10 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Schedule (optional)
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-espresso/40 mb-1 block">Recurring</label>
                        <select value={recurring} onChange={e => setRecurring(e.target.value)} className="w-full rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm text-espresso focus:outline-none focus:ring-1 focus:ring-matcha">
                          <option value="">One-time event</option>
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 cursor-pointer hover:bg-latte/40 transition-colors">
                        <input type="checkbox" checked={dropIn} onChange={e => setDropIn(e.target.checked)} className="h-4 w-4 accent-matcha rounded" />
                        <div>
                          <span className="text-sm font-semibold text-espresso">Drop-in friendly</span>
                          <p className="text-[11px] text-espresso/40">Volunteers can show up without signing up in advance</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xs font-bold text-espresso/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Tag className="h-3 w-3" /> Tags (optional)
                    </h3>
                    <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="Outdoors, Beginner-Friendly, Group Activity (comma separated)" className="rounded-xl h-10 text-sm" />
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-5 border-t border-border/40">
                  <ScaleOnTap className="flex-1">
                    <Button onClick={editingOpId ? handleUpdate : handleCreate} disabled={creating || !title || !description || !date || !duration || !location || !maxSpots}
                      className="w-full rounded-full bg-espresso text-card hover:bg-espresso/90 font-bold text-sm h-11">
                      {creating ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-card/20 border-t-card" />
                      ) : editingOpId ? (
                        <><CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes</>
                      ) : (
                        <><CheckCircle2 className="mr-2 h-4 w-4" /> Publish Opportunity</>
                      )}
                    </Button>
                  </ScaleOnTap>
                  <Button variant="outline" onClick={() => { setShowCreate(false); resetForm() }} className="rounded-full border-border/60 text-sm font-semibold text-espresso/50 h-11 px-6">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opportunity Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-latte/40 animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-latte">
            <Plus className="h-7 w-7 text-espresso/20" />
          </div>
          <p className="text-sm font-semibold text-espresso/40">No opportunities yet</p>
          <Button onClick={() => setShowCreate(true)} className="rounded-full bg-espresso text-card font-bold">
            Create your first opportunity
          </Button>
        </div>
      ) : (
        <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((op) => {
            const opApps = applications.filter(a => a.opportunity_id === op.id)
            const accepted = opApps.filter(a => a.status === "accepted").length
            const spotsLeft = (Number(op.max_spots) || 0) - (Number(op.spots_taken) || 0)

            return (
              <StaggerItem key={op.id}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Card className={cn(cardClass, "overflow-hidden h-full hover:shadow-md hover:shadow-espresso/[0.06] transition-all")}>
                    <div className="h-1.5 bg-matcha/30" />
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-espresso leading-snug flex-1 mr-2">{op.title}</h3>
                        <button
                          onClick={() => handleDelete(op.id)}
                          disabled={deleting === op.id}
                          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-espresso/20 hover:text-destructive hover:bg-destructive/5 transition-colors"
                          aria-label="Delete opportunity"
                        >
                          {deleting === op.id ? (
                            <div className="h-3 w-3 rounded-full border border-destructive/30 border-t-destructive animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-espresso/40">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {op.location.split(",")[0]}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(op.date)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
                          <span className="text-sm font-extrabold text-espresso">{opApps.length}</span>
                          <span className="text-[9px] text-espresso/30">Applicants</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
                          <span className="text-sm font-extrabold text-matcha-dark">{accepted}</span>
                          <span className="text-[9px] text-espresso/30">Accepted</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-latte/50 p-2">
                          <span className={cn("text-sm font-extrabold", spotsLeft <= 3 ? "text-destructive" : "text-espresso")}>{spotsLeft}</span>
                          <span className="text-[9px] text-espresso/30">Spots Left</span>
                        </div>
                      </div>

                      <button onClick={() => setSelectedOpId(op.id)}
                        className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-espresso/40 hover:text-espresso pt-2 border-t border-border/40 transition-colors">
                        <Eye className="h-3 w-3" /> View Details
                        <ChevronRight className="ml-auto h-3.5 w-3.5" />
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      )}
    </div>
  )
}
