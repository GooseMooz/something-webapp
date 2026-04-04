"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Eye, EyeOff, ArrowRight, ArrowLeft, Check,
  Heart, Leaf, BookOpen, Palette, Users, Brain, Utensils,
  Shield, Building2, User,
  Camera, FileText, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { haptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { authApi, usersApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const causeOptions = [
  { id: "climate", label: "Climate Action", icon: Leaf },
  { id: "education", label: "Education", icon: BookOpen },
  { id: "community", label: "Community", icon: Users },
  { id: "mental-health", label: "Mental Health", icon: Brain },
  { id: "arts", label: "Arts & Culture", icon: Palette },
  { id: "food", label: "Food Security", icon: Utensils },
  { id: "animals", label: "Animal Welfare", icon: Heart },
  { id: "reconciliation", label: "Reconciliation", icon: Shield },
]

const skillOptions = [
  "Event Planning", "Social Media", "Photography", "Public Speaking",
  "Coding", "Design", "Writing", "Teaching", "Cooking", "First Aid",
  "Languages", "Music",
]

const frequencyOptions = [
  { id: "low",    label: "Monthly",   sub: "Once or twice a month" },
  { id: "medium", label: "Bi-weekly", sub: "A couple times a month" },
  { id: "high",   label: "Weekly",    sub: "I want to make it a habit" },
]

export default function SignupPage() {
  const router = useRouter()
  const { loginAsUser, setUser, type, isLoading } = useAuth()
  const isSigningUp = useRef(false)

  useEffect(() => {
    if (isLoading || isSigningUp.current) return
    if (type === "user") router.replace("/opportunities")
    else if (type === "org") router.replace("/org/opportunities")
  }, [isLoading, type, router])

  const [accountType, setAccountType] = useState<"user" | "org" | null>(null)
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedCauses, setSelectedCauses] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Step 0 form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")

  // Step 4 — uploads (stored after registration completes)
  const [registrationToken, setRegistrationToken] = useState<string | null>(null)
  const [registrationUserId, setRegistrationUserId] = useState<string | null>(null)
  const [pfpFile, setPfpFile] = useState<File | null>(null)
  const [pfpPreview, setPfpPreview] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const pfpInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Progress bar only covers the 4 questionnaire steps (step 4 is post-registration)
  const QUESTIONNAIRE_STEPS = 4
  const progress = (Math.min(step, QUESTIONNAIRE_STEPS) / QUESTIONNAIRE_STEPS) * 100

  function toggleCause(id: string) {
    haptic("selection")
    setSelectedCauses((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])
  }
  function toggleSkill(skill: string) {
    haptic("selection")
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])
  }
  async function handleNext() {
    if (step < 3) {
      haptic("light")
      setStep(step + 1)
    } else {
      // Step 3 complete — register, login, update profile, then show upload step
      haptic("success")
      setSubmitting(true)
      isSigningUp.current = true
      try {
        await authApi.register({ name, email, password })
        const { token } = await authApi.login({ email, password })
        await loginAsUser(token)
        const userId = localStorage.getItem("sth_auth_id")
        if (userId) {
          const updated = await usersApi.update(userId, {
            bio: bio || undefined,
            skills: selectedSkills,
            categories: selectedCauses,
            intensity: selectedFrequency ?? undefined,
          }, token)
          setUser(updated)
          setRegistrationToken(token)
          setRegistrationUserId(userId)
        }
        setStep(4)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Registration failed")
      } finally {
        setSubmitting(false)
      }
    }
  }

  async function handleFinish(skip = false) {
    if (!skip && (pfpFile || resumeFile) && registrationToken && registrationUserId) {
      setUploading(true)
      try {
        let updated
        if (pfpFile) updated = await usersApi.uploadPfp(registrationUserId, pfpFile, registrationToken)
        if (resumeFile) updated = await usersApi.uploadResume(registrationUserId, resumeFile, registrationToken)
        if (updated) setUser(updated)
      } catch {
        toast.error("Upload failed — you can add them from your profile later.")
      } finally {
        setUploading(false)
      }
    }
    isSigningUp.current = false
    haptic("success")
    router.push("/opportunities")
  }

  function handlePfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPfpFile(file)
    setPfpPreview(URL.createObjectURL(file))
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeFile(file)
  }

  function handleBack() {
    if (step > 0 && step < 4) { haptic("selection"); setStep(step - 1) }
  }

  const canProceed =
    step === 0 ? (name.trim().length > 0 && email.trim().length > 0 && password.length >= 6)
    : step === 1 ? selectedSkills.length > 0
    : step === 2 ? selectedCauses.length > 0
    : selectedFrequency !== null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute right-[12%] top-[15%] h-48 w-48 rounded-full bg-sky/8 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] bottom-[15%] h-40 w-40 rounded-full bg-matcha/8 blur-3xl" />
      <div className="pointer-events-none absolute left-[45%] top-[10%] h-32 w-32 rounded-full bg-honey/8 blur-3xl" />

      <FadeIn className="w-full max-w-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso text-cream">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-xl tracking-wide text-espresso">Something</span>
        </Link>

        {accountType === null ? (
          <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-border/60 bg-card shadow-xl shadow-espresso/[0.05]">
              <CardContent className="p-6 md:p-8 flex flex-col gap-6">
                <div>
                  <h1 className="font-display text-2xl tracking-wide text-espresso">Join Something</h1>
                  <p className="font-serif mt-1 text-sm italic text-espresso/50">Are you volunteering or posting opportunities?</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { haptic("selection"); setAccountType("user") }}
                    className="flex items-center gap-4 rounded-2xl border-2 border-border/60 p-4 text-left transition-all hover:border-matcha/50 hover:bg-matcha/5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-matcha/15 text-matcha-dark shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-espresso">I'm a volunteer</p>
                      <p className="font-serif text-xs italic text-espresso/45 mt-0.5">Find opportunities and track your impact</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-espresso/25 shrink-0" />
                  </button>
                  <button
                    onClick={() => { haptic("selection"); router.push("/org/signup") }}
                    className="flex items-center gap-4 rounded-2xl border-2 border-border/60 p-4 text-left transition-all hover:border-sky/50 hover:bg-sky/5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky/15 text-sky-dark shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-espresso">I'm an organization</p>
                      <p className="font-serif text-xs italic text-espresso/45 mt-0.5">Post opportunities and manage volunteers</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-espresso/25 shrink-0" />
                  </button>
                </div>
                <p className="text-center font-serif text-sm italic text-espresso/50">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold not-italic text-matcha-dark hover:underline">Log in</Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
        <>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/80">
            <motion.div
              className="h-full rounded-full bg-matcha"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <span className="font-serif text-xs italic text-espresso/40">
            {step < 4 ? `${step + 1} of 4` : "Almost done"}
          </span>
        </div>

        {step === 4 ? (
          <motion.div key="upload-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-border/60 bg-card shadow-xl shadow-espresso/[0.05]">
            <CardContent className="p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h2 className="font-display text-2xl tracking-wide text-espresso">One last touch</h2>
                <p className="font-serif mt-1 text-sm italic text-espresso/50">
                  Add a photo and resume so orgs know who you are. You can always do this later.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button type="button" onClick={() => pfpInputRef.current?.click()} className="relative group">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-dashed border-border/60 bg-latte/40 flex items-center justify-center transition-all group-hover:border-matcha/50 group-hover:bg-matcha/5">
                    {pfpPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pfpPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-7 w-7 text-espresso/25 group-hover:text-matcha/60 transition-colors" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-matcha text-espresso shadow-sm">
                    <Camera className="h-3.5 w-3.5" />
                  </div>
                </button>
                <p className="text-xs text-espresso/40">PNG, JPG, GIF or WebP</p>
                {pfpFile && (
                  <button type="button" onClick={() => { setPfpFile(null); setPfpPreview(null) }} className="flex items-center gap-1 text-xs text-espresso/40 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" /> Remove
                  </button>
                )}
                <input ref={pfpInputRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp" className="hidden" onChange={handlePfpChange} />
              </div>

              <div>
                <div
                  onClick={() => resumeInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && resumeInputRef.current?.click()}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-all cursor-pointer",
                    resumeFile ? "border-matcha/40 bg-matcha/5" : "border-border/60 bg-latte/20 hover:border-matcha/30 hover:bg-matcha/5"
                  )}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", resumeFile ? "bg-matcha/20" : "bg-latte")}>
                    <FileText className={cn("h-5 w-5", resumeFile ? "text-matcha-dark" : "text-espresso/30")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    {resumeFile ? (
                      <>
                        <p className="text-sm font-semibold text-espresso truncate">{resumeFile.name}</p>
                        <p className="text-xs text-espresso/40">{(resumeFile.size / 1024).toFixed(0)} KB · PDF</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-espresso/60">Upload your resume</p>
                        <p className="text-xs text-espresso/35">PDF only</p>
                      </>
                    )}
                  </div>
                  {resumeFile && (
                    <button type="button" onClick={e => { e.stopPropagation(); setResumeFile(null) }} className="ml-auto text-espresso/30 hover:text-destructive transition-colors shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
              </div>

              <div className="flex flex-col items-center gap-3 pt-1">
                <ScaleOnTap>
                  <Button onClick={() => handleFinish(false)} disabled={uploading} className="rounded-full bg-matcha px-8 font-semibold text-espresso hover:bg-matcha-dark h-11">
                    {uploading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                    ) : (
                      <>Finish setup <Sparkles className="ml-1.5 h-4 w-4" /></>
                    )}
                  </Button>
                </ScaleOnTap>
                <button type="button" onClick={() => handleFinish(true)} disabled={uploading} className="font-serif text-sm italic text-espresso/40 hover:text-espresso/60 transition-colors">
                  Skip for now →
                </button>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        ) : (
        <Card className="border-border/60 bg-card shadow-xl shadow-espresso/[0.05]">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Account creation ── */}
              {step === 0 && (
                <motion.div key="step-0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                  <div>
                    <h1 className="font-display text-2xl tracking-wide text-espresso">Join Something</h1>
                    <p className="font-serif mt-1 text-sm italic text-espresso/50">Takes about 3 minutes to set up.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="name" className="text-sm font-medium text-espresso/70">Full Name</Label>
                      <Input id="name" placeholder="Maya Chen" value={name} onChange={e => setName(e.target.value)} className="rounded-xl border-border/60 bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-espresso/70">Email</Label>
                      <Input id="signup-email" type="email" placeholder="maya@example.com" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl border-border/60 bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-espresso/70">Password</Label>
                      <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl border-border/60 bg-background h-11 pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60" aria-label={showPassword ? "Hide password" : "Show password"}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Skills ── */}
              {step === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-display text-2xl tracking-wide text-espresso">What do you bring?</h2>
                    <p className="font-serif mt-1 text-sm italic text-espresso/50">
                      Pick the skills you have. You can always add more later.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => {
                      const isSelected = selectedSkills.includes(skill)
                      return (
                        <button key={skill} onClick={() => toggleSkill(skill)} className={cn("flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all", isSelected ? "border-matcha bg-matcha/15 text-matcha-dark" : "border-border/70 text-espresso/55 hover:border-matcha/40 hover:text-espresso")}>
                          {isSelected && <Check className="h-3 w-3" />}
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bio" className="text-sm font-medium text-espresso/70">
                      A little about you <span className="font-serif italic text-espresso/35">(optional)</span>
                    </Label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="What brings you to Something? What do you hope to get from it?"
                      className="rounded-xl border border-border/60 bg-background px-3 py-2 font-serif text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Causes ── */}
              {step === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-display text-2xl tracking-wide text-espresso">What matters to you?</h2>
                    <p className="font-serif mt-1 text-sm italic text-espresso/50">
                      Pick the causes close to your heart — we&apos;ll match you with opportunities that fit.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {causeOptions.map((cause) => {
                      const isSelected = selectedCauses.includes(cause.id)
                      return (
                        <button key={cause.id} onClick={() => toggleCause(cause.id)} className={cn("flex items-center gap-3 rounded-xl border-2 p-3.5 transition-all text-left", isSelected ? "border-matcha bg-matcha/10" : "border-border/60 hover:border-matcha/30")}>
                          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", isSelected ? "bg-matcha text-espresso" : "bg-muted text-espresso/40")}>
                            <cause.icon className="h-4 w-4" />
                          </div>
                          <span className={cn("text-sm font-medium", isSelected ? "text-espresso" : "text-espresso/60")}>{cause.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Screening ── */}
              {step === 3 && (
                <motion.div key="step-3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-2xl tracking-wide text-espresso">Last few things</h2>
                    <p className="font-serif mt-1 text-sm italic text-espresso/50">
                      This helps us surface the right opportunities for you.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-espresso">How often do you want to volunteer?</p>
                    <div className="grid grid-cols-3 gap-2">
                      {frequencyOptions.map((opt) => (
                        <button key={opt.id} onClick={() => { setSelectedFrequency(opt.id); haptic("selection") }} className={cn("rounded-xl border-2 p-3 text-left transition-all", selectedFrequency === opt.id ? "border-matcha bg-matcha/10" : "border-border/60 hover:border-matcha/25")}>
                          <p className={cn("text-sm font-medium", selectedFrequency === opt.id ? "text-espresso" : "text-espresso/70")}>{opt.label}</p>
                          <p className="font-serif text-[11px] italic text-espresso/40 mt-0.5">{opt.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-7 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="ghost" onClick={handleBack} className="rounded-full font-medium text-espresso/55 hover:text-espresso">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              <ScaleOnTap>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed || submitting}
                  className="rounded-full bg-matcha px-6 font-semibold text-espresso hover:bg-matcha-dark h-11"
                >
                  {submitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                  ) : step === 3 ? (
                    <>Create Account <Sparkles className="ml-1.5 h-4 w-4" /></>
                  ) : (
                    <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>
                  )}
                </Button>
              </ScaleOnTap>
            </div>

            {step === 0 && (
              <p className="mt-5 text-center font-serif text-sm italic text-espresso/50">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold not-italic text-matcha-dark hover:underline">
                  Log in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
        )}
        </>
        )}
      </FadeIn>
    </div>
  )
}
