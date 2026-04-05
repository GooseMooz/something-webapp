"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award, Clock, CheckCircle2, Flame, Edit3,
  Share2, Heart, Sparkles, X, Upload, FileText, Save, Lock, Eye, EyeOff,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { XpRing } from "@/components/xp-ring"
import { FadeIn, StaggerChildren, StaggerItem, ScaleOnTap } from "@/components/motion-wrapper"
import { streakData } from "@/lib/mock-data"
import { usersApi, normalizeCause } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const cardClass = "border-border/60 bg-card shadow-sm shadow-espresso/[0.03]"

function Asterisk({ size = 20, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {[0, 45, 90, 135].map((angle) => (
        <line key={angle} x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2.2" strokeLinecap="round"
          transform={`rotate(${angle} 12 12)`} />
      ))}
    </svg>
  )
}

export default function ProfilePage() {
  const { user, token, userId, setUser, logout } = useAuth()
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
  const [localPfpUrl, setLocalPfpUrl] = useState<string | null>(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const pfpInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Edit form state — initialised from live user data
  const [editName, setEditName] = useState(user?.name ?? "")
  const [editBio, setEditBio] = useState(user?.bio ?? "")
  const [editPhone, setEditPhone] = useState(user?.phone ?? "")
  const [editInstagram, setEditInstagram] = useState(user?.instagram ?? "")
  const [editLinkedin, setEditLinkedin] = useState(user?.linkedin ?? "")

  // Gamification — no backend support yet
  const level = 1
  const xp = 0
  const xpToNextLevel = 500
  const earnedBadges: { id: string; name: string }[] = []

  function openEdit() {
    setEditName(user?.name ?? "")
    setEditBio(user?.bio ?? "")
    setEditPhone(user?.phone ?? "")
    setEditInstagram(user?.instagram ?? "")
    setEditLinkedin(user?.linkedin ?? "")
    setEditOpen(true)
  }

  async function handleSave() {
    if (!token || !userId) return
    setSaving(true)
    try {
      const updated = await usersApi.update(userId, {
        name: editName,
        bio: editBio || undefined,
        phone: editPhone || undefined,
        instagram: editInstagram || undefined,
        linkedin: editLinkedin || undefined,
      }, token)
      setUser(updated)
      setEditOpen(false)
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile")
    } finally {
      setSaving(false)
    }
  }

  async function handlePfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !token || !userId) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB")
      return
    }

    let croppedFile: File
    if (file.type === "image/gif") {
      croppedFile = file
    } else {
      const bitmap = await createImageBitmap(file)
      const size = Math.min(bitmap.width, bitmap.height)
      const sx = (bitmap.width - size) / 2
      const sy = (bitmap.height - size) / 2
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      canvas.getContext("2d")!.drawImage(bitmap, sx, sy, size, size, 0, 0, size, size)
      bitmap.close()
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), "image/jpeg", 0.92)
      )
      croppedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })
    }

    setUploadingPfp(true)
    const objectUrl = URL.createObjectURL(croppedFile)
    setLocalPfpUrl(objectUrl)
    try {
      const updated = await usersApi.uploadPfp(userId, croppedFile, token)
      setUser(updated)
      toast.success("Profile picture updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setLocalPfpUrl(null)
      URL.revokeObjectURL(objectUrl)
      setUploadingPfp(false)
    }
  }

  async function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !token || !userId) return
    setUploadingResume(true)
    try {
      const updated = await usersApi.uploadResume(userId, file, token)
      setUser(updated)
      toast.success("Resume uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploadingResume(false)
      e.target.value = ""
    }
  }

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
      const res = await fetch(`/api/proxy/users/${userId}/password`, {
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

      {/* Profile Header */}
      <FadeIn>
        <Card className={cn(cardClass, "overflow-hidden mb-5")}>
          {/* Banner */}
          <div className="relative h-24 overflow-hidden bg-gradient-to-r from-matcha/25 via-honey/15 to-rose/20">
            {[
              { x: "8%", y: "30%", color: "var(--matcha)", size: 8, delay: 0 },
              { x: "20%", y: "60%", color: "var(--honey)", size: 12, delay: 0.3 },
              { x: "35%", y: "25%", color: "var(--rose)", size: 6, delay: 0.6 },
              { x: "50%", y: "65%", color: "var(--caramel)", size: 10, delay: 0.2 },
              { x: "65%", y: "20%", color: "var(--sky)", size: 8, delay: 0.8 },
              { x: "78%", y: "55%", color: "var(--matcha)", size: 6, delay: 0.4 },
              { x: "88%", y: "30%", color: "var(--honey)", size: 10, delay: 1.0 },
            ].map((dot, i) => (
              <motion.div key={i} className="absolute rounded-full opacity-50"
                style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, backgroundColor: dot.color }}
                animate={{ y: [0, -6, 0], opacity: [0.5, 0.75, 0.5] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: dot.delay }} />
            ))}
            <motion.div className="absolute" style={{ left: "42%", top: "15%" }}
              animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
              <Asterisk size={16} color="var(--espresso)" className="opacity-20" />
            </motion.div>
          </div>

          <CardContent className="relative px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-col items-center -mt-10 sm:flex-row sm:items-end sm:gap-5">
              {/* Avatar with upload */}
              <div className="relative group">
                {(localPfpUrl || user?.s3_pfp) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={localPfpUrl ?? user!.s3_pfp!}
                    alt={user?.name ?? ""}
                    className="h-20 w-20 rounded-2xl border-4 border-card object-cover shadow-lg"
                  />
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-matcha/20 border-4 border-card text-2xl font-extrabold text-espresso shadow-lg"
                  >
                    {user?.name?.split(" ").map(n => n[0]).join("") ?? "?"}
                  </motion.div>
                )}
                <button
                  onClick={() => pfpInputRef.current?.click()}
                  disabled={uploadingPfp}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-espresso/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Upload profile picture"
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
                <h1 className="text-lg font-extrabold text-espresso">{user?.name ?? "Your Name"}</h1>
                {(user?.instagram || user?.linkedin) && (
                  <p className="text-xs text-espresso/40 flex items-center gap-1.5 mt-0.5 flex-wrap justify-center sm:justify-start">
                    {user?.instagram && (
                      <a
                        href={`https://instagram.com/${user.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-espresso transition-colors"
                      >
                        {user.instagram.startsWith("@") ? user.instagram : `@${user.instagram}`}
                      </a>
                    )}
                    {user?.instagram && user?.linkedin && <span className="text-espresso/15">|</span>}
                    {user?.linkedin && (
                      <a
                        href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-espresso transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </p>
                )}
              </div>

              <div className="mt-3 flex gap-2 sm:mt-0">
                <ScaleOnTap>
                  <Button variant="outline" size="sm" className="rounded-full border-border/60 text-xs font-semibold text-espresso/50 h-8">
                    <Share2 className="mr-1.5 h-3 w-3" />Share
                  </Button>
                </ScaleOnTap>
                <ScaleOnTap>
                  <Button size="sm" onClick={openEdit} className="rounded-full bg-espresso text-card hover:bg-espresso/90 text-xs font-bold h-8">
                    <Edit3 className="mr-1.5 h-3 w-3" />Edit Profile
                  </Button>
                </ScaleOnTap>
              </div>
            </div>

            {user?.bio && (
              <p className="mt-3 text-sm text-espresso/50 leading-relaxed max-w-xl mx-auto sm:mx-0">{user.bio}</p>
            )}

            {/* Resume upload row */}
            <div className="mt-4 flex items-center gap-3">
              {user?.s3_pdf ? (
                <a href={user.s3_pdf} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-sky/30 bg-sky/8 px-3 py-1.5 text-[11px] font-semibold text-sky-dark hover:bg-sky/15 transition-colors">
                  <FileText className="h-3 w-3" /> View Resume
                </a>
              ) : null}
              <button
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploadingResume}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1.5 text-[11px] font-semibold text-espresso/45 hover:text-espresso hover:border-border transition-colors"
              >
                {uploadingResume ? (
                  <div className="h-3 w-3 rounded-full border border-espresso/20 border-t-espresso animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                {user?.s3_pdf ? "Replace Resume" : "Upload Resume"}
              </button>
              <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Level + Stats */}
      <div className="grid gap-4 lg:grid-cols-5 mb-4">
        <FadeIn delay={0.06} className="lg:col-span-3">
          <Card className={cn(cardClass, "h-full")}>
            <CardContent className="p-5 flex flex-col sm:flex-row gap-5 items-center">
              <XpRing xp={xp} xpToNextLevel={xpToNextLevel} level={level} size={100} />
              <div className="flex flex-col gap-3 flex-1 w-full">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-base font-extrabold text-espresso">Community Builder</h3>
                  <Badge className="rounded-full border-none bg-matcha/12 text-matcha-dark text-xs font-bold">
                    {"Lv."}{level}
                  </Badge>
                </div>
                <Progress
                  value={(xp / xpToNextLevel) * 100}
                  className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-matcha [&>div]:to-matcha-dark [&>div]:rounded-full"
                />
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="flex items-center gap-1 rounded-full bg-honey/10 px-2.5 py-1 text-[10px] font-bold text-espresso/60">
                    <Flame className="h-3 w-3 text-honey" />
                    {streakData.current}{" day streak"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { label: "Hours",  value: "0",  icon: Clock },
                    { label: "Tasks",  value: "0",  icon: CheckCircle2 },
                    { label: "Badges", value: String(earnedBadges.length), icon: Award },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-0.5 rounded-xl bg-latte/50 p-2.5">
                      <stat.icon className="h-3.5 w-3.5 text-espresso/25" />
                      <span className="text-base font-extrabold text-espresso">{stat.value}</span>
                      <span className="text-[9px] font-semibold text-espresso/30">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Skills + Causes */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            <Card className={cn(cardClass, "flex-1")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-matcha-dark" />Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.skills ?? []).length > 0 ? (user?.skills ?? []).map((skill, i) => {
                    const colors = ["bg-matcha/15 text-matcha-dark","bg-honey/15 text-espresso/70","bg-sky/15 text-sky-dark","bg-caramel/15 text-espresso/60","bg-rose/12 text-rose"]
                    return (
                      <motion.div key={skill} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Badge className={cn("rounded-full border-none text-xs font-semibold", colors[i % colors.length])}>{skill}</Badge>
                      </motion.div>
                    )
                  }) : <p className="text-xs text-espresso/30 italic">No skills added yet</p>}
                </div>
              </CardContent>
            </Card>
            <Card className={cn(cardClass, "flex-1")}>
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-espresso mb-3 flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose" />Causes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.categories ?? []).length > 0 ? (user?.categories ?? []).map((cause, i) => {
                    const colors = ["bg-rose/12 text-rose","bg-matcha/15 text-matcha-dark","bg-caramel/15 text-espresso/60","bg-honey/15 text-espresso/70","bg-sky/15 text-sky-dark"]
                    return (
                      <motion.div key={cause} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Badge className={cn("rounded-full border-none text-xs font-semibold", colors[i % colors.length])}>{normalizeCause(cause)}</Badge>
                      </motion.div>
                    )
                  }) : <p className="text-xs text-espresso/30 italic">No causes selected yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>

      {/* Badges */}
      <FadeIn delay={0.15}>
        <Card className={cardClass}>
          <CardContent className="p-5">
            <h3 className="text-sm font-bold text-espresso mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-honey" />
              {"Earned Badges ("}{earnedBadges.length}{")"}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <Asterisk size={13} color="var(--honey)" />
              </motion.div>
            </h3>
            {earnedBadges.length === 0 ? (
              <p className="font-serif text-sm italic text-espresso/30">No badges yet — complete your first opportunity to earn one.</p>
            ) : (
              <StaggerChildren className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {earnedBadges.map((badge, idx) => {
                  const badgeColors = [
                    { bg: "bg-matcha/20", text: "text-matcha-dark", ring: "ring-matcha/30" },
                    { bg: "bg-honey/20",  text: "text-espresso/70", ring: "ring-honey/30" },
                    { bg: "bg-sky/20",    text: "text-sky-dark",    ring: "ring-sky/30" },
                    { bg: "bg-rose/15",   text: "text-rose",        ring: "ring-rose/25" },
                    { bg: "bg-caramel/20",text: "text-espresso/60", ring: "ring-caramel/30" },
                  ]
                  const color = badgeColors[idx % badgeColors.length]
                  return (
                    <StaggerItem key={badge.id}>
                      <div className="flex flex-col items-center gap-1.5">
                        <motion.div whileHover={{ rotate: 10, scale: 1.12 }} transition={{ type: "spring", stiffness: 300 }}
                          className={cn("flex h-12 w-12 items-center justify-center rounded-xl ring-1", color.bg, color.text, color.ring)}>
                          <Award className="h-5 w-5" />
                        </motion.div>
                        <span className={cn("text-[9px] font-semibold text-center leading-tight", color.text, "opacity-80")}>{badge.name}</span>
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerChildren>
            )}
          </CardContent>
        </Card>
      </FadeIn>

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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false) }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl"
            >
              <div className="h-1 bg-gradient-to-r from-matcha/50 to-sky/40 rounded-t-2xl" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-extrabold text-espresso">Edit Profile</h2>
                  <button onClick={() => setEditOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-latte transition-colors text-espresso/40 hover:text-espresso">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Full Name</Label>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Bio</Label>
                    <textarea rows={3} value={editBio} onChange={e => setEditBio(e.target.value)}
                      placeholder="A little about yourself..."
                      className="rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Phone (optional)</Label>
                    <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+1 604 000 0000" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">Instagram (optional)</Label>
                    <Input value={editInstagram} onChange={e => setEditInstagram(e.target.value)} placeholder="@yourhandle" className="rounded-xl h-10 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-espresso/50">LinkedIn (optional)</Label>
                    <Input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="linkedin.com/in/..." className="rounded-xl h-10 text-sm" />
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
