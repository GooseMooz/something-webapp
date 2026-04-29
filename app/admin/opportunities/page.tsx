"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Search, Briefcase, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminApi, difficultyLabel, formatDate, type ApiOpportunity } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

const CATEGORIES = [
  "all", "environment", "education", "community", "mental-health",
  "arts", "food", "animals", "reconciliation", "health", "technology",
  "seniors", "youth", "housing", "climate",
]

const difficultyColors: Record<string, string> = {
  Easy:   "bg-matcha/10 text-matcha-dark border-matcha/20",
  Medium: "bg-honey/10 text-espresso border-honey/20",
  Hard:   "bg-rose/10 text-rose border-rose/20",
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

export default function AdminOpportunitiesPage() {
  const { token } = useAuth()
  const [opportunities, setOpportunities] = useState<ApiOpportunity[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-espresso">Opportunities</h1>
        <p className="text-sm text-espresso/50 mt-1">{loading ? "Loading…" : `${opportunities.length} opportunities`}</p>
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
            {CATEGORIES.map((c) => (
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
    </div>
  )
}
