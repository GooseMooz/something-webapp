"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react"
import { usersApi, orgsApi, authApi, jwtId, decodeJwt, type ApiUser, type ApiOrg, type ApiAdmin } from "./api"

type AuthType = "user" | "org" | "admin" | null

interface AuthState {
  token: string | null
  type: AuthType
  userId: string | null
  user: ApiUser | null
  org: ApiOrg | null
  admin: ApiAdmin | null
}

interface AuthContextValue extends AuthState {
  loginAsUser: (token: string) => Promise<void>
  loginAsOrg: (token: string) => Promise<void>
  loginAsAdmin: (token: string, admin: ApiAdmin) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  refreshOrg: () => Promise<void>
  setUser: (user: ApiUser) => void
  setOrg: (org: ApiOrg) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_TOKEN      = "sth_auth_token"
const STORAGE_TYPE       = "sth_auth_type"
const STORAGE_ID         = "sth_auth_id"
const STORAGE_ADMIN_NAME  = "sth_admin_name"
const STORAGE_ADMIN_EMAIL = "sth_admin_email"
const pfpBustKey = (id: string) => `sth_pfp_bust_${id}`

function withPfpBust(user: ApiUser, userId: string): ApiUser {
  if (!user.s3_pfp) return user
  const bust = localStorage.getItem(pfpBustKey(userId))
  if (!bust) return user
  return { ...user, s3_pfp: `${user.s3_pfp.split("?")[0]}?v=${bust}` }
}

// Refresh the access token this many ms before it expires.
const REFRESH_BUFFER_MS = 2 * 60 * 1000

function clearStorage() {
  localStorage.removeItem(STORAGE_TOKEN)
  localStorage.removeItem(STORAGE_TYPE)
  localStorage.removeItem(STORAGE_ID)
  localStorage.removeItem(STORAGE_ADMIN_NAME)
  localStorage.removeItem(STORAGE_ADMIN_EMAIL)
}

/** How many milliseconds until this JWT expires (negative = already expired). */
function msUntilExpiry(token: string): number {
  const payload = decodeJwt(token)
  if (!payload?.exp) return 0
  return (payload.exp as number) * 1000 - Date.now()
}

/** Pick the access token from a refresh response (handles both field names). */
function pickToken(data: { token: string; access_token?: string }): string {
  return data.access_token ?? data.token
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null, type: null, userId: null, user: null, org: null, admin: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearRefreshTimer() {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  /**
   * Schedule a silent token refresh REFRESH_BUFFER_MS before the access token
   * expires. Called after every successful login or refresh.
   */
  const scheduleRefresh = useCallback(
    (token: string, type: NonNullable<AuthType>, userId: string) => {
      clearRefreshTimer()
      const delay = msUntilExpiry(token) - REFRESH_BUFFER_MS
      if (delay <= 0) return // already within buffer — mount effect handles it

      refreshTimerRef.current = setTimeout(async () => {
        try {
          const data = await authApi.refresh()
          const newToken = pickToken(data)
          localStorage.setItem(STORAGE_TOKEN, newToken)
          setState((s) => ({ ...s, token: newToken }))
          scheduleRefresh(newToken, type, userId)
        } catch {
          clearStorage()
          clearRefreshTimer()
          setState({ token: null, type: null, userId: null, user: null, org: null, admin: null })
        }
      }, delay)
    },
    []
  )

  // ── Restore session on mount ────────────────────────────────────────────────
  useEffect(() => {
    const storedToken  = localStorage.getItem(STORAGE_TOKEN)
    const storedType   = localStorage.getItem(STORAGE_TYPE) as NonNullable<AuthType> | null
    const storedUserId = localStorage.getItem(STORAGE_ID)

    async function restore() {
      if (!storedType || !storedUserId) return

      // Use the stored token if it has enough life left; otherwise refresh first.
      let token = storedToken
      if (!token || msUntilExpiry(token) < REFRESH_BUFFER_MS) {
        try {
          const data = await authApi.refresh()
          token = pickToken(data)
          localStorage.setItem(STORAGE_TOKEN, token)
        } catch {
          // Refresh token is gone / expired → user must log in again.
          clearStorage()
          return
        }
      }

      setState((s) => ({ ...s, token, type: storedType, userId: storedUserId }))

      try {
        if (storedType === "user") {
          const user = await usersApi.get(storedUserId, token!)
          setState((s) => ({ ...s, user: withPfpBust(user, storedUserId) }))
        } else if (storedType === "org") {
          const org = await orgsApi.get(storedUserId, token!)
          setState((s) => ({ ...s, org }))
        } else if (storedType === "admin") {
          const adminName = localStorage.getItem(STORAGE_ADMIN_NAME) || "Admin"
          const adminEmail = localStorage.getItem(STORAGE_ADMIN_EMAIL) || ""
          const admin: ApiAdmin = { id: storedUserId, email: adminEmail, name: adminName, created_at: "", updated_at: "" }
          setState((s) => ({ ...s, admin }))
        }
        scheduleRefresh(token!, storedType, storedUserId)
      } catch {
        clearStorage()
        setState({ token: null, type: null, userId: null, user: null, org: null, admin: null })
      }
    }

    restore().finally(() => setIsLoading(false))
    return () => clearRefreshTimer()
  }, [scheduleRefresh])

  // ── Login / logout ──────────────────────────────────────────────────────────

  const loginAsUser = useCallback(async (token: string) => {
    const id = jwtId(token)
    if (!id) throw new Error("Could not determine user ID from token")

    localStorage.setItem(STORAGE_TOKEN, token)
    localStorage.setItem(STORAGE_TYPE, "user")
    localStorage.setItem(STORAGE_ID, id)

    const user = await usersApi.get(id, token)
    setState({ token, type: "user", userId: id, user: withPfpBust(user, id), org: null, admin: null })
    scheduleRefresh(token, "user", id)
  }, [scheduleRefresh])

  const loginAsOrg = useCallback(async (token: string) => {
    const id = jwtId(token)
    if (!id) throw new Error("Could not determine org ID from token")

    localStorage.setItem(STORAGE_TOKEN, token)
    localStorage.setItem(STORAGE_TYPE, "org")
    localStorage.setItem(STORAGE_ID, id)

    const org = await orgsApi.get(id, token)
    setState({ token, type: "org", userId: id, user: null, org, admin: null })
    scheduleRefresh(token, "org", id)
  }, [scheduleRefresh])

  const loginAsAdmin = useCallback(async (token: string, admin: ApiAdmin) => {
    const id = admin.id.includes(":") ? admin.id.split(":").slice(1).join(":") : admin.id

    localStorage.setItem(STORAGE_TOKEN, token)
    localStorage.setItem(STORAGE_TYPE, "admin")
    localStorage.setItem(STORAGE_ID, id)
    localStorage.setItem(STORAGE_ADMIN_NAME, admin.name)
    localStorage.setItem(STORAGE_ADMIN_EMAIL, admin.email)

    setState({ token, type: "admin", userId: id, user: null, org: null, admin: { ...admin, id } })
    scheduleRefresh(token, "admin", id)
  }, [scheduleRefresh])

  const logout = useCallback(() => {
    clearRefreshTimer()
    clearStorage()
    setState({ token: null, type: null, userId: null, user: null, org: null, admin: null })
    // Revoke the refresh token on the backend (fire-and-forget).
    authApi.logout().catch(() => {})
  }, [])

  // ── Profile helpers ─────────────────────────────────────────────────────────

  const refreshUser = useCallback(async () => {
    if (!state.token || !state.userId || state.type !== "user") return
    const user = await usersApi.get(state.userId, state.token)
    setState((s) => ({ ...s, user: withPfpBust(user, state.userId!) }))
  }, [state.token, state.userId, state.type])

  const refreshOrg = useCallback(async () => {
    if (!state.userId || state.type !== "org") return
    const org = await orgsApi.get(state.userId, state.token ?? undefined)
    setState((s) => ({ ...s, org }))
  }, [state.userId, state.type, state.token])

  const setUser = useCallback((user: ApiUser) => {
    setState((s) => {
      if (user.s3_pfp && s.userId) {
        const bust = Date.now().toString()
        localStorage.setItem(pfpBustKey(s.userId), bust)
        user = { ...user, s3_pfp: `${user.s3_pfp!.split("?")[0]}?v=${bust}` }
      }
      return { ...s, user }
    })
  }, [])

  const setOrg = useCallback((org: ApiOrg) => {
    setState((s) => ({ ...s, org }))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginAsUser,
        loginAsOrg,
        loginAsAdmin,
        logout,
        refreshUser,
        refreshOrg,
        setUser,
        setOrg,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
