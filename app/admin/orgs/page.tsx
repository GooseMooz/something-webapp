"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Search, Building2, CheckCircle2, XCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi, formatDate, type ApiOrg } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type VerifiedFilter = "all" | "verified" | "unverified"

function SkeletonRow() {
  return (
    <tr className="border-b border-border/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            <div className="h-2.5 w-40 bg-muted/60 animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 w-20 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 w-24 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3"><div className="h-6 w-20 bg-muted animate-pulse rounded-full ml-auto" /></td>
    </tr>
  )
}

export default function AdminOrgsPage() {
  const { token } = useAuth()
  const [orgs, setOrgs] = useState<ApiOrg[]>([])
  const [search, setSearch] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>("all")
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (q?: string, vf?: VerifiedFilter) => {
    if (!token) return
    setLoading(true)
    try {
      const params: Parameters<typeof adminApi.getOrgs>[1] = {}
      if (q) params.search = q
      const filter = vf ?? "all"
      if (filter === "verified") params.verified = true
      else if (filter === "unverified") params.verified = false
      const data = await adminApi.getOrgs(token, params)
      setOrgs(data)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load(undefined, verifiedFilter) }, [load, verifiedFilter])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(search || undefined, verifiedFilter), 380)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleToggleVerify(org: ApiOrg) {
    if (!token) return
    const rawId = org.id.includes(":") ? org.id.split(":").slice(1).join(":") : org.id
    setToggling(org.id)
    try {
      const updated = await adminApi.verifyOrg(rawId, !org.verified, token)
      setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, verified: updated.verified } : o)))
      toast.success(updated.verified ? `${org.name} verified` : `${org.name} unverified`)
    } catch {
      toast.error("Failed to update verification status")
    } finally {
      setToggling(null)
    }
  }

  const filterBtns: { label: string; value: VerifiedFilter }[] = [
    { label: "All", value: "all" },
    { label: "Verified", value: "verified" },
    { label: "Unverified", value: "unverified" },
  ]

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-espresso">Organizations</h1>
        <p className="text-sm text-espresso/50 mt-1">{loading ? "Loading…" : `${orgs.length} organizations`}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso/40" />
          <Input
            placeholder="Search by name, email, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-border/60 h-10"
          />
        </div>
        <div className="flex rounded-xl bg-muted/60 p-1 border border-border/40 gap-0.5 h-10 self-start sm:self-auto">
          {filterBtns.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setVerifiedFilter(value)}
              className={cn(
                "px-3 rounded-lg text-xs font-medium transition-colors",
                verifiedFilter === value
                  ? "bg-card shadow-sm text-espresso"
                  : "text-espresso/50 hover:text-espresso/70"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-espresso/60">Organization</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden sm:table-cell">Location</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden md:table-cell">Categories</th>
              <th className="text-right px-4 py-3 font-medium text-espresso/60">Verified</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : orgs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-espresso/40">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No organizations found</p>
                </td>
              </tr>
            ) : orgs.map((org) => (
              <tr key={org.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={org.s3_pfp} />
                      <AvatarFallback className="text-xs font-semibold bg-sky/20 text-sky-dark">
                        {org.name?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-espresso truncate">{org.name}</div>
                      <div className="text-xs text-espresso/50 truncate">{org.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-xs text-espresso/70">{org.location || "—"}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(org.categories ?? []).slice(0, 2).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] py-0 h-5 font-normal border-sky/30 text-sky-dark">{c}</Badge>
                    ))}
                    {!org.categories?.length && <span className="text-xs text-espresso/30">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={toggling === org.id}
                    onClick={() => handleToggleVerify(org)}
                    className={cn(
                      "h-7 gap-1.5 rounded-full text-xs font-medium px-3 transition-colors",
                      org.verified
                        ? "text-matcha-dark bg-matcha/10 hover:bg-rose/15 hover:text-rose"
                        : "text-espresso/50 bg-muted/60 hover:bg-matcha/10 hover:text-matcha-dark"
                    )}
                  >
                    {org.verified ? (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> Verified</>
                    ) : (
                      <><XCircle className="h-3.5 w-3.5" /> Verify</>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
