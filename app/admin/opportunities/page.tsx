"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Search, Briefcase, ChevronRight, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { adminApi, difficultyLabel, formatDate, type ApiOpportunity, type ApiOrg } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

const CATEGORIES = [
  "environment", "education", "community", "mental-health",
  "arts", "food", "animals", "reconciliation", "health", "technology",
  "seniors", "youth", "housing", "climate",
]

const difficultyColors: Record<string, string> = {
  Easy:   "bg-matcha/10 text-matcha-dark border-matcha/20",
  Medium: "bg-honey/10 text-espresso border-honey/20",
  Hard:   "bg-rose/10 text-rose border-rose/20",
}

const EMPTY_FORM = {
  org_id: "",
  title: "",
  category: "environment",
  difficulty: "0" as "0" | "1" | "2",
  description: "",
  date: "",
  duration: "",
  location: "",
  max_spots: "",
  recurring: "",
  drop_in: false,
  event_link: "",
  resources_link: "",
  tags: "",
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/40">
      <td className="px-4 py-3"><div className="h-3.5 w-40 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-5 w-16 bg-muted animate-pulse rounded-full" /></td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-5 w-14 bg-muted animate-pulse rounded-full" /></td>
      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 w-24 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 w-12 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3"><div className="h-4 w-4 bg-muted animate-pulse rounded ml-auto" /></td>
    </tr>
  )
}

function CreateSheet({
  open,
  onClose,
  onCreated,
  token,
}: {
  open: boolean
  onClose: () => void
  onCreated: (opp: ApiOpportunity) => void
  token: string
}) {
  const [orgs, setOrgs] = useState<ApiOrg[]>([])
  const [orgsLoading, setOrgsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fields, setFields] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!open) return
    setOrgsLoading(true)
    adminApi.getOrgs(token)
      .then(setOrgs)
      .catch(() => toast.error("Could not load organizations"))
      .finally(() => setOrgsLoading(false))
  }, [open, token])

  function set(key: keyof typeof fields, value: string | boolean) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  function handleClose() {
    setFields(EMPTY_FORM)
    onClose()
  }

  async function handleCreate() {
    if (!fields.org_id || !fields.title || !fields.description || !fields.date || !fields.duration || !fields.location || !fields.max_spots) {
      toast.error("Please fill in all required fields")
      return
    }
    setSaving(true)
    try {
      const created = await adminApi.createOpportunity({
        org_id: fields.org_id,
        title: fields.title,
        category: fields.category,
        difficulty: Number(fields.difficulty) as 0 | 1 | 2,
        description: fields.description,
        date: new Date(fields.date).toISOString(),
        duration: Number(fields.duration),
        location: fields.location,
        max_spots: Number(fields.max_spots),
        drop_in: fields.drop_in || undefined,
        recurring: fields.recurring || undefined,
        event_link: fields.event_link || undefined,
        resources_link: fields.resources_link || undefined,
        tags: fields.tags ? fields.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      }, token)
      toast.success("Opportunity created")
      onCreated(created)
      handleClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create opportunity")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-espresso">Create Opportunity</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Org selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Organization <span className="text-destructive">*</span></Label>
            {orgsLoading ? (
              <div className="h-10 rounded-xl bg-muted animate-pulse" />
            ) : (
              <Select value={fields.org_id} onValueChange={(v) => set("org_id", v)}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Select an organization…" />
                </SelectTrigger>
                <SelectContent>
                  {orgs.map((org) => {
                    const rawId = org.id.includes(":") ? org.id.split(":").slice(1).join(":") : org.id
                    return (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                        <span className="ml-1.5 text-[10px] text-espresso/40">{rawId}</span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Title <span className="text-destructive">*</span></Label>
            <Input value={fields.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Park Cleanup Day" className="rounded-xl h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Category <span className="text-destructive">*</span></Label>
              <Select value={fields.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Difficulty</Label>
              <Select value={fields.difficulty} onValueChange={(v) => set("difficulty", v as "0" | "1" | "2")}>
                <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Easy</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="2">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-espresso/70">Description <span className="text-destructive">*</span></Label>
            <Textarea value={fields.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Describe what volunteers will do…" className="rounded-xl min-h-[90px] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Date & Time <span className="text-destructive">*</span></Label>
              <Input type="datetime-local" value={fields.date} onChange={(e) => set("date", e.target.value)} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Duration (hrs) <span className="text-destructive">*</span></Label>
              <Input type="number" min="0.5" step="0.5" placeholder="e.g. 3" value={fields.duration} onChange={(e) => set("duration", e.target.value)} className="rounded-xl h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Location <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Vancouver, BC" value={fields.location} onChange={(e) => set("location", e.target.value)} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Max Spots <span className="text-destructive">*</span></Label>
              <Input type="number" min="1" placeholder="e.g. 20" value={fields.max_spots} onChange={(e) => set("max_spots", e.target.value)} className="rounded-xl h-10" />
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Event Link</Label>
              <Input type="url" placeholder="https://…" value={fields.event_link} onChange={(e) => set("event_link", e.target.value)} className="rounded-xl h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-espresso/70">Resources Link</Label>
              <Input type="url" placeholder="https://…" value={fields.resources_link} onChange={(e) => set("resources_link", e.target.value)} className="rounded-xl h-10" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input id="drop_in" type="checkbox" checked={fields.drop_in}
              onChange={(e) => set("drop_in", e.target.checked)} className="rounded border-border/60 accent-matcha-dark" />
            <Label htmlFor="drop_in" className="text-xs font-medium text-espresso/70">Drop-in allowed</Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1 rounded-full h-10">Cancel</Button>
            <Button disabled={saving} onClick={handleCreate}
              className="flex-1 rounded-full h-10 bg-espresso text-cream hover:bg-espresso/90">
              {saving ? "Creating…" : "Create Opportunity"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function AdminOpportunitiesPage() {
  const { token } = useAuth()
  const [opportunities, setOpportunities] = useState<ApiOpportunity[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (q?: string, cat?: string) => {
    if (!token) return
    setLoading(true)
    try {
      const params: Parameters<typeof adminApi.getOpportunities>[1] = {}
      if (q) params.search = q
      if (cat && cat !== "all") params.category = cat
      const data = await adminApi.getOpportunities(token, params)
      setOpportunities(data)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load(undefined, category) }, [load, category])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(search || undefined, category), 380)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Opportunities</h1>
          <p className="text-sm text-espresso/50 mt-1">{loading ? "Loading…" : `${opportunities.length} opportunities`}</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="shrink-0 rounded-full bg-espresso text-cream hover:bg-espresso/90 gap-1.5 h-9 px-4 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> Create
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso/40" />
          <Input
            placeholder="Search by title, description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-border/60 h-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-40 rounded-xl border-border/60 h-10">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {["all", ...CATEGORIES].map((c) => (
              <SelectItem key={c} value={c} className="capitalize">{c === "all" ? "All categories" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-espresso/60">Title</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden md:table-cell">Difficulty</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden sm:table-cell">Spots</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : opportunities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-espresso/40">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No opportunities found</p>
                </td>
              </tr>
            ) : opportunities.map((opp) => {
              const diff = difficultyLabel(opp.difficulty)
              const spotsLeft = opp.spots_left ?? Math.max(0, opp.max_spots - (opp.spots_taken ?? 0))
              const rawId = opp.id.includes(":") ? opp.id.split(":").slice(1).join(":") : opp.id
              return (
                <tr key={opp.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-espresso truncate max-w-[200px]">{opp.title}</div>
                    <div className="text-xs text-espresso/40 truncate">{opp.location}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="outline" className="text-[10px] capitalize border-border/60 text-espresso/70">{opp.category}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", difficultyColors[diff])}>
                      {diff}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-espresso/60">{formatDate(opp.date)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-espresso/60">
                    {spotsLeft}/{opp.max_spots}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/opportunities/${rawId}`}
                      className="inline-flex items-center gap-1 text-xs text-espresso/50 hover:text-espresso transition-colors"
                    >
                      Manage <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {token && (
        <CreateSheet
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={(opp) => setOpportunities((prev) => [opp, ...prev])}
          token={token}
        />
      )}
    </div>
  )
}
