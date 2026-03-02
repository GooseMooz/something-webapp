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
  User,
  Building2,
  Heart,
  Leaf,
  BookOpen,
  Palette,
  Users,
  Brain,
  Utensils,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FadeIn, ScaleOnTap } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

type Role = "youth" | "organization"

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

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedCauses, setSelectedCauses] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 3
  const progress = ((step + 1) / totalSteps) * 100

  function toggleCause(id: string) {
    setSelectedCauses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        router.push("/opportunities")
      }, 1500)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  const canProceed =
    step === 0
      ? role !== null
      : step === 1
        ? selectedSkills.length > 0
        : selectedCauses.length > 0

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute right-[12%] top-[15%] h-44 w-44 rounded-full bg-sky/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] bottom-[15%] h-36 w-36 rounded-full bg-matcha/10 blur-3xl" />

      <FadeIn className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matcha text-espresso">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-espresso">Something</span>
        </Link>

        {/* Progress Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-matcha"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <span className="text-xs font-bold text-espresso/40">
            {step + 1}/{totalSteps}
          </span>
        </div>

        <Card className="border-border/60 bg-card shadow-xl shadow-espresso/5">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Role & Basic Info ─── */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h1 className="text-2xl font-extrabold text-espresso">
                      Join Something
                    </h1>
                    <p className="mt-1 text-sm text-espresso/50">
                      Create your account in about 3 minutes.
                    </p>
                  </div>

                  {/* Role Picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRole("youth")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all",
                        role === "youth"
                          ? "border-matcha bg-matcha/10"
                          : "border-border hover:border-matcha/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          role === "youth"
                            ? "bg-matcha text-espresso"
                            : "bg-muted text-espresso/40"
                        )}
                      >
                        <User className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-espresso">
                        I{"'"}m a Youth
                      </span>
                      <span className="text-xs text-espresso/40">
                        Volunteer & earn XP
                      </span>
                    </button>
                    <button
                      onClick={() => setRole("organization")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all",
                        role === "organization"
                          ? "border-sky bg-sky/10"
                          : "border-border hover:border-sky/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl",
                          role === "organization"
                            ? "bg-sky text-espresso"
                            : "bg-muted text-espresso/40"
                        )}
                      >
                        <Building2 className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-espresso">
                        Organization
                      </span>
                      <span className="text-xs text-espresso/40">
                        Post opportunities
                      </span>
                    </button>
                  </div>

                  {/* Basic Fields */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="name" className="text-espresso/70">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Cathy Luo"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="signup-email" className="text-espresso/70">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="cathy@example.com"
                        className="rounded-xl border-border bg-background h-11"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="signup-password" className="text-espresso/70">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="rounded-xl border-border bg-background h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso/60"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Skills & Interests ─── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-espresso">
                      Your Skills
                    </h2>
                    <p className="mt-1 text-sm text-espresso/50">
                      Pick the skills you bring to the table. You can always add more later.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => {
                      const isSelected = selectedSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all",
                            isSelected
                              ? "border-matcha bg-matcha/15 text-matcha-dark"
                              : "border-border text-espresso/50 hover:border-matcha/40 hover:text-espresso"
                          )}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {skill}
                        </button>
                      )
                    })}
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bio" className="text-espresso/70">
                      Short Bio (optional)
                    </Label>
                    <textarea
                      id="bio"
                      rows={3}
                      placeholder="Tell us a bit about yourself..."
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Causes / Mission Alignment ─── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-espresso">
                      What Matters to You?
                    </h2>
                    <p className="mt-1 text-sm text-espresso/50">
                      Pick the causes close to your heart. We{"'"}ll match you with
                      opportunities that align.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {causeOptions.map((cause) => {
                      const isSelected = selectedCauses.includes(cause.id)
                      return (
                        <button
                          key={cause.id}
                          onClick={() => toggleCause(cause.id)}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border-2 p-4 transition-all text-left",
                            isSelected
                              ? "border-matcha bg-matcha/10"
                              : "border-border hover:border-matcha/30"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl shrink-0",
                              isSelected
                                ? "bg-matcha text-espresso"
                                : "bg-muted text-espresso/40"
                            )}
                          >
                            <cause.icon className="h-4 w-4" />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              isSelected ? "text-espresso" : "text-espresso/60"
                            )}
                          >
                            {cause.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="rounded-full font-semibold text-espresso/60 hover:text-espresso"
                >
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
                  className="rounded-full bg-matcha px-6 font-bold text-espresso hover:bg-matcha-dark h-11"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-5 w-5 rounded-full border-2 border-espresso/20 border-t-espresso"
                    />
                  ) : step === totalSteps - 1 ? (
                    <>
                      Create Account
                      <Sparkles className="ml-1.5 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </ScaleOnTap>
            </div>

            {step === 0 && (
              <p className="mt-6 text-center text-sm text-espresso/50">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-matcha-dark hover:underline"
                >
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
