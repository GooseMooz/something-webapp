"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Mail, Phone, MapPin, Users, CheckCircle2, Edit3, ExternalLink, Sparkles, Upload, X, Save, Lock, Eye, EyeOff } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { ImageCropModal } from "@/components/image-crop-modal"
import { AnimatePresence as CropPresence } from "framer-motion"
import { orgsApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

export default function OrgProfilePage() {
  const { org, token, userId, setOrg, logout } = useAuth()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [uploadingPfp, setUploadingPfp] = useState(false)
  const pfpInputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<{ src: string; name: string; mime: string } | null>(null)

  // Edit form state
  const [editName, setEditName] = useState(org?.name ?? "")
  const [editDescription, setEditDescription] = useState(org?.description ?? "")
  const [editWebsite, setEditWebsite] = useState(org?.website ?? "")
  const [editPhone, setEditPhone] = useState(org?.phone ?? "")
  const [editAddress, setEditAddress] = useState(org?.address ?? "")
  const [editLocation, setEditLocation] = useState(org?.location ?? "")
  const [editInstagram, setEditInstagram] = useState(org?.instagram ?? "")
  const [editLinkedin, setEditLinkedin] = useState(org?.linkedin ?? "")

  function openEdit() {
    setEditName(org?.name ?? "")
    setEditDescription(org?.description ?? "")
    setEditWebsite(org?.website ?? "")
    setEditPhone(org?.phone ?? "")
    setEditAddress(org?.address ?? "")
    setEditLocation(org?.location ?? "")
    setEditInstagram(org?.instagram ?? "")
    setEditLinkedin(org?.linkedin ?? "")
    setEditOpen(true)
  }

  async function handleSave() {
    if (!token || !userId) return
    setSaving(true)
    try {
      const updated = await orgsApi.update(userId, {
        name: editName,
        description: editDescription || undefined,
        website: editWebsite || undefined,
        phone: editPhone || undefined,
        address: editAddress || undefined,
        location: editLocation || undefined,
        instagram: editInstagram || undefined,
        linkedin: editLinkedin || undefined,
      }, token)
      setOrg(updated)
      setEditOpen(false)
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  function handlePfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB")
      e.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => setCropSrc({ src: reader.result as string, name: file.name, mime: file.type })
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  async function handleCropConfirm(croppedFile: File) {
    if (!token || !userId) return
    setCropSrc(null)
    setUploadingPfp(true)
    try {
      const updated = await orgsApi.uploadPfp(userId, croppedFile, token)
      setOrg(updated)
      toast.success("Profile picture updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingPfp(false)
    }
  }

  const initials = org?.name
    ? org.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "ORG"

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (!token || !userId) return
    setChangingPassword(true)
    try {
      const res = await fetch(`/api/proxy/orgs/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to change password")
      }
      toast.success("Password updated — please sign in again")
      logout()
      router.push("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
      <CropPresence>
        {cropSrc && (
          <ImageCropModal
            src={cropSrc.src}
            fileName={cropSrc.name}
            mimeType={cropSrc.mime}
            onConfirm={handleCropConfirm}
            onCancel={() => setCropSrc(null)}
          />
        )}
      </CropPresence>

      {/* Header */}
      <FadeIn>
        <Card className={cn(cardClass, "overflow-hidden mb-5")}>
          <div className="h-24 bg-gradient-to-r from-matcha/25 via-sky/20 to-honey/15" />
          <CardContent className="relative px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-col items-center -mt-10 sm:flex-row sm:items-end sm:gap-5">
              {/* Logo with upload */}
              <div className="relative group">
                {org?.s3_pfp ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={org.s3_pfp}
                    alt={org.name}
                    className="h-20 w-20 rounded-2xl border-4 border-card object-cover shadow-lg"
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-matcha/20 border-4 border-card text-2xl font-extrabold text-espresso shadow-lg"
                  >
                    {initials}
                  </motion.div>
                )}
                <button
                  onClick={() => pfpInputRef.current?.click()}
                  disabled={uploadingPfp}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-espresso/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Upload logo"
                >
                  {uploadingPfp ? (
                    <div className="h-5 w-5 rounded-full border-2 border-card/30 border-t-card animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-card" />
                  )}
                </button>
                <input ref={pfpInputRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp" className="hidden" onChange={handlePfpChange} />
              </div>

              <div className="mt-2 flex flex-1 flex-col items-center sm:items-start sm:mt-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-espresso">{org?.name ?? "Your Organization"}</h1>
                  <CheckCircle2 className="h-4 w-4 text-matcha-dark" />
                </div>
                <p className="text-xs text-espresso/40">
                  {(org?.categories ?? []).join(", ") || "Nonprofit"}
                </p>
              </div>

              <div className="mt-3 flex gap-2 sm:mt-0">
                <ScaleOnTap>
                  <Button size="sm" onClick={openEdit} className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-xs font-bold h-8">
                    <Edit3 className="mr-1.5 h-3 w-3" /> Edit Profile
                  </Button>
                </ScaleOnTap>
              </div>
            </div>
            {org?.description && (
              <p className="mt-3 text-sm text-espresso/50 leading-relaxed max-w-xl mx-auto sm:mx-0">{org.description}</p>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Details Grid */}
      <div className="grid gap-4 lg:grid-cols-5 mb-4">
        <FadeIn delay={0.06} className="lg:col-span-3">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-espresso mb-4">Organization Details</h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Globe, label: "Website", value: org?.website,
                    href: org?.website ? (org.website.startsWith("http") ? org.website : `https://${org.website}`) : null,
                  },
                  {
                    icon: Mail, label: "Email", value: org?.email,
                    href: org?.email ? `mailto:${org.email}` : null,
                  },
                  {
                    icon: Phone, label: "Phone", value: org?.phone,
                    href: org?.phone ? `tel:${org.phone}` : null,
                  },
                  {
                    icon: MapPin, label: "Location", value: org?.location,
                    href: null,
                  },
                ].filter(item => item.value).map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky/10 text-sky-dark shrink-0">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-espresso/30">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="block text-sm font-semibold text-espresso hover:text-sky-dark transition-colors truncate">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-espresso truncate">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {(org?.instagram || org?.linkedin) && (
                <div className="mt-5 pt-4 border-t border-border/40">
                  <h4 className="text-xs font-bold text-espresso/40 mb-3">Social Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {org.instagram && (
                      <a
                        href={`https://instagram.com/${org.instagram.replace(/^@/, "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full bg-latte px-3 py-1.5 text-xs font-semibold text-espresso/60 hover:text-espresso hover:bg-latte/80 transition-colors"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        {org.instagram.startsWith("@") ? org.instagram : `@${org.instagram}`}
                      </a>
                    )}
                    {org.linkedin && (
                      <a
                        href={org.linkedin.startsWith("http") ? org.linkedin : `https://${org.linkedin}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full bg-latte px-3 py-1.5 text-xs font-semibold text-espresso/60 hover:text-espresso hover:bg-latte/80 transition-colors"
                      >
                        <ExternalLink className="h-2.5 w-2.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5">
              <h3 className="text-sm font-bold text-espresso mb-4">How volunteers see you</h3>
              <div className="rounded-xl border border-border/60 bg-latte/20 p-4">
                <div className="flex items-center gap-3 mb-3">
                  {org?.s3_pfp ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={org.s3_pfp} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-matcha/15 text-base font-extrabold text-matcha-dark">{initials}</div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-espresso">{org?.name ?? "Your Org"}</h4>
                      <CheckCircle2 className="h-3.5 w-3.5 text-matcha-dark" />
                    </div>
                    <p className="text-[10px] text-espresso/40">{(org?.categories ?? []).join(", ") || "Nonprofit"}</p>
                  </div>
                </div>
                {org?.description && (
                  <p className="text-xs text-espresso/45 leading-relaxed mb-3 line-clamp-2">{org.description}</p>
                )}
                <div className="flex items-center gap-4 text-[10px] text-espresso/35 mb-3">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-matcha-dark" /> Verified</span>
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-honey" /> Active</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Accepting volunteers</span>
                </div>
                {org?.email && (
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
                    <a href={`mailto:${org.email}`}
                      className="flex items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-[10px] font-semibold text-sky-dark hover:bg-sky/20 transition-colors">
                      <Mail className="h-2.5 w-2.5" /> {org.email}
                    </a>
                    {org.website && (
                      <a href={org.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full bg-matcha/10 px-2.5 py-1 text-[10px] font-semibold text-matcha-dark hover:bg-matcha/20 transition-colors">
                        <ExternalLink className="h-2.5 w-2.5" /> Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Change Password */}
      <FadeIn>
        <Card className={cn(cardClass, "mt-4")}>
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-espresso mb-4 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-espresso/40" />Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-espresso/50">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Your current password"
                    className="rounded-xl h-10 text-sm pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/30 hover:text-espresso/60">
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-espresso/50">New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="rounded-xl h-10 text-sm pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/30 hover:text-espresso/60">
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-espresso/50">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="rounded-xl h-10 text-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="rounded-full bg-espresso text-card hover:bg-espresso/90 font-bold text-sm h-10 mt-1 self-start px-6"
              >
                {changingPassword ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-card/20 border-t-card" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Edit Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false) }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl">
              <div className="h-1 bg-gradient-to-r from-sky/50 to-matcha/40 rounded-t-2xl" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-extrabold text-espresso">Edit Organization</h2>
                  <button onClick={() => setEditOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-latte transition-colors text-espresso/40 hover:text-espresso">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Organization Name</Label>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Description</Label>
                    <textarea rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)}
                      placeholder="Tell volunteers about your organization..."
                      className="rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Website (optional)</Label>
                    <Input value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder="https://yourorg.org" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Phone (optional)</Label>
                    <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+1 604 000 0000" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Address (optional)</Label>
                    <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="123 Main St" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Location</Label>
                    <Input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="Vancouver, BC" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Instagram (optional)</Label>
                    <Input value={editInstagram} onChange={e => setEditInstagram(e.target.value)} placeholder="@yourorg" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">LinkedIn (optional)</Label>
                    <Input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="linkedin.com/company/..." className="rounded-xl h-10 text-sm" />
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-border/40">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-full bg-espresso text-card hover:bg-espresso/90 font-bold text-sm h-10">
                    {saving ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-card/20 border-t-card" />
                    ) : (
                      <><Save className="mr-1.5 h-4 w-4" />Save Changes</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-full border-border/60 text-sm font-semibold text-espresso/50 h-10 px-5">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
