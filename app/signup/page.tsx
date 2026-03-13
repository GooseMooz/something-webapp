"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Leaf,
  BookOpen,
  Palette,
  Users,
  Brain,
  Utensils,
  Shield,
  MapPin,
  Smile,
  Briefcase,
  Repeat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { haptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

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
  "Event Planning",
  "Social Media",
  "Photography",
  "Public Speaking",
  "Coding",
  "Design",
  "Writing",
  "Teaching",
  "Cooking",
  "First Aid",
  "Languages",
  "Music",
]

const frequencyOptions = [
  { id: "weekly", label: "Weekly", sub: "I want to make it a habit" },
  { id: "monthly", label: "Monthly", sub: "Once or twice a month" },
  { id: "occasionally", label: "Occasionally", sub: "When something comes up" },
  { id: "unsure", label: "Not sure yet", sub: "I'll figure it out" },
]

const motivationOptions = [
  { id: "skills", label: "Build real skills", icon: Briefcase },
  { id: "causes", label: "Support causes I care about", icon: Heart },
  { id: "people", label: "Meet new people", icon: Smile },
  { id: "hours", label: "Log required hours", icon: Repeat },
  { id: "explore", label: "Explore Vancouver", icon: MapPin },
  { id: "portfolio", label: "Strengthen my portfolio", icon: BookOpen },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedCauses, setSelectedCauses] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null)
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null)

  const totalSteps = 4
  const progress = ((step + 1) / totalSteps) * 100

  function toggleCause(id: string) {
    haptic("selection")
    setSelectedCauses((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])
  }
  function toggleSkill(skill: string) {
    haptic("selection")
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])
  }
  function toggleMotivation(id: string) {
    haptic("selection")
    setSelectedMotivations((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id])
  }

  function handleSocialSignup(provider: "google" | "apple") {
    haptic("medium")
    setSocialLoading(provider)
    setTimeout(() => {
      haptic("light")
      setSocialLoading(null)
      setStep(1)
    }, 1000)
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      haptic("light")
      setStep(step + 1)
    } else {
      haptic("success")
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        router.push("/opportunities")
      }, 1500)
    }
  }

  function handleBack() {
    if (step > 0) { haptic("selection"); setStep(step - 1) }
  }

  const canProceed =
    step === 0 ? true
    : step === 1 ? selectedSkills.length > 0
    : step === 2 ? selectedCauses.length > 0
    : selectedFrequency !== null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none absolute right-[12%] top-[15%] h-48 w-48 rounded-full bg-sky/8 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] bottom-[15%] h-40 w-40 rounded-full bg-matcha/8 blur-3xl" />
      <div className="pointer-events-none absolute left-[45%] top-[10%] h-32 w-32 rounded-full bg-honey/8 blur-3xl" />

      <FadeIn className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso text-cream">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-xl tracking-wide text-espresso">Something</span>
        </Link>

        {/* Progress */}
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
            {step + 1} of {totalSteps}
          </span>
        </div>

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

                  {/* Social signup */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleSocialSignup("google")}
                      disabled={socialLoading !== null}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-medium text-espresso/80 transition-all hover:bg-latte/40 hover:border-border disabled:opacity-60"
                    >
                      {socialLoading === "google" ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-espresso/20 border-t-espresso" />
                      ) : (
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      Sign up with Google
                    </button>

                    <button
                      onClick={() => handleSocialSignup("apple")}
                      disabled={socialLoading !== null}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-medium text-espresso/80 transition-all hover:bg-latte/40 hover:border-border disabled:opacity-60"
                    >
                      {socialLoading === "apple" ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-espresso/20 border-t-espresso" />
                      ) : (
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                      )}
                      Sign up with Apple
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-3 font-serif italic text-espresso/40">or use email</span>
                    </div>
                  </div>

                  {/* Email fields */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="name" className="text-sm font-medium text-espresso/70">Full Name</Label>
                      <Input id="name" placeholder="Maya Chen" className="rounded-xl border-border/60 bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-espresso/70">Email</Label>
                      <Input id="signup-email" type="email" placeholder="maya@example.com" className="rounded-xl border-border/60 bg-background h-11" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-espresso/70">Password</Label>
                      <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Create a password" className="rounded-xl border-border/60 bg-background h-11 pr-10" />
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

              {/* ── Step 4: Screening questions ── */}
              {step === 3 && (
                <motion.div key="step-3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-2xl tracking-wide text-espresso">Last few things</h2>
                    <p className="font-serif mt-1 text-sm italic text-espresso/50">
                      This helps us surface the right opportunities for you.
                    </p>
                  </div>

                  {/* Frequency */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-espresso">How often do you want to volunteer?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {frequencyOptions.map((opt) => (
                        <button key={opt.id} onClick={() => { setSelectedFrequency(opt.id); haptic("selection") }} className={cn("rounded-xl border-2 p-3 text-left transition-all", selectedFrequency === opt.id ? "border-matcha bg-matcha/10" : "border-border/60 hover:border-matcha/25")}>
                          <p className={cn("text-sm font-medium", selectedFrequency === opt.id ? "text-espresso" : "text-espresso/70")}>{opt.label}</p>
                          <p className="font-serif text-[11px] italic text-espresso/40 mt-0.5">{opt.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-espresso">
                      What are you hoping to get from volunteering? <span className="font-serif italic text-espresso/35 font-normal">(pick all that apply)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {motivationOptions.map((opt) => {
                        const isSelected = selectedMotivations.includes(opt.id)
                        return (
                          <button key={opt.id} onClick={() => toggleMotivation(opt.id)} className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all", isSelected ? "border-sky bg-sky/15 text-sky-dark" : "border-border/70 text-espresso/55 hover:border-sky/40 hover:text-espresso")}>
                            {isSelected && <Check className="h-3 w-3" />}
                            <opt.icon className="h-3 w-3" />
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
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
                  disabled={!canProceed || isLoading}
                  className="rounded-full bg-matcha px-6 font-semibold text-espresso hover:bg-matcha-dark h-11"
                >
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
              <p className="mt-5 text-center font-serif text-sm italic text-espresso/50">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold not-italic text-matcha-dark hover:underline">
                  Log in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
