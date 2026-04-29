"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Search, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { adminApi, formatDate, type ApiUser } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

function SkeletonRow() {
  return (
    <tr className="border-b border-border/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-muted animate-pulse rounded" />
            <div className="h-2.5 w-36 bg-muted/60 animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell"><div className="h-3 w-24 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-3 w-20 bg-muted animate-pulse rounded" /></td>
      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 w-16 bg-muted animate-pulse rounded" /></td>
    </tr>
  )
}

export default function AdminUsersPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState<ApiUser[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (q?: string) => {
    if (!token) return
    setLoading(true)
    try {
      const data = await adminApi.getUsers(token, q ? { search: q } : undefined)
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(search || undefined), 380)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-espresso">Users</h1>
        <p className="text-sm text-espresso/50 mt-1">{loading ? "Loading…" : `${users.length} registered users`}</p>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso/40" />
        <Input
          placeholder="Search by name, email, bio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-border/60 h-10"
        />
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-espresso/60">User</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden md:table-cell">Skills</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden lg:table-cell">Categories</th>
              <th className="text-left px-4 py-3 font-medium text-espresso/60 hidden sm:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-espresso/40">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No users found</p>
                </td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={user.s3_pfp} />
                      <AvatarFallback className="text-xs font-semibold bg-matcha/20 text-matcha-dark">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-espresso truncate">{user.name}</div>
                      <div className="text-xs text-espresso/50 truncate">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(user.skills ?? []).slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px] py-0 h-5 font-normal">{s}</Badge>
                    ))}
                    {(user.skills?.length ?? 0) > 3 && (
                      <span className="text-[10px] text-espresso/40 self-center">+{(user.skills?.length ?? 0) - 3}</span>
                    )}
                    {!user.skills?.length && <span className="text-xs text-espresso/30">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(user.categories ?? []).slice(0, 2).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] py-0 h-5 font-normal border-matcha/30 text-matcha-dark">{c}</Badge>
                    ))}
                    {!user.categories?.length && <span className="text-xs text-espresso/30">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-xs text-espresso/50">
                  {user.created_at ? formatDate(user.created_at) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
