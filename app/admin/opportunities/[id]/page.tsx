"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Pencil, Users, CheckCircle2, XCircle, FileText,
  MapPin, Calendar, Clock, Layers, ExternalLink,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  adminApi, opportunitiesApi, difficultyLabel, formatDate,
  type ApiOpportunity, type ApiApplication,
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

const CATEGORIES = [
  "environment", "education", "community", "mental-health", "arts",
  "food", "animals", "reconciliation", "health", "technology",
  "seniors", "youth", "housing", "climate",
]

const statusColors: Record<string, string> = {
  pending:  "bg-honey/10 text-espresso border-honey/20",
  accepted: "bg-matcha/10 text-matcha-dark border-matcha/20",
  rejected: "bg-rose/10 text-rose border-rose/20",
}

function EditSheet({
  opp,
  open,
  onClose,
  onSaved,
}: {
  opp: ApiOpportunity
  open: boolean
  onClose: () => void
  onSaved: (updated: ApiOpportunity) => void
}) {
  const { token } = useAuth()
  const [saving, setSaving] = useState(false)
  const [fields, setFields] = useState({
    title: opp.title,
    category: opp.category,
    difficulty: String(opp.difficulty) as "0" | "1" | "2",
    description: opp.description,
    date: opp.date ? new Date(opp.date).toISOString().slice(0, 16) : "",
    duration: String(opp.duration),
    location: opp.location,
    max_spots: String(opp.max_spots),
    recurring: opp.recurring ?? "",
    drop_in: opp.drop_in ?? false,
    event_link: opp.event_link ?? "",
    resources_link: opp.resources_link ?? "",
    tags: (opp.tags ?? []).join(", "),
  })

  function set(key: keyof typeof fields, value: string | boolean) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    if (!token) return
    setSaving(true)
    const rawId = opp.id.includes(":") ? opp.id.split(":").slice(1).join(":") : opp.id
    try {
      const payload: Parameters<typeof adminApi.updateOpportunity>[1] = {
        title: fields.title,
        category: fields.category,
        difficulty: Number(fields.difficulty) as 0 | 1 | 2,
        description: fields.description,
        date: fields.date ? new Date(fields.date).toISOString() : undefined,
        duration: Number(fields.duration),
        location: fields.location,
        max_spots: Number(fields.max_spots),
        drop_in: fields.drop_in,
        event_link: fields.event_link || undefined,
        resources_link: fields.resources_link || undefined,
        tags: fields.tags ? fields.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        recurring: fields.recurring || undefined,
      }
      const updated = await adminApi.updateOpportunity(rawId, payload, token)
      toast.success("Opportunity updated")
      onSaved(updated)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update opportunity")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-espresso">Edit Opportunity</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Title</Label>
            <Input value={fields.title} onChange={(e) => set("title", e.target.value)} className="rounded-xl h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Category</Label>
              <Select value={fields.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Difficulty</Label>
              <Select value={fields.difficulty} onValueChange={(v) => set("difficulty", v as "0" | "1" | "2")}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Easy</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="2">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Description</Label>
            <Textarea
              value={fields.description}
              onChange={(e) => set("description", e.target.value)}
              className="rounded-xl min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Date & Time</Label>
              <Input type="datetime-local" value={fields.date} onChange={(e) => set("date", e.target.value)} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Duration (hrs)</Label>
              <Input type="number" min="0.5" step="0.5" value={fields.duration} onChange={(e) => set("duration", e.target.value)} className="rounded-xl h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Location</Label>
              <Input value={fields.location} onChange={(e) => set("location", e.target.value)} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Max Spots</Label>
              <Input type="number" min="1" value={fields.max_spots} onChange={(e) => set("max_spots", e.target.value)} className="rounded-xl h-10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Recurring (optional)</Label>
            <Input placeholder="e.g. weekly, monthly" value={fields.recurring} onChange={(e) => set("recurring", e.target.value)} className="rounded-xl h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Tags (comma-separated)</Label>
            <Input placeholder="e.g. outdoors, cleanup" value={fields.tags} onChange={(e) => set("tags", e.target.value)} className="rounded-xl h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Event Link (optional)</Label>
            <Input type="url" placeholder="https://…" value={fields.event_link} onChange={(e) => set("event_link", e.target.value)} className="rounded-xl h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Resources Link (optional)</Label>
            <Input type="url" placeholder="https://…" value={fields.resources_link} onChange={(e) => set("resources_link", e.target.value)} className="rounded-xl h-10" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="drop_in"
              type="checkbox"
              checked={fields.drop_in}
              onChange={(e) => set("drop_in", e.target.checked)}
              className="rounded border-border/60 accent-matcha-dark"
            />
            <Label htmlFor="drop_in" className="text-xs font-medium text-espresso/70">Drop-in allowed</Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-full h-10">Cancel</Button>
            <Button
              disabled={saving}
              onClick={handleSave}
              className="flex-1 rounded-full h-10 bg-espresso text-cream hover:bg-espresso/90"
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function AdminOpportunityDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useAuth()

  const [opp, setOpp] = useState<ApiOpportunity | null>(null)
  const [applications, setApplications] = useState<ApiApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token || !params.id) return
    setLoading(true)
    try {
      const [oppData, appsData] = await Promise.all([
        opportunitiesApi.get(params.id),
        adminApi.getOpportunityApplications(params.id, token),
      ])
      setOpp(oppData)
      setApplications(appsData.applications)
    } catch {
      toast.error("Failed to load opportunity")
    } finally {
      setLoading(false)
    }
  }, [token, params.id])

  useEffect(() => { load() }, [load])

  async function handleUpdateApplication(appId: string, status: "accepted" | "rejected") {
    if (!token) return
    const rawId = appId.includes(":") ? appId.split(":").slice(1).join(":") : appId
    setUpdating(appId)
    try {
      const updated = await adminApi.updateApplication(rawId, status, token)
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, ...updated } : a)))
      if (updated.opportunity?.spots_left !== undefined) {
        setOpp((o) => o ? { ...o, spots_left: updated.opportunity!.spots_left } : o)
      }
      toast.success(status === "accepted" ? "Application accepted" : "Application rejected")
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (/409|no spots|conflict/i.test(msg)) {
        toast.error("This opportunity has no spots left.")
      } else {
        toast.error(`Failed to ${status} application`)
      }
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-6" />
        <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-48 bg-muted/60 animate-pulse rounded" />
      </div>
    )
  }

  if (!opp) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8 text-center text-espresso/50">
        <p>Opportunity not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.back()}>Go back</Button>
      </div>
    )
  }

  const diff = difficultyLabel(opp.difficulty)
  const spotsLeft = opp.spots_left ?? Math.max(0, opp.max_spots - (opp.spots_taken ?? 0))
  const pending = applications.filter((a) => a.status === "pending").length
  const accepted = applications.filter((a) => a.status === "accepted").length

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Back link */}
      <Link href="/admin/opportunities" className="inline-flex items-center gap-1.5 text-sm text-espresso/50 hover:text-espresso transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-espresso">{opp.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="capitalize text-xs border-border/60 text-espresso/60">{opp.category}</Badge>
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", {
              "bg-matcha/10 text-matcha-dark border-matcha/20": diff === "Easy",
              "bg-honey/10 text-espresso border-honey/20": diff === "Medium",
              "bg-rose/10 text-rose border-rose/20": diff === "Hard",
            })}>{diff}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          className="shrink-0 gap-1.5 rounded-full border-border/60 text-espresso/70 hover:text-espresso"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </div>

      {/* Details card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Calendar,  label: "Date",     value: formatDate(opp.date) },
          { icon: Clock,     label: "Duration", value: `${opp.duration}h` },
          { icon: MapPin,    label: "Location", value: opp.location },
          { icon: Layers,    label: "Spots",    value: `${spotsLeft} left / ${opp.max_spots}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border/60 bg-card p-3">
            <div className="flex items-center gap-1.5 text-espresso/50 mb-1">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">{label}</span>
            </div>
            <div className="text-sm font-medium text-espresso">{value}</div>
          </div>
        ))}
      </div>

      {opp.description && (
        <p className="text-sm text-espresso/70 mb-6 leading-relaxed max-w-2xl">{opp.description}</p>
      )}

      {(opp.event_link || opp.resources_link) && (
        <div className="flex gap-3 mb-6">
          {opp.event_link && (
            <a href={opp.event_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-dark hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Event Link
            </a>
          )}
          {opp.resources_link && (
            <a href={opp.resources_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-dark hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Resources
            </a>
          )}
        </div>
      )}

      {/* Applicants */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-espresso">Applicants</h2>
          <p className="text-xs text-espresso/50 mt-0.5">{applications.length} total · {pending} pending · {accepted} accepted</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-espresso/60">Applicant</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden sm:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden md:table-cell">Applied</th>
              <th className="text-right px-4 py-3 font-medium text-espresso/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-espresso/40">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No applications yet</p>
                </td>
              </tr>
            ) : applications.map((app) => {
              const user = app.user
              const resumeUrl = (user as typeof user & { s3_pdf?: string })?.s3_pdf
              const isBusy = updating === app.id
              return (
                <tr key={app.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user?.s3_pfp} />
                        <AvatarFallback className="text-xs font-semibold bg-matcha/20 text-matcha-dark">
                          {user?.name?.[0]?.toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-espresso truncate">{user?.name ?? "Unknown"}</div>
                        <div className="text-xs text-espresso/50 truncate">{user?.email ?? ""}</div>
                      </div>
                      {resumeUrl && (
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                          className="ml-1 text-sky-dark hover:text-sky shrink-0" title="View resume">
                          <FileText className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize", statusColors[app.status])}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-espresso/50">
                    {formatDate(app.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status !== "accepted" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isBusy}
                          onClick={() => handleUpdateApplication(app.id, "accepted")}
                          className="h-7 gap-1 rounded-full text-xs px-2.5 text-matcha-dark bg-matcha/10 hover:bg-matcha/20"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Accept</span>
                        </Button>
                      )}
                      {app.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isBusy}
                          onClick={() => handleUpdateApplication(app.id, "rejected")}
                          className="h-7 gap-1 rounded-full text-xs px-2.5 text-rose bg-rose/10 hover:bg-rose/20"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Edit sheet */}
      {opp && (
        <EditSheet
          opp={opp}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setOpp(updated)}
        />
      )}
    </div>
  )
}
