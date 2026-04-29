// API client — all requests go through the Next.js proxy at /api/proxy
// The real backend URL is server-side only (BACKEND_URL in .env.local)

const BASE_URL = "/api/proxy"

// ── Types ─────────────────────────────────────────────────

export interface ApiUser {
  id: string
  name: string
  email: string
  bio?: string
  skills?: string[]
  categories?: string[]
  intensity?: string
  phone?: string
  instagram?: string
  linkedin?: string
  s3_pfp?: string
  s3_pdf?: string
  xp?: number
  badges?: string[]
  created_at?: string
  updated_at?: string
}

export interface ApiAdmin {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface ApiOrg {
  id: string
  name: string
  email: string
  description?: string
  website?: string
  phone?: string
  address?: string
  location: string
  categories?: string[]
  instagram?: string
  linkedin?: string
  s3_pfp?: string
  verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface ApiOpportunity {
  id: string
  org_id: string
  title: string
  category: string
  difficulty: 0 | 1 | 2
  description: string
  date: string
  duration: number
  location: string
  max_spots: number
  spots_taken: number
  spots_left?: number
  recurring?: string
  drop_in?: boolean
  event_link?: string
  resources_link?: string
  tags?: string[]
  org?: ApiOrg
  created_at?: string
  updated_at?: string
}

export interface ApiApplication {
  id: string
  user_id: string
  opportunity_id: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
  updated_at?: string
  xp_awarded?: boolean
  opportunity?: ApiOpportunity
  user?: ApiUser
}

// ── HTTP helpers ───────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 204) return {} as T

  const data = await res.json().catch(() => ({ error: res.statusText }))
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return data as T
}

async function upload<T>(
  path: string,
  file: File,
  fieldName: string,
  token: string
): Promise<T> {
  const form = new FormData()
  form.append(fieldName, file)

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })

  const data = await res.json().catch(() => ({ error: res.statusText }))
  if (!res.ok) throw new Error(data.error || `Upload failed: ${res.status}`)
  return data as T
}

// ── Auth ───────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    request<ApiUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  orgRegister: (data: {
    name: string
    email: string
    password: string
    location: string
  }) =>
    request<ApiOrg>("/auth/org/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  orgLogin: (data: { email: string; password: string }) =>
    request<{ token: string }>("/auth/org/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  adminLogin: (data: { email: string; password: string }) =>
    request<{ token: string; access_token?: string; admin: ApiAdmin }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Uses the HttpOnly refresh-token cookie — no Authorization header needed.
  // Returns both token and access_token (the latter for backward compat).
  refresh: () =>
    request<{ token: string; access_token?: string }>("/auth/refresh", { method: "POST" }),

  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),
}

// ── Users ──────────────────────────────────────────────────

export const usersApi = {
  get: (id: string, token?: string) =>
    request<ApiUser>(`/users/${id}`, {}, token),

  update: (id: string, data: Partial<ApiUser>, token: string) =>
    request<ApiUser>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, token),

  uploadPfp: (id: string, file: File, token: string) =>
    upload<ApiUser>(`/users/${id}/pfp`, file, "file", token),

  uploadResume: (id: string, file: File, token: string) =>
    upload<ApiUser>(`/users/${id}/resume`, file, "file", token),

  getNotificationSettings: (id: string, token: string) =>
    request<UserNotificationSettings>(`/users/${id}/notification-settings`, {}, token),

  updateNotificationSettings: (id: string, settings: UserNotificationSettings, token: string) =>
    request<UserNotificationSettings>(`/users/${id}/notification-settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    }, token),
}

// ── Orgs ───────────────────────────────────────────────────

export const orgsApi = {
  list: () => request<ApiOrg[]>("/orgs"),

  get: (id: string, token?: string) =>
    request<ApiOrg>(`/orgs/${id}`, {}, token),

  getOpportunities: (id: string) =>
    request<ApiOpportunity[]>(`/orgs/${id}/opportunities`),

  getApplications: (id: string, token: string) =>
    request<ApiApplication[]>(`/orgs/${id}/applications`, {}, token),

  update: (id: string, data: Partial<ApiOrg>, token: string) =>
    request<ApiOrg>(`/orgs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, token),

  uploadPfp: (id: string, file: File, token: string) =>
    upload<ApiOrg>(`/orgs/${id}/pfp`, file, "file", token),

  getNotificationSettings: (id: string, token: string) =>
    request<OrgNotificationSettings>(`/orgs/${id}/notification-settings`, {}, token),

  updateNotificationSettings: (id: string, settings: OrgNotificationSettings, token: string) =>
    request<OrgNotificationSettings>(`/orgs/${id}/notification-settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    }, token),
}

// ── Opportunities ──────────────────────────────────────────

export type CreateOpportunityData = {
  title: string
  category: string
  difficulty: 0 | 1 | 2
  description: string
  date: string
  duration: number
  location: string
  max_spots: number
  recurring?: string
  drop_in?: boolean
  event_link?: string
  resources_link?: string
  tags?: string[]
}

export const opportunitiesApi = {
  list: () => request<ApiOpportunity[]>("/opportunities"),

  get: (id: string) => request<ApiOpportunity>(`/opportunities/${id}`),

  create: (data: CreateOpportunityData, token: string) =>
    request<ApiOpportunity>("/opportunities", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  update: (id: string, data: Partial<CreateOpportunityData>, token: string) =>
    request<ApiOpportunity>(`/opportunities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, token),

  delete: (id: string, token: string) =>
    request<void>(`/opportunities/${id}`, { method: "DELETE" }, token),

  apply: (id: string, token: string) =>
    request<ApiApplication>(`/opportunities/${id}/apply`, {
      method: "POST",
    }, token),
}

// ── Applications ───────────────────────────────────────────

export const applicationsApi = {
  list: (token: string) =>
    request<ApiApplication[]>("/applications", {}, token),

  update: (id: string, status: "accepted" | "rejected", token: string) =>
    request<ApiApplication>(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }, token),

  delete: (id: string, token: string) =>
    request<void>(`/applications/${id}`, { method: "DELETE" }, token),
}

// ── Notification Settings ─────────────────────────────────

export interface UserNotificationSettings {
  application_accepted: boolean
  opportunity_reminder: boolean
  application_declined: boolean
  opportunity_canceled: boolean
}

export interface OrgNotificationSettings {
  applicant_digest: boolean
  applicant_digest_frequency: "daily" | "weekly"
  accepted_withdrawal: boolean
}

// ── Admin ──────────────────────────────────────────────────

export const adminApi = {
  getUsers: (token: string, params?: { search?: string }) => {
    const qs = params?.search ? `?search=${encodeURIComponent(params.search)}` : ""
    return request<ApiUser[]>(`/admin/users${qs}`, {}, token)
  },

  getOrgs: (token: string, params?: { search?: string; verified?: boolean }) => {
    const p = new URLSearchParams()
    if (params?.search) p.set("search", params.search)
    if (params?.verified !== undefined) p.set("verified", String(params.verified))
    const qs = p.toString() ? `?${p.toString()}` : ""
    return request<ApiOrg[]>(`/admin/orgs${qs}`, {}, token)
  },

  verifyOrg: (id: string, verified: boolean, token: string) =>
    request<ApiOrg>(`/admin/orgs/${id}/verification`, {
      method: "PUT",
      body: JSON.stringify({ verified }),
    }, token),

  getOpportunities: (token: string, params?: { search?: string; category?: string; org_id?: string }) => {
    const p = new URLSearchParams()
    if (params?.search) p.set("search", params.search)
    if (params?.category) p.set("category", params.category)
    if (params?.org_id) p.set("org_id", params.org_id)
    const qs = p.toString() ? `?${p.toString()}` : ""
    return request<ApiOpportunity[]>(`/admin/opportunities${qs}`, {}, token)
  },

  createOpportunity: (data: CreateOpportunityData & { org_id: string }, token: string) =>
    request<ApiOpportunity>("/admin/opportunities", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  updateOpportunity: (id: string, data: Partial<CreateOpportunityData>, token: string) =>
    request<ApiOpportunity>(`/admin/opportunities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, token),

  getOpportunityApplications: (opportunityId: string, token: string) =>
    request<{ opportunity: Partial<ApiOpportunity>; applications: ApiApplication[] }>(
      `/admin/opportunities/${opportunityId}/applications`, {}, token
    ),

  getApplications: (token: string, params?: {
    status?: string
    user_id?: string
    opportunity_id?: string
    org_id?: string
  }) => {
    const p = new URLSearchParams()
    if (params?.status) p.set("status", params.status)
    if (params?.user_id) p.set("user_id", params.user_id)
    if (params?.opportunity_id) p.set("opportunity_id", params.opportunity_id)
    if (params?.org_id) p.set("org_id", params.org_id)
    const qs = p.toString() ? `?${p.toString()}` : ""
    return request<ApiApplication[]>(`/admin/applications${qs}`, {}, token)
  },

  updateApplication: (id: string, status: "accepted" | "rejected", token: string) =>
    request<ApiApplication>(`/admin/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }, token),

  sendCampaign: (data: { audience: "users" | "orgs" | "all"; subject: string; body: string }, token: string) =>
    request<{ sent: number; skipped: number; invalid_emails: string[] }>("/admin/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),
}

// ── Helpers ────────────────────────────────────────────────

/** Map API difficulty number to a readable label */
export function difficultyLabel(d: 0 | 1 | 2): string {
  return ["Easy", "Medium", "Hard"][d] ?? "Easy"
}

/** Map API difficulty to XP reward */
export function difficultyXp(d: 0 | 1 | 2): number {
  return [50, 100, 150][d] ?? 50
}

/** Capitalise the first letter of a category string */
export function normalizeCategory(cat: string): string {
  if (!cat) return "Community"
  return cat.charAt(0).toUpperCase() + cat.slice(1)
}

const causeLabels: Record<string, string> = {
  climate: "Climate Action",
  education: "Education",
  community: "Community",
  "mental-health": "Mental Health",
  arts: "Arts & Culture",
  food: "Food Security",
  animals: "Animal Welfare",
  reconciliation: "Reconciliation",
  environment: "Environment",
  health: "Health",
  technology: "Technology",
  seniors: "Seniors",
  youth: "Youth",
  housing: "Housing",
}

/** Map a cause ID (as stored in the backend) to a human-readable label */
export function normalizeCause(cause: string): string {
  if (!cause) return ""
  return causeLabels[cause.toLowerCase()] ?? normalizeCategory(cause)
}

/** Format an ISO date string for display */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

/** Decode a JWT payload (no signature verification) */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const b64 = token.split(".")[1]
    return JSON.parse(atob(b64.replace(/-/g, "+").replace(/_/g, "/")))
  } catch {
    return null
  }
}

/** Extract the entity ID from a JWT */
export function jwtId(token: string): string | null {
  const payload = decodeJwt(token)
  if (!payload) return null

  // Try common field names used by backends
  const raw = (
    (payload.id as string) ??
    (payload.sub as string) ??
    (payload.user_id as string) ??
    (payload.userId as string) ??
    (payload.org_id as string) ??
    (payload.orgId as string) ??
    (payload._id as string) ??
    null
  )

  // Last resort: find the first string value that looks like an ID
  const id = raw ?? (() => {
    for (const val of Object.values(payload)) {
      if (typeof val === "string" && val.length > 0 && val !== token) return val
      if (typeof val === "number") return String(val)
    }
    return null
  })()

  if (!id) return null

  // Strip SurrealDB table prefix: "users:abc123" → "abc123"
  return id.includes(":") ? id.split(":").slice(1).join(":") : id
}
