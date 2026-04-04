"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Eye, EyeOff, ArrowRight, ArrowLeft, Check,
  Building2, Leaf, Landmark, UtensilsCrossed, Globe, Phone, MapPin, Camera, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"
import { authApi, orgsApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const orgTypeOptions = [
  { id: "environmental", label: "Environmental", icon: Leaf, description: "Parks, conservation, climate orgs" },
  { id: "civic", label: "Civic & Community", icon: Landmark, description: "Newcomer services, neighbourhood houses" },
  { id: "food", label: "Food & Agriculture", icon: UtensilsCrossed, description: "Food banks, community kitchens, farms" },
]

export default function OrgSignupPage() {
  const router = useRouter()
  const { loginAsOrg, setOrg } = useAuth()

  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form fields
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [description, setDescription] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")

  // Step 3 — pfp upload (post-registration)
  const [registrationToken, setRegistrationToken] = useState<string | null>(null)
  const [registrationOrgId, setRegistrationOrgId] = useState<string | null>(null)
  const [pfpFile, setPfpFile] = useState<File | null>(null)
  const [pfpPreview, setPfpPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const pfpInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 3
  const progress = ((step + 1) / totalSteps) * 100

  async function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      try {
        // 1. Register org
        await authApi.orgRegister({
          name: orgName,
          email,
          password,
          location: location || "Vancouver",
        })
        // 2. Login to get token
        const { token } = await authApi.orgLogin({ email, password })
        // 3. Populate auth context
        await loginAsOrg(token)
        // 4. Update org with additional info
        const orgId = localStorage.getItem("sth_auth_id")
        if (orgId) {
          const updatedOrg = await orgsApi.update(orgId, {
            description: description || undefined,
            website: website || undefined,
            phone: phone || undefined,
            categories: selectedType ? [selectedType] : undefined,
          }, token)
          setOrg(updatedOrg)
          setRegistrationToken(token)
          setRegistrationOrgId(orgId)
        }
        setStep(3)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Registration failed")
        setIsLoading(false)
      }
    }
  }

  async function handleFinish(skip = false) {
    if (!skip && pfpFile && registrationToken && registrationOrgId) {
      setUploading(true)
      try {
        const updated = await orgsApi.uploadPfp(registrationOrgId, pfpFile, registrationToken)
        setOrg(updated)
      } catch {
        toast.error("Upload failed — you can add it from your profile later.")
      } finally {
        setUploading(false)
      }
    }
    router.push("/org/dashboard")
  }

  function handlePfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPfpFile(file)
    setPfpPreview(URL.createObjectURL(file))
    e.target.value = ""
  }

  function handleBack() {
    if (step > 0 && step < 3) setStep(step - 1)
  }

  const canProceed =
    step === 0 ? (orgName.trim().length > 0 && email.trim().length > 0 && password.length >= 6)
    : step === 1 ? selectedType !== null
    : true

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute right-[12%] top-[15%] h-44 w-44 rounded-full bg-sky/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] bottom-[15%] h-36 w-36 rounded-full bg-matcha/10 blur-3xl" />

      <FadeIn className="w-full max-w-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha text-espresso">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-espresso">Something</span>
        </Link>

        {step < 3 && (
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-sky"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
            <span className="text-xs font-bold text-espresso/40">{step + 1}/{totalSteps}</span>
          </div>
        )}

        {step === 3 ? (
          <motion.div key="upload-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-border/60 bg-card shadow-xl shadow-espresso/5">
              <CardContent className="p-6 md:p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-espresso">One last touch</h2>
                  <p className="mt-1 text-sm text-espresso/50">Add a logo so volunteers know who you are. You can always do this later.</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <button type="button" onClick={() => pfpInputRef.current?.click()} className="relative group">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-dashed border-border/60 bg-latte/40 flex items-center justify-center transition-all group-hover:border-sky/50 group-hover:bg-sky/5">
                      {pfpPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pfpPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-7 w-7 text-espresso/25 group-hover:text-sky/60 transition-colors" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-sky text-espresso shadow-sm">
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
                <div className="flex flex-col items-center gap-3 pt-1">
                  <ScaleOnTap>
                    <Button onClick={() => handleFinish(false)} disabled={uploading} className="rounded-full bg-sky px-8 font-bold text-espresso hover:bg-sky-dark h-11">
                      {uploading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                      ) : (
                        <>Finish setup <Sparkles className="ml-1.5 h-4 w-4" /></>
                      )}
                    </Button>
                  </ScaleOnTap>
                  <button type="button" onClick={() => handleFinish(true)} disabled={uploading} className="text-sm text-espresso/40 hover:text-espresso/60 transition-colors">
                    Skip for now →
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
        <Card className="border-border/60 bg-card shadow-xl shadow-espresso/5">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Organization Info ── */}
              {step === 0 && (
                <motion.div key="step-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/15 text-sky-dark">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h1 className="text-2xl font-extrabold text-espresso">Organization Signup</h1>
                    </div>
                    <p className="text-sm text-espresso/50">Register your organization to post volunteer opportunities.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-name" className="text-espresso/70">Organization Name</Label>
                      <Input id="org-name" placeholder="Vancouver Community Kitchen" value={orgName} onChange={e => setOrgName(e.target.value)} className="rounded-xl border-border bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-email" className="text-espresso/70">Email</Label>
                      <Input id="org-email" type="email" placeholder="contact@yourorg.org" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl border-border bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-password" className="text-espresso/70">Password</Label>
                      <div className="relative">
                        <Input id="org-password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl border-border bg-background h-11 pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60" aria-label={showPassword ? "Hide password" : "Show password"}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Organization Type ── */}
              {step === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-2xl font-extrabold text-espresso">Organization Type</h2>
                    <p className="mt-1 text-sm text-espresso/50">What category best describes your organization?</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {orgTypeOptions.map((type) => {
                      const isSelected = selectedType === type.id
                      return (
                        <button key={type.id} onClick={() => setSelectedType(type.id)} className={cn("flex items-center gap-4 rounded-2xl border-2 p-4 transition-all text-left", isSelected ? "border-sky bg-sky/10" : "border-border hover:border-sky/40")}>
                          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shrink-0", isSelected ? "bg-sky text-espresso" : "bg-muted text-espresso/40")}>
                            <type.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-espresso">{type.label}</span>
                            <p className="text-xs text-espresso/45 mt-0.5">{type.description}</p>
                          </div>
                          {isSelected && <Check className="ml-auto h-5 w-5 text-sky-dark shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="org-description" className="text-espresso/70">Brief Description</Label>
                    <textarea id="org-description" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell us about your organization and mission..." className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none" />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Contact & Location ── */}
              {step === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-2xl font-extrabold text-espresso">Contact Details</h2>
                    <p className="mt-1 text-sm text-espresso/50">Help volunteers get in touch with you.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-phone" className="text-espresso/70">
                        <Phone className="inline h-3.5 w-3.5 mr-1.5" />Phone (optional)
                      </Label>
                      <Input id="org-phone" type="tel" placeholder="(604) 555-0123" value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl border-border bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-website" className="text-espresso/70">
                        <Globe className="inline h-3.5 w-3.5 mr-1.5" />Website (optional)
                      </Label>
                      <Input id="org-website" type="url" placeholder="https://yourorg.org" value={website} onChange={e => setWebsite(e.target.value)} className="rounded-xl border-border bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-location" className="text-espresso/70">
                        <MapPin className="inline h-3.5 w-3.5 mr-1.5" />Location
                      </Label>
                      <Input id="org-location" placeholder="Vancouver, BC" value={location} onChange={e => setLocation(e.target.value)} className="rounded-xl border-border bg-background h-11" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-latte/50 p-4 text-xs text-espresso/50 leading-relaxed">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                    {"We'll"} review your organization within 2-3 business days.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="ghost" onClick={handleBack} className="rounded-full font-semibold text-espresso/60 hover:text-espresso">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />Back
                </Button>
              ) : (
                <Link href="/for-organizations">
                  <Button variant="ghost" className="rounded-full font-semibold text-espresso/60 hover:text-espresso">
                    <ArrowLeft className="mr-1.5 h-4 w-4" />Back
                  </Button>
                </Link>
              )}
              <ScaleOnTap>
                <Button onClick={handleNext} disabled={!canProceed || isLoading} className="rounded-full bg-sky px-6 font-bold text-espresso hover:bg-sky-dark h-11">
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso" />
                  ) : step === totalSteps - 1 ? (
                    <>Create Account <Sparkles className="ml-1.5 h-4 w-4" /></>
                  ) : (
                    <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>
                  )}
                </Button>
              </ScaleOnTap>
            </div>

            {step === 0 && (
              <p className="mt-6 text-center text-sm text-espresso/50">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-sky-dark hover:underline">Log in</Link>
              </p>
            )}
          </CardContent>
        </Card>
        )}
      </FadeIn>
    </div>
  )
}
